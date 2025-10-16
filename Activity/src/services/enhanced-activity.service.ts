import { HttpException } from '../middlewares/error.middleware';
import { enhancedActivityRepository } from '../repositories/enhanced-activity.repository';
import {
  Activity,
  ActivityCategory,
  ActivityLog,
  CreateActivityInput,
  UpdateActivityInput,
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateActivityLogInput,
  UpdateActivityLogInput,
  ActivityStats,
  ActivityProgress,
} from '../types/activity.types';

export class EnhancedActivityService {
  
  // ==================== CATEGORY SERVICES ====================

  async createCategory(input: CreateCategoryInput): Promise<ActivityCategory> {
    try {
      return await enhancedActivityRepository.createCategory(input);
    } catch (error) {
      console.error('Error creating category:', error);
      throw new HttpException(500, 'Failed to create category');
    }
  }

  async getAllCategories(userId: number): Promise<ActivityCategory[]> {
    try {
      return await enhancedActivityRepository.getAllCategories(userId);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new HttpException(500, 'Failed to fetch categories');
    }
  }

  async getCategoryById(id: string, userId: number): Promise<ActivityCategory> {
    try {
      const category = await enhancedActivityRepository.getCategoryById(id, userId);
      if (!category) {
        throw new HttpException(404, 'Category not found');
      }
      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error fetching category:', error);
      throw new HttpException(500, 'Failed to fetch category');
    }
  }

  async updateCategory(id: string, userId: number, input: UpdateCategoryInput): Promise<ActivityCategory> {
    try {
      const exists = await enhancedActivityRepository.categoryExists(id, userId);
      if (!exists) {
        throw new HttpException(404, 'Category not found');
      }

      const updatedCategory = await enhancedActivityRepository.updateCategory(id, userId, input);
      if (!updatedCategory) {
        throw new HttpException(500, 'Failed to update category');
      }

      return updatedCategory;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error updating category:', error);
      throw new HttpException(500, 'Failed to update category');
    }
  }

  async deleteCategory(id: string, userId: number): Promise<{ success: boolean }> {
    try {
      const exists = await enhancedActivityRepository.categoryExists(id, userId);
      if (!exists) {
        throw new HttpException(404, 'Category not found');
      }

      const isDeleted = await enhancedActivityRepository.deleteCategory(id, userId);
      if (!isDeleted) {
        throw new HttpException(500, 'Failed to delete category');
      }

      return { success: true };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error deleting category:', error);
      throw new HttpException(500, 'Failed to delete category');
    }
  }

  // ==================== ACTIVITY SERVICES ====================

  async createActivity(input: CreateActivityInput): Promise<Activity> {
    try {
      // Validate category exists
      const categoryExists = await enhancedActivityRepository.categoryExists(input.categoryId, input.userId);
      if (!categoryExists) {
        throw new HttpException(400, 'Invalid category ID');
      }

      return await enhancedActivityRepository.createActivity(input);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error creating activity:', error);
      throw new HttpException(500, 'Failed to create activity');
    }
  }

  async getActivityById(id: string, userId: number): Promise<Activity> {
    try {
      const activity = await enhancedActivityRepository.getActivityById(id, userId);
      if (!activity) {
        throw new HttpException(404, 'Activity not found');
      }
      return activity;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error fetching activity:', error);
      throw new HttpException(500, 'Failed to fetch activity');
    }
  }

  async getAllActivities(userId: number): Promise<Activity[]> {
    try {
      return await enhancedActivityRepository.getAllActivities(userId);
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw new HttpException(500, 'Failed to fetch activities');
    }
  }

  async updateActivity(id: string, userId: number, input: UpdateActivityInput): Promise<Activity> {
    try {
      const exists = await enhancedActivityRepository.activityExists(id, userId);
      if (!exists) {
        throw new HttpException(404, 'Activity not found');
      }

      // Validate category exists if categoryId is provided
      if (input.categoryId) {
        const categoryExists = await enhancedActivityRepository.categoryExists(input.categoryId, userId);
        if (!categoryExists) {
          throw new HttpException(400, 'Invalid category ID');
        }
      }

      const updatedActivity = await enhancedActivityRepository.updateActivity(id, userId, input);
      if (!updatedActivity) {
        throw new HttpException(500, 'Failed to update activity');
      }

      return updatedActivity;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error updating activity:', error);
      throw new HttpException(500, 'Failed to update activity');
    }
  }

  async deleteActivity(id: string, userId: number): Promise<{ success: boolean }> {
    try {
      const exists = await enhancedActivityRepository.activityExists(id, userId);
      if (!exists) {
        throw new HttpException(404, 'Activity not found');
      }

      const isDeleted = await enhancedActivityRepository.deleteActivity(id, userId);
      if (!isDeleted) {
        throw new HttpException(500, 'Failed to delete activity');
      }

      return { success: true };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error deleting activity:', error);
      throw new HttpException(500, 'Failed to delete activity');
    }
  }

  // ==================== ACTIVITY LOG SERVICES ====================

  async markActivityComplete(activityId: string, userId: number, date: string, notes?: string): Promise<ActivityLog> {
    try {
      // Validate activity exists
      const activityExists = await enhancedActivityRepository.activityExists(activityId, userId);
      if (!activityExists) {
        throw new HttpException(404, 'Activity not found');
      }

      const input: CreateActivityLogInput = {
        activityId,
        userId,
        date,
        status: 'completed',
        notes,
        completedAt: new Date(),
      };

      return await enhancedActivityRepository.createOrUpdateActivityLog(input);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error marking activity complete:', error);
      throw new HttpException(500, 'Failed to mark activity complete');
    }
  }

