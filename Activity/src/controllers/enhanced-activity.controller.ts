import { Request, Response, NextFunction } from 'express';
import { enhancedActivityService } from '../services/enhanced-activity.service';
import { ActivityRequest } from '../types/activity.types';

export class EnhancedActivityController {
  
  // ==================== CATEGORY CONTROLLERS ====================

  async createCategory(req: ActivityRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const { name, color, icon } = req.body;
      
      const category = await enhancedActivityService.createCategory({
        userId,
        name,
        color,
        icon,
      });

      res.status(201).json({
        success: true,
        data: category,
      });
    } catch (error) {
      console.error('Create category error:', error);
      next(error);
    }
  }

  async getAllCategories(req: ActivityRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const categories = await enhancedActivityService.getAllCategories(userId);

      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req: ActivityRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const categoryId = req.params.id;
      const category = await enhancedActivityService.getCategoryById(categoryId, userId);

      res.json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: ActivityRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const categoryId = req.params.id;
      const { name, color, icon } = req.body;

      const updatedCategory = await enhancedActivityService.updateCategory(
        categoryId,
        userId,
        { name, color, icon }
      );

      res.json({
        success: true,
        data: updatedCategory,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: ActivityRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const categoryId = req.params.id;
      await enhancedActivityService.deleteCategory(categoryId, userId);

      res.json({
        success: true,
        message: 'Category deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== ACTIVITY CONTROLLERS ====================

  async createActivity(req: ActivityRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const {
        title,
        description,
        categoryId,
        frequency,
        color,
        icon,
        notes,
      } = req.body;
      
      const activity = await enhancedActivityService.createActivity({
        userId,
        title,
        description,
        categoryId,
        frequency,
        color,
        icon,
        notes,
      });

      res.status(201).json({
        success: true,
        data: activity,
      });
    } catch (error) {
      console.error('Create activity error:', error);
      next(error);
    }
  }

  async getActivity(req: ActivityRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const activityId = req.params.id;
      const activity = await enhancedActivityService.getActivityById(activityId, userId);

      res.json({
        success: true,
        data: activity,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllActivities(req: ActivityRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const activities = await enhancedActivityService.getAllActivities(userId);

      res.json({
        success: true,
        data: activities,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateActivity(req: ActivityRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const activityId = req.params.id;
      const {
        title,
        description,
        categoryId,
        frequency,
        color,
        icon,
        notes,
        isActive,
      } = req.body;

      const updatedActivity = await enhancedActivityService.updateActivity(
        activityId,
        userId,
        {
          title,
          description,
          categoryId,
          frequency,
          color,
          icon,
          notes,
          isActive,
        }
      );

      res.json({
        success: true,
        data: updatedActivity,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteActivity(req: ActivityRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const activityId = req.params.id;
      await enhancedActivityService.deleteActivity(activityId, userId);

      res.json({
        success: true,
        message: 'Activity deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== ACTIVITY LOG CONTROLLERS ====================

  async markActivityComplete(req: ActivityRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const activityId = req.params.id;
      const { date, notes } = req.body;

      const log = await enhancedActivityService.markActivityComplete(activityId, userId, date, notes);

      res.json({
        success: true,
        data: log,
      });
    } catch (error) {
      next(error);
    }
  }

  async markActivityMissed(req: ActivityRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const activityId = req.params.id;
      const { date, notes } = req.body;

      const log = await enhancedActivityService.markActivityMissed(activityId, userId, date, notes);

      res.json({
        success: true,
        data: log,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateActivityLog(req: ActivityRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const activityId = req.params.id;
      const { date } = req.params;
      const { status, notes, completedAt } = req.body;

      const updatedLog = await enhancedActivityService.updateActivityLog(
        activityId,
        date,
        userId,
        { status, notes, completedAt }
      );

      res.json({
        success: true,
        data: updatedLog,
      });
    } catch (error) {
      next(error);
    }
  }

  async getActivityLogs(req: ActivityRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const { startDate, endDate } = req.query;

      const logs = await enhancedActivityService.getActivityLogs(
        userId,
        startDate as string,
        endDate as string
      );

      res.json({
        success: true,
        data: logs,
      });
    } catch (error) {
      next(error);
    }
  }

  async getActivityLogsForActivity(req: ActivityRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const activityId = req.params.id;
      const logs = await enhancedActivityService.getActivityLogsForActivity(activityId, userId);

      res.json({
        success: true,
        data: logs,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== STATISTICS CONTROLLERS ====================

  async getActivityStats(req: ActivityRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const stats = await enhancedActivityService.getActivityStats(userId);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async getActivityProgress(req: ActivityRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const activityId = req.params.id;
      const progress = await enhancedActivityService.getActivityProgress(activityId, userId);

      res.json({
        success: true,
        data: progress,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== UTILITY CONTROLLERS ====================

  async getActivitiesDueTodayOrDate(req: ActivityRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const date = req.query?.date;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const activities = await enhancedActivityService.getActivitiesDueTodayOrDate(userId, date as string);

      res.json({
        success: true,
        data: activities,
      });
    } catch (error) {
      next(error);
    }
  }

  async getActivitiesDueThisWeek(req: ActivityRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const activities = await enhancedActivityService.getActivitiesDueThisWeek(userId);

      res.json({
        success: true,
        data: activities,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const enhancedActivityController = new EnhancedActivityController();
export default enhancedActivityController;