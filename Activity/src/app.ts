import express, { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import dotenv from 'dotenv';

import activityRouter from './routes/activity.routes';
import healthRouter from './routes/health.route';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { db } from './config/database';

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}

class App {
  public app: Application;
  public port: number;
  private skipDbInit: boolean;

  constructor(skipDbInit = false) {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3001', 10);
    this.skipDbInit = skipDbInit;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    
    if (!this.skipDbInit) {
      this.initializeDatabase();
    }
  }

  private initializeMiddlewares() {
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
    }));

    this.app.use(helmet());

    if (process.env.NODE_ENV === 'development') {
      const morgan = require('morgan');
      this.app.use(morgan('dev'));
    }
    const limiter = rateLimit({
      max: 100,
      windowMs: 60 * 60 * 1000, // 1 hour
      message: 'Too many requests from this IP, please try again in an hour!',
    });
    this.app.use('/api', limiter);

    this.app.use(express.json({ limit: '10kb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10kb' }));
    this.app.use(cookieParser());
    this.app.use(mongoSanitize());
    this.app.use(xss());
    this.app.use(
      hpp({
        whitelist: ['title', 'category', 'frequency'],
      })
    );
    this.app.use(compression());
  }

  private initializeRoutes() {
    
    this.app.use('/health', healthRouter);
    this.app.use('/api/v1/activities', activityRouter);
    this.app.all('*', (req: Request, _res: Response, next: NextFunction) => {
      next(new Error(`Can't find ${req.originalUrl} on this server!`));
    });
    this.app.use('/', (req: Request, res: Response) => {
      res.status(200).json({ message: 'Activity Tracker API' });
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorHandler);
    this.app.use(notFoundHandler);
  }

  private async initializeDatabase() {
    try {
      await db.connect();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Failed to connect to database:', error);
      process.exit(1);
    }
  }

  public async closeDatabaseConnection() {
    try {
      await db.disconnect();
      console.log('Database connection closed');
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }

  public getServer() {
    return this.app;
  }

  public listen() {
    const server = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port} in ${process.env.NODE_ENV} mode \n http://localhost:${this.port}`);
    });

    process.on('unhandledRejection', (err: Error) => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down...');
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    process.on('uncaughtException', (err: Error) => {
      console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
      server.close(() => {
        console.log('💥 Process terminated!');
      });
    });

    return server;
  }
}

const appInstance = new App(true);

export const app = appInstance.app;

if (require.main === module) {
  const server = new App();
  server.listen();
}

export default appInstance;