  async markActivityMissed(activityId: string, userId: number, date: string, notes?: string): Promise<ActivityLog> {
    try {
      // Validate activity exists
      const activityExists = await enhancedActivityRepository.activityExists(activityId, userId);
      if (!activityExists) {
        throw new HttpException(404, 'Activity not found');
      }

      const input: CreateActivityLogInput = {
        activityId,
        userId,
        date,
        status: 'missed',
        notes,
      };

      return await enhancedActivityRepository.createOrUpdateActivityLog(input);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error marking activity missed:', error);
      throw new HttpException(500, 'Failed to mark activity missed');
    }
  }

  async updateActivityLog(
    activityId: string,
    date: string,
    userId: number,
    input: UpdateActivityLogInput
  ): Promise<ActivityLog> {
    try {
      // Validate activity exists
      const activityExists = await enhancedActivityRepository.activityExists(activityId, userId);
      if (!activityExists) {
        throw new HttpException(404, 'Activity not found');
      }

      const updatedLog = await enhancedActivityRepository.updateActivityLog(activityId, date, userId, input);
      if (!updatedLog) {
        throw new HttpException(404, 'Activity log not found');
      }

      return updatedLog;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error updating activity log:', error);
      throw new HttpException(500, 'Failed to update activity log');
    }
  }

  async getActivityLogs(userId: number, startDate?: string, endDate?: string): Promise<ActivityLog[]> {
    try {
      if (startDate && endDate) {
        return await enhancedActivityRepository.getActivityLogsByDateRange(userId, startDate, endDate);
      }
      return await enhancedActivityRepository.getActivityLogs(userId);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      throw new HttpException(500, 'Failed to fetch activity logs');
    }
  }

  async getActivityLogsForActivity(activityId: string, userId: number): Promise<ActivityLog[]> {
    try {
      // Validate activity exists
      const activityExists = await enhancedActivityRepository.activityExists(activityId, userId);
      if (!activityExists) {
        throw new HttpException(404, 'Activity not found');
      }

      return await enhancedActivityRepository.getActivityLogsForActivity(activityId, userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error fetching activity logs:', error);
      throw new HttpException(500, 'Failed to fetch activity logs');
    }
  }

  // ==================== STATISTICS SERVICES ====================

  async getActivityStats(userId: number): Promise<ActivityStats> {
    try {
      return await enhancedActivityRepository.getActivityStats(userId);
    } catch (error) {
      console.error('Error fetching activity stats:', error);
      throw new HttpException(500, 'Failed to fetch activity stats');
    }
  }

  async getActivityProgress(activityId: string, userId: number): Promise<ActivityProgress> {
    try {
      // Validate activity exists
      const activityExists = await enhancedActivityRepository.activityExists(activityId, userId);
      if (!activityExists) {
        throw new HttpException(404, 'Activity not found');
      }

      const progress = await enhancedActivityRepository.getActivityProgress(activityId);
      if (!progress) {
        // Return default progress if no logs exist yet
        return {
          activityId,
          totalDays: 0,
          completedDays: 0,
          missedDays: 0,
          currentStreak: 0,
          longestStreak: 0,
          consistencyRate: 0,
          lastSevenDays: [],
        };
      }

      return progress;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error fetching activity progress:', error);
      throw new HttpException(500, 'Failed to fetch activity progress');
    }
  }

  // ==================== UTILITY SERVICES ====================

  async getActivitiesDueToday(userId: number): Promise<Activity[]> {
    try {
      const allActivities = await enhancedActivityRepository.getAllActivities(userId);
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const dateOfMonth = today.getDate();

      return allActivities.filter(activity => {
        if (!activity.isActive) return false;

        const freq = activity.frequency;
        switch (freq.type) {
          case 'daily':
            return true;
          case 'weekly':
            return freq.specificDays?.includes(dayOfWeek) || false;
          case 'monthly':
            return dateOfMonth === 1; // Simplified: due on 1st of month
          case 'custom':
            return freq.specificDays?.includes(dayOfWeek) || false;
          default:
            return false;
        }
      });
    } catch (error) {
      console.error('Error fetching activities due today:', error);
      throw new HttpException(500, 'Failed to fetch activities due today');
    }
  }

  async getActivitiesDueThisWeek(userId: number): Promise<Activity[]> {
    try {
      const allActivities = await enhancedActivityRepository.getAllActivities(userId);
      
      return allActivities.filter(activity => {
        if (!activity.isActive) return false;

        const freq = activity.frequency;
        switch (freq.type) {
          case 'daily':
            return true; // Daily activities are due every day of the week
          case 'weekly':
          case 'custom':
            return freq.specificDays && freq.specificDays.length > 0;
          case 'monthly':
            return true; // Monthly activities might be due this week
          default:
            return false;
        }
      });
    } catch (error) {
      console.error('Error fetching activities due this week:', error);
      throw new HttpException(500, 'Failed to fetch activities due this week');
    }
  }
}

export const enhancedActivityService = new EnhancedActivityService();
export default enhancedActivityService;