import { Router } from 'express';
import { activityController } from '../controllers/activity.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Create a new activity
router.post('/', activityController.createActivity.bind(activityController));

// Get all activities for the authenticated user
router.get('/', activityController.getAllActivities.bind(activityController));

// Get a specific activity by ID
router.get('/:id', activityController.getActivity.bind(activityController));

// Update an activity
router.patch('/:id', activityController.updateActivity.bind(activityController));

// Delete an activity
router.delete('/:id', activityController.deleteActivity.bind(activityController));

export default router;
