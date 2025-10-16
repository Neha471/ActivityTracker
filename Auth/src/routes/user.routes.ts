import { Router } from 'express';
import { body } from 'express-validator';
import userController from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get current user profile
router.get('/profile', userController.getProfile);

// Update user profile
router.patch(
  '/profile',
  [
    body('firstName').optional().trim().escape(),
    body('lastName').optional().trim().escape(),
  ],
  userController.updateProfile
);

// Change password
router.post(
  '/change-password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/\d/)
      .withMessage('Password must contain at least one number'),
  ],
  userController.changePassword
);

// Deactivate account
router.post(
  '/deactivate',
  [
    body('password').notEmpty().withMessage('Password is required'),
  ],
  userController.deactivateAccount
);

export default router;
