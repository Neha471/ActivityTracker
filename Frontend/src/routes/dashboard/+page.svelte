<script lang="ts">
  import { onMount } from 'svelte';
  import Sidebar from '$lib/components/dashboard/Sidebar.svelte';
  import DailyWeeklyView from '$lib/components/activities/DailyWeeklyView.svelte';
  import type { Activity, ActivityLog, ActivityStats } from '$lib/types/activity';

  // Mock data for demonstration
  let activities: Activity[] = [
    {
      id: '1',
      title: 'Read 20 pages',
      description: 'Evening reading habit',
      category: { id: 'reading', name: 'Reading', color: '#10b981' },
      frequency: { type: 'daily', value: 1 },
      color: '#10b981',
      icon: '📚',
      notes: '',
      isActive: true,
      streak: 3,
      totalCompletions: 25,
      consistency: 83,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-30'
    },
    {
      id: '2',
      title: 'Workout',
      description: 'Morning exercise',
      category: { id: 'fitness', name: 'Fitness', color: '#ef4444' },
      frequency: { type: 'custom', value: 3, period: 'week', specificDays: [1,3,5] },
      color: '#ef4444',
      icon: '💪',
      notes: '',
      isActive: true,
      streak: 1,
      totalCompletions: 12,
      consistency: 57,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-30'
    }
  ];

  let activityLogs: ActivityLog[] = [];
  let stats: ActivityStats = {
    totalActivities: 2,
    completedToday: 1,
    pendingToday: 1,
    avgConsistency: 70,
    totalStreak: 4
  };

  function handleMarkComplete(event: CustomEvent) {
    console.log('Mark complete:', event.detail);
    // Update local state
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

<div class="min-h-screen bg-gray-50 text-gray-900 flex">
  <!-- Sidebar -->
  <Sidebar />
  
  <!-- Main Content -->
  <div class="flex-1 p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Activity Dashboard</h1>
      <p class="text-gray-600">Track your daily activities and build better habits</p>
    </div>

    <!-- Quick Stats -->
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

    <!-- Daily/Weekly Tracking -->
    <DailyWeeklyView 
      {activities} 
      {activityLogs} 
      on:markComplete={handleMarkComplete}
      on:markMissed={handleMarkMissed}
      on:addNote={handleAddNote}
    />
  </div>
</div>
