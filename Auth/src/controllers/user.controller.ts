import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import userRepository, { UpdateUserInput } from '../repositories/user.repository';
import { HttpException, ValidationError } from '../middlewares/error.middleware';

class UserController {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try { 
      if(!req?.user?.id)
        throw new HttpException(401, 'Unauthorized');
      const userId = req.user.id;
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new HttpException(404, 'User not found');
      }

      res.json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            isActive: user.is_active,
            isVerified: user.is_verified,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if(!req?.user?.id)
        throw new HttpException(401, 'Unauthorized');
      const userId = req.user.id;
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError(errors.array()[0].msg);
      }

      const { firstName, lastName } = req.body;
      const updateData: UpdateUserInput = {
        firstName,
        lastName,
      };

      const user = await userRepository.updateUser(userId, updateData);
      if (!user) {
        throw new HttpException(404, 'User not found');
      }

      res.json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            isActive: user.is_active,
            isVerified: user.is_verified,
            updatedAt: user.updated_at,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      if(!req?.user?.id)
        throw new HttpException(401, 'Unauthorized');
      const userId = req.user.id;
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError(errors.array()[0].msg);
      }

      const { currentPassword, newPassword } = req.body;

      // Get user with password
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new HttpException(404, 'User not found');
      }

      // Verify current password
      const isPasswordValid = await userRepository.verifyPassword(user, currentPassword);
      if (!isPasswordValid) {
        throw new HttpException(400, 'Current password is incorrect');
      }

      // Update password
      await userRepository.updatePassword(user.id, newPassword);

      res.json({
        status: 'success',
        message: 'Password updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deactivateAccount(req: Request, res: Response, next: NextFunction) {
    try {
      if(!req?.user?.id)
        throw new HttpException(401, 'Unauthorized');
      const userId = req.user.id;
      const { password } = req.body;

      // Get user with password
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new HttpException(404, 'User not found');
      }

      // Verify password
      const isPasswordValid = await userRepository.verifyPassword(user, password);
      if (!isPasswordValid) {
        throw new HttpException(400, 'Password is incorrect');
      }

      // Deactivate account
      await userRepository.updateUser(user.id, { isActive: false });

      res.json({
        status: 'success',
        message: 'Account deactivated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
