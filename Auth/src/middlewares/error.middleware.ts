import { Request, Response, NextFunction } from 'express';

// Custom error types
export class HttpException extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends HttpException {
  constructor(message: string = 'Validation Error') {
    super(400, message, 'VALIDATION_ERROR');
  }
}

export class UnauthorizedError extends HttpException {
  constructor(message: string = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends HttpException {
  constructor(message: string = 'Forbidden') {
    super(403, message, 'FORBIDDEN');
  }
}

export class NotFoundError extends HttpException {
  constructor(message: string = 'Not Found') {
    super(404, message, 'NOT_FOUND');
  }
}

export class ConflictError extends HttpException {
  constructor(message: string = 'Conflict') {
    super(409, message, 'CONFLICT');
  }
}

// Error handler middleware
export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', error);

  // Handle known error types
  if (error instanceof HttpException) {
    return res.status(error.status).json({
      status: 'error',
      statusCode: error.status,
      code: error.code || 'INTERNAL_ERROR',
      message: error.message,
    });
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      statusCode: 401,
      code: 'INVALID_TOKEN',
      message: 'Invalid token',
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      statusCode: 401,
      code: 'TOKEN_EXPIRED',
      message: 'Token has expired',
    });
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: error.message,
    });
  }

  // Handle database errors
  if (error.name === 'QueryFailedError') {
    // Handle specific database errors
    const dbError = error as any;
    
    // Handle unique constraint violation
    if (dbError.code === '23505') {
      return res.status(409).json({
        status: 'error',
        statusCode: 409,
        code: 'DUPLICATE_ENTRY',
        message: 'A record with this data already exists',
      });
    }

    // Handle foreign key constraint violation
    if (dbError.code === '23503') {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        code: 'FOREIGN_KEY_VIOLATION',
        message: 'Referenced record not found',
      });
    }
  }

  // Default error response
  res.status(500).json({
    status: 'error',
    statusCode: 500,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
    // Include stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};
