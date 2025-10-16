import { Request, Response, NextFunction } from 'express';
import { activityService } from '../services/activity.service';
import { ActivityRequest } from '../types/activity.types';

export class ActivityController {
  async createActivity(req: ActivityRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      console.log("🚀 ~ ActivityController ~ createActivity ~ userId:", userId)
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const { title, category, frequency, notes } = req.body;
      
      const activity = await activityService.createActivity({
        userId,
        title,
        category,
        frequency,
        notes,
      });

      res.status(201).json({
        success: true,
        data: activity,
      });
    } catch (error) {
      console.log("🚀 ~ ActivityController ~ createActivity ~ error:", error)
      next(error);
    }
  }

  async getActivity(req: ActivityRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const activityId = parseInt(req.params.id, 10);
      const activity = await activityService.getActivityById(activityId, userId);

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

      const activities = await activityService.getAllActivities(userId);

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

      const activityId = parseInt(req.params.id, 10);
      const { title, category, frequency, notes, isActive } = req.body;

      const updatedActivity = await activityService.updateActivity(
        activityId,
        userId,
        {
          title,
          category,
          frequency,
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

      const activityId = parseInt(req.params.id, 10);
      await activityService.deleteActivity(activityId, userId);

      res.json({
        success: true,
        message: 'Activity deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const activityController = new ActivityController();
export default activityController;
