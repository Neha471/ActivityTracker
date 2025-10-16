<script lang="ts">
  import type { Activity, ActivityStats, ActivityProgress } from '$lib/types/activity';
  
  export let activities: Activity[] = [];
  export let stats: ActivityStats = {
    totalActivities: 0,
    completedToday: 0,
    pendingToday: 0,
    avgConsistency: 0,
    totalStreak: 0
  };

  // Mock data for demonstration
  let mockProgress: ActivityProgress[] = [
    {
      activityId: '1',
      totalDays: 30,
      completedDays: 25,
      missedDays: 5,
      currentStreak: 3,
      longestStreak: 7,
      consistencyRate: 83,
      lastSevenDays: ['completed', 'completed', 'missed', 'completed', 'completed', 'completed', 'pending']
    },
    {
      activityId: '2',
      totalDays: 21,
      completedDays: 12,
      missedDays: 9,
      currentStreak: 1,
      longestStreak: 4,
      consistencyRate: 57,
      lastSevenDays: ['missed', 'completed', 'missed', 'missed', 'completed', 'missed', 'pending']
    }
  ];

  let mockActivities: Activity[] = [
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
      description: 'Gym or running',
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

  // Use mock data if no real data provided
  $: displayActivities = activities.length > 0 ? activities : mockActivities;
  $: displayStats = stats.totalActivities > 0 ? stats : {
    totalActivities: 2,
    completedToday: 1,
    pendingToday: 1,
    avgConsistency: 70,
    totalStreak: 4,
    mostConsistentActivity: mockActivities[0],
    mostMissedActivity: mockActivities[1]
  };

  function getProgressForActivity(activityId: string): ActivityProgress | null {
    return mockProgress.find(p => p.activityId === activityId) || null;
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'missed': return 'bg-red-500';
      case 'pending': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  }

  function formatStreak(streak: number): string {
    return streak === 1 ? '1 day' : `${streak} days`;
  }
</script>

<div class="min-h-screen bg-gray-50 p-6">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Analytics & Insights</h1>
      <p class="text-gray-600">Track your progress and identify patterns in your activities</p>
    </div>

    <!-- Overview Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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
          <p class="text-2xl font-bold text-gray-900">{displayStats.totalActivities}</p>
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
          <p class="text-2xl font-bold text-gray-900">{displayStats.completedToday}</p>
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
          <p class="text-2xl font-bold text-gray-900">{displayStats.pendingToday}</p>
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
          <h3 class="text-sm font-medium text-gray-500">Total Streak</h3>
          <p class="text-2xl font-bold text-gray-900">{formatStreak(displayStats.totalStreak)}</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <h3 class="text-sm font-medium text-gray-500">Avg Consistency</h3>
          <p class="text-2xl font-bold text-gray-900">{displayStats.avgConsistency}%</p>
        </div>
      </div>
    </div>

    <!-- Insights Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Most Consistent -->
      {#if displayStats.mostConsistentActivity}
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Most Consistent Activity</h2>
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <div 
              class="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl"
              style="background-color: {displayStats.mostConsistentActivity.color};"
            >
              {displayStats.mostConsistentActivity.icon || '📝'}
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">{displayStats.mostConsistentActivity.title}</h3>
              <p class="text-sm text-gray-600">{displayStats.mostConsistentActivity.consistency}% consistency rate</p>
              <p class="text-sm text-green-600 font-medium">{formatStreak(displayStats.mostConsistentActivity.streak)} current streak</p>
            </div>
          </div>
        </div>
      {/if}

      <!-- Most Missed -->
      {#if displayStats.mostMissedActivity}
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Needs Attention</h2>
            <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <div 
              class="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl"
              style="background-color: {displayStats.mostMissedActivity.color};"
            >
              {displayStats.mostMissedActivity.icon || '📝'}
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">{displayStats.mostMissedActivity.title}</h3>
              <p class="text-sm text-gray-600">{displayStats.mostMissedActivity.consistency}% consistency rate</p>
              <p class="text-sm text-red-600 font-medium">Consider adjusting frequency or reminders</p>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <!-- Activity Progress Details -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900 mb-6">Activity Progress Details</h2>
      
      <div class="space-y-6">
        {#each displayActivities as activity}
          {@const progress = getProgressForActivity(activity.id)}
          <div class="border border-gray-200 rounded-xl p-4">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div 
                  class="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg"
                  style="background-color: {activity.color};"
                >
                  {activity.icon || '📝'}
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">{activity.title}</h3>
                  <p class="text-sm text-gray-600">{activity.category.name}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-gray-900">{activity.consistency}%</p>
                <p class="text-sm text-gray-500">Consistency</p>
              </div>
            </div>

            {#if progress}
              <!-- Stats Row -->
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div class="text-center p-3 bg-gray-50 rounded-lg">
                  <p class="text-lg font-bold text-gray-900">{progress.completedDays}</p>
                  <p class="text-xs text-gray-500">Completed</p>
                </div>
                <div class="text-center p-3 bg-gray-50 rounded-lg">
                  <p class="text-lg font-bold text-red-600">{progress.missedDays}</p>
                  <p class="text-xs text-gray-500">Missed</p>
                </div>
                <div class="text-center p-3 bg-gray-50 rounded-lg">
                  <p class="text-lg font-bold text-green-600">{progress.currentStreak}</p>
                  <p class="text-xs text-gray-500">Current Streak</p>
                </div>
                <div class="text-center p-3 bg-gray-50 rounded-lg">
                  <p class="text-lg font-bold text-blue-600">{progress.longestStreak}</p>
                  <p class="text-xs text-gray-500">Longest Streak</p>
                </div>
              </div>

              <!-- Last 7 Days -->
              <div>
                <p class="text-sm font-medium text-gray-700 mb-2">Last 7 Days</p>
                <div class="flex space-x-1">
                  {#each progress.lastSevenDays as status, i}
                    <div 
                      class="w-8 h-8 rounded-lg flex items-center justify-center {getStatusColor(status)}"
                      title="{status}"
                    >
                      {#if status === 'completed'}
                        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      {:else if status === 'missed'}
                        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                      {/if}
                    </div>
                  {/each}
                </div>
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>7 days ago</span>
                  <span>Today</span>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>