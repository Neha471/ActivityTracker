export interface Activity {
  id: string;
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
  consistency: number; // percentage
  lastCompleted?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface ActivityFrequency {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  value: number; // for custom frequency (e.g., 3 times per week)
  period?: 'day' | 'week' | 'month';
  specificDays?: number[]; // for weekly: [1,3,5] = Mon, Wed, Fri
}

export interface ActivityLog {
  id: string;
  activityId: string;
  date: string;
  status: 'completed' | 'missed' | 'pending';
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
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

export interface CreateActivityDto {
  title: string;
  description?: string;
  categoryId: string;
  frequency: ActivityFrequency;
  color: string;
  icon?: string;
  notes?: string;
}

export interface UpdateActivityDto extends Partial<CreateActivityDto> {
  isActive?: boolean;
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
