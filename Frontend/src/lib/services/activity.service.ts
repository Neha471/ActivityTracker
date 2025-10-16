import apiClient from '$lib/api/client';
import type { Activity, CreateActivityDto, UpdateActivityDto, TimeEntryDto } from '$lib/types/activity';

class ActivityService {
  private basePath = '/activities';

  // Get all activities
  async getActivities(): Promise<Activity[]> {
    const response = await apiClient.get<{ data: Activity[] }>(this.basePath);
    return response.data.data;
  }

  // Get a single activity by ID
  async getActivity(id: string): Promise<Activity> {
    const response = await apiClient.get<{ data: Activity }>(`${this.basePath}/${id}`);
    return response.data.data;
  }

  // Create a new activity
  async createActivity(activityData: CreateActivityDto): Promise<Activity> {
    const response = await apiClient.post<{ data: Activity }>(this.basePath, activityData);
    return response.data.data;
  }

  // Update an activity
  async updateActivity(id: string, activityData: UpdateActivityDto): Promise<Activity> {
    const response = await apiClient.patch<{ data: Activity }>(`${this.basePath}/${id}`, activityData);
    return response.data.data;
  }

  // Delete an activity
  async deleteActivity(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }

  // Start tracking time for an activity
  async startTracking(activityId: string): Promise<TimeEntryDto> {
    const response = await apiClient.post<{ data: TimeEntryDto }>(
      `${this.basePath}/${activityId}/start`
    );
    return response.data.data;
  }

  // Stop tracking time for an activity
  async stopTracking(activityId: string): Promise<TimeEntryDto> {
    const response = await apiClient.post<{ data: TimeEntryDto }>(
      `${this.basePath}/${activityId}/stop`
    );
    return response.data.data;
  }

  // Get time entries for an activity
  async getTimeEntries(activityId: string): Promise<TimeEntryDto[]> {
    const response = await apiClient.get<{ data: TimeEntryDto[] }>(
      `${this.basePath}/${activityId}/time-entries`
    );
    return response.data.data;
  }
}

export default new ActivityService();
