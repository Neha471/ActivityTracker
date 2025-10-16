import { NextFunction, Request, Response } from 'express';

export class HttpException extends Error {
  status: number;
  message: string;
  details?: any;

  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.message = message;
    this.details = details;
  }
}

export const errorHandler = (
  err: Error | HttpException,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof HttpException) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
      details: err.details,
    });
  }

  // Handle other types of errors
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};
