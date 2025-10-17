import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { enhancedActivityController } from '../controllers/enhanced-activity.controller';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// overview page || activity stats

router.get('/', enhancedActivityController.getActivityStats.bind(enhancedActivityController));

router.get('/due-today', enhancedActivityController.getActivitiesDueToday.bind(enhancedActivityController));

router.get('/due-week', enhancedActivityController.getActivitiesDueThisWeek.bind(enhancedActivityController));
export default router;
