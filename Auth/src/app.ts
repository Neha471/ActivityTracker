import express = require('express');
import type { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

import healthRouter from './routes/health.route';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';

import { errorHandler } from './middlewares/error.middleware';
import db from './config/database';

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
  public port: string | number;

  constructor(skipDbInit: boolean = false) {
    this.app = express();
    this.port = process.env.PORT || 3000;

    if (!skipDbInit) {
      this.initializeDatabase();
    }
    
    this.initializeSecurity();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await db.connect();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection error:', error);
      process.exit(1);
    }
  }

  private initializeSecurity(): void {
    this.app.use(helmet());
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true
    }));

    const limiter = rateLimit({
      max: 100, 
      windowMs: 15 * 60 * 1000, 
      message: 'Too many requests from this IP, please try again after 15 minutes'
    });
    this.app.use('/api', limiter);

    this.app.use(mongoSanitize());

    this.app.use(xss());

    this.app.use(hpp({
      whitelist: [
        'duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'
      ]
    }));
  }

  private initializeMiddlewares(): void {
    // Ignore favicon.ico requests
    this.app.get('/favicon.ico', (_req, res) => {
      res.status(204).end(); // No content
    });

    this.app.use(express.json({ limit: '10kb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10kb' }));
    
    this.app.use(cookieParser());
    
    this.app.use(compression());
  }

  private initializeRoutes(): void {
    this.app.use('/api/health', healthRouter);
    
    this.app.use('/api/v1/auth', authRouter);
    this.app.use('/api/v1/users', userRouter);
    
    this.app.get('/', (_req: Request, res: Response) => {
      res.json({
        status: 'success',
        message: 'Auth Service API',
        documentation: '/api-docs',
        version: '1.0.0'
      });
    });
    
    this.app.all('*', (req: Request, _res: Response, next: NextFunction) => {
      const err = new Error(`Can't find ${req.originalUrl} on this server!`) as any;
      err.status = 'fail';
      err.statusCode = 404;
      next(err);
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server is running on http://localhost:${this.port}`);
    });
    
    process.on('unhandledRejection', (err: Error) => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down...');
      console.error(err.name, err.message);
      process.exit(1);
    });
    
    process.on('uncaughtException', (err: Error) => {
      console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
      console.error(err.name, err.message);
      process.exit(1);
    });
  }
}

// Create a single instance of the App with database initialization skipped
const appInstance = new App(true);

// Export the Express app for testing purposes
export const app = appInstance.app;

// Start the server if this file is run directly (not imported as a module)
if (require.main === module) {
  const PORT = process.env.PORT || 8000;
  
  // Initialize database first, then start the server
  db.connect()
    .then(() => {
      appInstance.app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Failed to connect to the database:', error);
      process.exit(1);
    });
}
