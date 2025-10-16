import { HttpException } from '../middlewares/error.middleware';
import { activityRepository } from '../repositories/activity.repository';
import { CreateActivityInput, UpdateActivityInput, Activity } from '../types/activity.types';

export class ActivityService {
  async createActivity(input: CreateActivityInput): Promise<Activity> {
    try {
      return await activityRepository.createActivity(input);
    } catch (error) {
      throw new HttpException(500, 'Failed to create activity');
    }
  }

  async getActivityById(id: number, userId: number): Promise<Activity> {
    const activity = await activityRepository.getActivityById(id, userId);
    if (!activity) {
      throw new HttpException(404, 'Activity not found');
    }
    return activity;
  }

  async getAllActivities(userId: number): Promise<Activity[]> {
    try {
      return await activityRepository.getAllActivities(userId);
    } catch (error) {
      throw new HttpException(500, 'Failed to fetch activities');
    }
  }

  async updateActivity(
    id: number,
    userId: number,
    input: UpdateActivityInput
  ): Promise<Activity> {
    const exists = await activityRepository.activityExists(id, userId);
    if (!exists) {
      throw new HttpException(404, 'Activity not found');
    }

    const updatedActivity = await activityRepository.updateActivity(id, userId, input);
    if (!updatedActivity) {
      throw new HttpException(500, 'Failed to update activity');
    }

    return updatedActivity;
  }

  async deleteActivity(id: number, userId: number): Promise<{ success: boolean }> {
    const exists = await activityRepository.activityExists(id, userId);
    if (!exists) {
      throw new HttpException(404, 'Activity not found');
    }

    const isDeleted = await activityRepository.deleteActivity(id, userId);
    if (!isDeleted) {
      throw new HttpException(500, 'Failed to delete activity');
    }

    return { success: true };
  }
}

export const activityService = new ActivityService();
export default activityService;
