import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import authService from '../services/auth.service';
import { HttpException, ValidationError } from '../middlewares/error.middleware';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError(errors.array()[0].msg);
      }

      const { email, password, firstName, lastName } = req.body;
      const result = await authService.register({
        email,
        password,
        firstName,
        lastName,
      });

      res.status(201).json({
        status: 'success',
        data: {
          user: result.user,
          token: result.token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new HttpException(400, 'Email and password are required');
      }
      const result = await authService.login(email, password, req);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      const name = result.user.first_name + ' ' + result.user.last_name;

      res.json({
        status: 'success',
        data: {
          user: {name, ...result.user},
          token: result.token,
          refreshToken: result.refreshToken
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.headers['x-refresh-token'] as string;
      if (!refreshToken) {
        throw new HttpException(401, 'Missing refresh token in X-Refresh-Token header');
      }
      const result = await authService.refreshToken(refreshToken, req);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        status: 'success',
        data: {
          token: result.token,
          refreshToken: result.refreshToken
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // Get refresh token from X-Refresh-Token header
      const refreshToken = req.headers['x-refresh-token'] as string;
      if (!refreshToken) {
        throw new HttpException(401, 'Missing refresh token in X-Refresh-Token header');
      }

      // Clear the refresh token cookie
      res.clearCookie('refreshToken');

      res.json({
        status: 'success',
        message: 'Logged out successfully',
      });
      await authService.revokeToken(refreshToken, req);
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req?.user?.id) {
        throw new HttpException(401, 'Unauthorized');
      }
      const userId = req.user.id;
      const user = await authService.getCurrentUser(userId);
      res.json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
