import { db } from '../config/database';
import {
  // Category queries
  CREATE_CATEGORY,
  GET_ALL_CATEGORIES,
  GET_CATEGORY_BY_ID,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  CATEGORY_EXISTS,
  
  // Activity queries
  CREATE_ACTIVITY,
  GET_ACTIVITY_BY_ID,
  GET_ALL_ACTIVITIES,
  UPDATE_ACTIVITY,
  DELETE_ACTIVITY,
  ACTIVITY_EXISTS,
  
  // Activity log queries
  CREATE_ACTIVITY_LOG,
  GET_ACTIVITY_LOGS,
  GET_ACTIVITY_LOGS_BY_DATE_RANGE,
  GET_ACTIVITY_LOGS_FOR_ACTIVITY,
  GET_ACTIVITY_LOG_BY_DATE,
  UPDATE_ACTIVITY_LOG,
  DELETE_ACTIVITY_LOG,
  
  // Statistics queries
  GET_ACTIVITY_STATS,
  GET_MOST_CONSISTENT_ACTIVITY,
  GET_MOST_MISSED_ACTIVITY,
  GET_ACTIVITY_PROGRESS,
} from './queries/enhanced-activity.queries';

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
  ActivityFrequency,
} from '../types/activity.types';

export class EnhancedActivityRepository {
  
  // ==================== HELPER METHODS ====================
  
