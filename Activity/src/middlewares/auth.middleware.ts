import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpException } from './error.middleware';

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

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token=req.cookies.auth_token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new HttpException(401, 'No token provided');
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string };
    if (!decoded) {
      throw new HttpException(401, 'Invalid or expired token');
    }

    // Attach user to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new HttpException(401, 'Invalid token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new HttpException(401, 'Token expired'));
    } else {
      next(error);
    }
  }
};

export const authorize = (roles: string[] = []) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // If no roles are specified, allow any authenticated user
      if (roles.length === 0) {
        return next();
      }

      // Check if user has required role
      // This is a simplified example - you might want to check user roles from the database
      // or include them in the JWT token
      const userRole = 'user'; // This should come from your user object or database
      
      if (!roles.includes(userRole)) {
        throw new HttpException(403, 'Forbidden: Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
