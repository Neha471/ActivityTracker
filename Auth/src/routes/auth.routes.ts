import { Router } from 'express';
import { body } from 'express-validator';
import authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const authRouter = Router();

// Register a new user
authRouter.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/\d/)
      .withMessage('Password must contain at least one number'),
    body('firstName').optional().trim().escape(),
    body('lastName').optional().trim().escape(),
  ],
  authController.register
);

// Login user
authRouter.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  authController.login
);

// Refresh access token
authRouter.post(
  '/refresh-token',
  authController.refreshToken
);

// Logout user
authRouter.post('/logout', authController.logout);

// Get current user (protected route)
authRouter.get('/me', authenticate, authController.getCurrentUser);

export default authRouter;