  private transformActivityRow(row: any): Activity {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      category: {
        id: row.category_id,
        userId: row.user_id,
        name: row.category_name,
        color: row.category_color,
        icon: row.category_icon,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
      frequency: {
        type: row.frequency_type,
        value: row.frequency_value,
        period: row.frequency_period,
        specificDays: row.frequency_specific_days || [],
      },
      color: row.color,
      icon: row.icon,
      notes: row.notes,
      isActive: row.is_active,
      streak: row.streak || 0,
      totalCompletions: row.total_completions || 0,
      consistency: parseFloat(row.consistency) || 0,
      lastCompleted: row.last_completed,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private transformCategoryRow(row: any): ActivityCategory {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      color: row.color,
      icon: row.icon,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private transformActivityLogRow(row: any): ActivityLog {
    return {
      id: row.id,
      activityId: row.activity_id,
      userId: row.user_id,
      date: row.date,
      status: row.status,
      notes: row.notes,
      completedAt: row.completed_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // ==================== CATEGORY METHODS ====================

  async createCategory(input: CreateCategoryInput): Promise<ActivityCategory> {
    const { userId, name, color, icon } = input;
    const result = await db.query(CREATE_CATEGORY, [userId, name, color, icon]);
    return this.transformCategoryRow(result.rows[0]);
  }

  async getAllCategories(userId: number): Promise<ActivityCategory[]> {
    const result = await db.query(GET_ALL_CATEGORIES, [userId]);
    return result.rows.map(row => this.transformCategoryRow(row));
  }

  async getCategoryById(id: string, userId: number): Promise<ActivityCategory | null> {
    const result = await db.query(GET_CATEGORY_BY_ID, [id, userId]);
    return result.rows[0] ? this.transformCategoryRow(result.rows[0]) : null;
  }

  async updateCategory(id: string, userId: number, input: UpdateCategoryInput): Promise<ActivityCategory | null> {
    const { name, color, icon } = input;
    const result = await db.query(UPDATE_CATEGORY, [id, userId, name, color, icon]);
    return result.rows[0] ? this.transformCategoryRow(result.rows[0]) : null;
  }

  async deleteCategory(id: string, userId: number): Promise<boolean> {
    const result = await db.query(DELETE_CATEGORY, [id, userId]);
    return result.rowCount! > 0;
  }

  async categoryExists(id: string, userId: number): Promise<boolean> {
    const result = await db.query(CATEGORY_EXISTS, [id, userId]);
    return result.rows[0].exists;
  }

  // ==================== ACTIVITY METHODS ====================

  async createActivity(input: CreateActivityInput): Promise<Activity> {
    const {
      userId,
      title,
      description,
      categoryId,
      frequency,
      color,
      icon,
      notes,
    } = input;

    const result = await db.query(CREATE_ACTIVITY, [
      userId,
      title,
      description,
      categoryId,
      frequency.type,
      frequency.value,
      frequency.period,
      frequency.specificDays || [],
      color,
      icon,
      notes,
    ]);

    // Get the full activity with category information
    return this.getActivityById(result.rows[0].id, userId) as Promise<Activity>;
  }

  async getActivityById(id: string, userId: number): Promise<Activity | null> {
    const result = await db.query(GET_ACTIVITY_BY_ID, [id, userId]);
    return result.rows[0] ? this.transformActivityRow(result.rows[0]) : null;
  }

  async getAllActivities(userId: number): Promise<Activity[]> {
    const result = await db.query(GET_ALL_ACTIVITIES, [userId]);
    return result.rows.map(row => this.transformActivityRow(row));
  }

  async updateActivity(id: string, userId: number, input: UpdateActivityInput): Promise<Activity | null> {
    const {
      title,
      description,
      categoryId,
      frequency,
      color,
      icon,
      notes,
      isActive,
    } = input;

    const result = await db.query(UPDATE_ACTIVITY, [
      id,
      userId,
      title,
      description,
      categoryId,
      frequency?.type,
      frequency?.value,
      frequency?.period,
      frequency?.specificDays || [],
      color,
      icon,
      notes,
      isActive,
    ]);

    if (result.rows[0]) {
      // Get the full activity with category information
      return this.getActivityById(id, userId);
    }
    return null;
  }

  async deleteActivity(id: string, userId: number): Promise<boolean> {
    const result = await db.query(DELETE_ACTIVITY, [id, userId]);
    return result.rowCount! > 0;
  }

  async activityExists(id: string, userId: number): Promise<boolean> {
    const result = await db.query(ACTIVITY_EXISTS, [id, userId]);
    return result.rows[0].exists;
  }

  // ==================== ACTIVITY LOG METHODS ====================

  async createOrUpdateActivityLog(input: CreateActivityLogInput): Promise<ActivityLog> {
    const { activityId, userId, date, status, notes, completedAt } = input;
    const result = await db.query(CREATE_ACTIVITY_LOG, [
      activityId,
      userId,
      date,
      status,
      notes,
      completedAt,
    ]);
    return this.transformActivityLogRow(result.rows[0]);
  }

  async getActivityLogs(userId: number): Promise<ActivityLog[]> {
    const result = await db.query(GET_ACTIVITY_LOGS, [userId]);
    return result.rows.map(row => this.transformActivityLogRow(row));
  }

  async getActivityLogsByDateRange(
    userId: number,
    startDate: string,
    endDate: string
  ): Promise<ActivityLog[]> {
    const result = await db.query(GET_ACTIVITY_LOGS_BY_DATE_RANGE, [userId, startDate, endDate]);
    return result.rows.map(row => this.transformActivityLogRow(row));
  }

  async getActivityLogsForActivity(activityId: string, userId: number): Promise<ActivityLog[]> {
    const result = await db.query(GET_ACTIVITY_LOGS_FOR_ACTIVITY, [activityId, userId]);
    return result.rows.map(row => this.transformActivityLogRow(row));
  }

  async getActivityLogByDate(activityId: string, date: string): Promise<ActivityLog | null> {
    const result = await db.query(GET_ACTIVITY_LOG_BY_DATE, [activityId, date]);
    return result.rows[0] ? this.transformActivityLogRow(result.rows[0]) : null;
  }

  async updateActivityLog(
    activityId: string,
    date: string,
    userId: number,
    input: UpdateActivityLogInput
  ): Promise<ActivityLog | null> {
    const { status, notes, completedAt } = input;
    const result = await db.query(UPDATE_ACTIVITY_LOG, [
      activityId,
      date,
      userId,
      status,
      notes,
      completedAt,
    ]);
    return result.rows[0] ? this.transformActivityLogRow(result.rows[0]) : null;
  }

  async deleteActivityLog(activityId: string, date: string, userId: number): Promise<boolean> {
    const result = await db.query(DELETE_ACTIVITY_LOG, [activityId, date, userId]);
    return result.rowCount! > 0;
  }

  // ==================== STATISTICS METHODS ====================

  async getActivityStats(userId: number): Promise<ActivityStats> {
    const [statsResult, mostConsistentResult, mostMissedResult] = await Promise.all([
      db.query(GET_ACTIVITY_STATS, [userId]),
      db.query(GET_MOST_CONSISTENT_ACTIVITY, [userId]),
      db.query(GET_MOST_MISSED_ACTIVITY, [userId]),
    ]);

    const stats = statsResult.rows[0];
    
    return {
      totalActivities: parseInt(stats.total_activities) || 0,
      completedToday: parseInt(stats.completed_today) || 0,
      pendingToday: parseInt(stats.pending_today) || 0,
      avgConsistency: parseFloat(stats.avg_consistency) || 0,
      totalStreak: parseInt(stats.total_streak) || 0,
      mostConsistentActivity: mostConsistentResult.rows[0] 
        ? this.transformActivityRow(mostConsistentResult.rows[0]) 
        : undefined,
      mostMissedActivity: mostMissedResult.rows[0] 
        ? this.transformActivityRow(mostMissedResult.rows[0]) 
        : undefined,
    };
  }

  async getActivityProgress(activityId: string): Promise<ActivityProgress | null> {
    const result = await db.query(GET_ACTIVITY_PROGRESS, [activityId]);
    
    if (!result.rows[0]) {
      return null;
    }

    const row = result.rows[0];
    return {
      activityId: row.activity_id,
      totalDays: parseInt(row.total_days) || 0,
      completedDays: parseInt(row.completed_days) || 0,
      missedDays: parseInt(row.missed_days) || 0,
      currentStreak: parseInt(row.current_streak) || 0,
      longestStreak: parseInt(row.longest_streak) || 0,
      consistencyRate: parseFloat(row.consistency_rate) || 0,
      lastSevenDays: row.last_seven_days || [],
    };
  }
}

export const enhancedActivityRepository = new EnhancedActivityRepository();
export default enhancedActivityRepository;