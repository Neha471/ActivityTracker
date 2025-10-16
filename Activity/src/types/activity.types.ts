import { Request } from 'express';

export interface ActivityCategory {
  id: string;
  userId: number;
  name: string;
  color: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityFrequency {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  value: number;
  period?: 'day' | 'week' | 'month';
  specificDays?: number[];
}

export interface Activity {
  id: string;
  userId: number;
  title: string;
  description?: string;
  category: ActivityCategory;
  frequency: ActivityFrequency;
  color: string;
  icon?: string;
  notes?: string;
  isActive: boolean;
  streak: number;
  totalCompletions: number;
  consistency: number;
  lastCompleted?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityLog {
  id: string;
  activityId: string;
  userId: number;
  date: string;
  status: 'completed' | 'missed' | 'pending';
  notes?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateActivityInput {
  userId: number;
  title: string;
  description?: string;
  categoryId: string;
  frequency: ActivityFrequency;
  color: string;
  icon?: string;
  notes?: string;
}

export interface UpdateActivityInput {
  title?: string;
  description?: string;
  categoryId?: string;
  frequency?: ActivityFrequency;
  color?: string;
  icon?: string;
  notes?: string;
  isActive?: boolean;
}

export interface CreateCategoryInput {
  userId: number;
  name: string;
  color: string;
  icon?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  color?: string;
  icon?: string;
}

export interface CreateActivityLogInput {
  activityId: string;
  userId: number;
  date: string;
  status: 'completed' | 'missed' | 'pending';
  notes?: string;
  completedAt?: Date;
}

export interface UpdateActivityLogInput {
  status?: 'completed' | 'missed' | 'pending';
  notes?: string;
  completedAt?: Date;
}

export interface ActivityStats {
  totalActivities: number;
  completedToday: number;
  pendingToday: number;
  avgConsistency: number;
  totalStreak: number;
  mostConsistentActivity?: Activity;
  mostMissedActivity?: Activity;
}

export interface ActivityProgress {
  activityId: string;
  totalDays: number;
  completedDays: number;
  missedDays: number;
  currentStreak: number;
  longestStreak: number;
  consistencyRate: number;
  lastSevenDays: ('completed' | 'missed' | 'pending')[];
}

export interface ActivityRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}
