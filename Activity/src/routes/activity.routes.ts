import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { enhancedActivityController } from '../controllers/enhanced-activity.controller';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Create a new activity
router.post('/', enhancedActivityController.createActivity.bind(enhancedActivityController));

// Get all activities for the authenticated user
router.get('/', enhancedActivityController.getAllActivities.bind(enhancedActivityController));

// Get a specific activity by ID
router.get('/:id', enhancedActivityController.getActivity.bind(enhancedActivityController));

// Update an activity
router.patch('/:id', enhancedActivityController.updateActivity.bind(enhancedActivityController));

// Delete an activity
router.delete('/:id', enhancedActivityController.deleteActivity.bind(enhancedActivityController));

// Create a new category
router.post('/category', enhancedActivityController.createCategory.bind(enhancedActivityController));

// Get all categories for the authenticated user
router.get('/category/all', enhancedActivityController.getAllCategories.bind(enhancedActivityController));

// Get a specific category by ID
router.get('/category/:id', enhancedActivityController.getCategoryById.bind(enhancedActivityController));

// Update a category
router.patch('/category/:id', enhancedActivityController.updateCategory.bind(enhancedActivityController));

// Delete a category
router.delete('/category/:id', enhancedActivityController.deleteCategory.bind(enhancedActivityController));

export default router;
