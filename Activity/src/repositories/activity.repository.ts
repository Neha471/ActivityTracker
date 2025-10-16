import { db } from '../config/database';
import {
  CREATE_ACTIVITY,
  GET_ACTIVITY_BY_ID,
  GET_ALL_ACTIVITIES,
  UPDATE_ACTIVITY,
  DELETE_ACTIVITY,
  ACTIVITY_EXISTS,
} from './queries/activity.queries';

import { Activity, CreateActivityInput, UpdateActivityInput } from '../types/activity.types';

export class ActivityRepository {
  async createActivity(input: CreateActivityInput): Promise<Activity> {
    const { userId, title, category, frequency, notes } = input;
    const result = await db.query(CREATE_ACTIVITY, [
      userId,
      title,
      category,
      frequency,
      notes
    ]);
    return result.rows[0];
  }

  async getActivityById(id: number, userId: number): Promise<Activity | null> {
    const result = await db.query(GET_ACTIVITY_BY_ID, [id, userId]);
    return result.rows[0] || null;
  }

  async getAllActivities(userId: number): Promise<Activity[]> {
    const result = await db.query(GET_ALL_ACTIVITIES, [userId]);
    return result.rows;
  }

  async updateActivity(id: number, userId: number, input: UpdateActivityInput): Promise<Activity | null> {
    const { title, category, frequency, notes, isActive } = input;
    const result = await db.query(UPDATE_ACTIVITY, [
      id,
      userId,
      title,
      category,
      frequency,
      notes,
      isActive
    ]);
    return result.rows[0] || null;
  }

  async deleteActivity(id: number, userId: number): Promise<boolean> {
    const result = await db.query(DELETE_ACTIVITY, [id, userId]);
    return result.rowCount > 0;
  }

  async activityExists(id: number, userId: number): Promise<boolean> {
    const result = await db.query(ACTIVITY_EXISTS, [id, userId]);
    return result.rows[0].exists;
  }
}

export const activityRepository = new ActivityRepository();
export default activityRepository;
