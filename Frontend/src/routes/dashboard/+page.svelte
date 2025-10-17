<script lang="ts">
  import { onMount } from 'svelte';
  import DailyWeeklyView from '$lib/components/activities/DailyWeeklyView.svelte';
  import type { Activity, ActivityLog, ActivityStats } from '$lib/types/activity';
  import apiClient from '$lib/api/client';

  let activities: Activity[] = [];
  let activityLogs: ActivityLog[] = [];
  let stats: ActivityStats = {
    totalActivities: 0,
    completedToday: 0,
    pendingToday: 0,
    avgConsistency: 0,
    totalStreak: 0
  };

  async function fetchDueActivitiesForToday() {
    try {
      console.log('Fetching activities for today...');
      const response = await apiClient.get('/stats/due-today');
      const data = await response.data;
      console.log('Fetched activities:', data.data);
      activities = data.data || [];
      console.log('Activities after update:', activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      activities = [];
    }
  }

  async function fetchDueActivitiesForThisWeek() {
    try {
      const response = await apiClient.get('/stats/due-week');
      const data = await response.data;
      activities = data.data || [];
    } catch (error) {
      console.error('Error fetching weekly activities:', error);
      activities = [];
    }
  }

  async function fetchActivityStats() {
    try {
      const response = await apiClient.get('/stats');
      const data = await response.data;
      stats = data.data || {
        totalActivities: 0,
        completedToday: 0,
        pendingToday: 0,
        avgConsistency: 0,
        totalStreak: 0
      };
    } catch (error) {
      console.error('Error fetching activity stats:', error);
    }
  }

  onMount(async () => {
    console.log('Dashboard mounted, fetching data...');
    await Promise.all([
      fetchDueActivitiesForToday(),
      fetchDueActivitiesForThisWeek(),
      fetchActivityStats()
    ]);
    console.log('All data loaded');
  });


  function handleMarkComplete(event: CustomEvent) {
    console.log('Mark complete:', event.detail);
    const { activityId, date } = event.detail;
    activityLogs = [...activityLogs, {
      id: crypto.randomUUID(),
      activityId,
      date,
      status: 'completed',
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }];
  }

  function handleMarkMissed(event: CustomEvent) {
    console.log('Mark missed:', event.detail);
    const { activityId, date } = event.detail;
    activityLogs = [...activityLogs, {
      id: crypto.randomUUID(),
      activityId,
      date,
      status: 'missed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }];
  }

  function handleAddNote(event: CustomEvent) {
    console.log('Add note:', event.detail);
    const { activityId, date, note } = event.detail;
    // Find existing log or create new one
    const existingIndex = activityLogs.findIndex(log => log.activityId === activityId && log.date === date);
    if (existingIndex >= 0) {
      activityLogs[existingIndex] = { ...activityLogs[existingIndex], notes: note };
      activityLogs = [...activityLogs];
    } else {
      activityLogs = [...activityLogs, {
        id: crypto.randomUUID(),
        activityId,
        date,
        status: 'pending',
        notes: note,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }];
    }
  }
</script>

<div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Activity Dashboard</h1>
      <p class="text-gray-600">Track your daily activities and build better habits</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <h3 class="text-sm font-medium text-gray-500">Total Activities</h3>
          <p class="text-2xl font-bold text-gray-900">{stats.totalActivities}</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <h3 class="text-sm font-medium text-gray-500">Completed Today</h3>
          <p class="text-2xl font-bold text-gray-900">{stats.completedToday}</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <h3 class="text-sm font-medium text-gray-500">Pending Today</h3>
          <p class="text-2xl font-bold text-gray-900">{stats.pendingToday}</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <h3 class="text-sm font-medium text-gray-500">Avg Consistency</h3>
          <p class="text-2xl font-bold text-gray-900">{stats.avgConsistency}%</p>
        </div>
      </div>
    </div>
    <DailyWeeklyView 
      {activities} 
      {activityLogs}
      selectedDate={new Date()}
      on:markComplete={handleMarkComplete}
      on:markMissed={handleMarkMissed}
      on:addNote={handleAddNote}
    />
