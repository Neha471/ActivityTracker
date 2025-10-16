import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { HttpException } from './error.middleware';

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new HttpException(401, 'No token provided');
    }

    // Verify token
    const decoded = authService.verifyToken(token);
    if (!decoded) {
      throw new HttpException(401, 'Invalid or expired token');
    }

    // Attach user to request object
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (_roles: string[] = []) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // In a real application, you would check the user's roles here
      // For now, we'll just check if the user is authenticated
      if (!req.user) {
        throw new HttpException(403, 'Not authorized');
      }
      
      // Example role check (implement your own role logic)
      // const hasRole = roles.includes(req.user.role);
      // if (roles.length && !hasRole) {
      //   throw new HttpException(403, 'Insufficient permissions');
      // }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};
