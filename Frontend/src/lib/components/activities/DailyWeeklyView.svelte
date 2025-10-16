<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Activity, ActivityLog } from '$lib/types/activity';
  
  export let activities: Activity[] = [];
  export let activityLogs: ActivityLog[] = [];
  export let selectedDate: Date = new Date();
  export let viewType: 'daily' | 'weekly' = 'daily';

  const dispatch = createEventDispatcher<{
    markComplete: { activityId: string; date: string };
    markMissed: { activityId: string; date: string };
    addNote: { activityId: string; date: string; note: string };
  }>();

  let noteModal = {
    isOpen: false,
    activityId: '',
    date: '',
    note: ''
  };

  // Get activities due for the selected date
  function getActivitiesDue(date: Date): Activity[] {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    return activities.filter(activity => {
      const freq = activity.frequency;
      
      switch (freq.type) {
        case 'daily':
          return true;
        case 'weekly':
          return freq.specificDays?.includes(dayOfWeek) || false;
        case 'monthly':
          return date.getDate() === 1; // Simplified: due on 1st of month
        case 'custom':
          return freq.specificDays?.includes(dayOfWeek) || false;
        default:
          return false;
      }
    });
  }

  // Get activity status for a specific date
  function getActivityStatus(activityId: string, date: string): 'completed' | 'missed' | 'pending' {
    const log = activityLogs.find(l => l.activityId === activityId && l.date === date);
    return log?.status || 'pending';
  }

  // Get the last 7 days for weekly view
  function getWeekDates(date: Date): Date[] {
    const dates = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      dates.push(day);
    }
    return dates;
  }

  function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  function formatDisplayDate(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  function handleMarkComplete(activityId: string, date: string) {
    dispatch('markComplete', { activityId, date });
  }

  function handleMarkMissed(activityId: string, date: string) {
    dispatch('markMissed', { activityId, date });
  }

  function openNoteModal(activityId: string, date: string) {
    const existingLog = activityLogs.find(l => l.activityId === activityId && l.date === date);
    noteModal = {
      isOpen: true,
      activityId,
      date,
      note: existingLog?.notes || ''
    };
  }

  function saveNote() {
    dispatch('addNote', { 
      activityId: noteModal.activityId, 
      date: noteModal.date, 
      note: noteModal.note 
    });
    noteModal = { isOpen: false, activityId: '', date: '', note: '' };
  }

  $: weekDates = viewType === 'weekly' ? getWeekDates(selectedDate) : [];
  $: todayActivities = getActivitiesDue(selectedDate);
</script>

<div class="bg-white rounded-2xl p-6 shadow-sm">
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">
        {viewType === 'daily' ? 'Today' : 'This Week'}
      </h2>
      <p class="text-gray-600">
        {viewType === 'daily' 
          ? formatDisplayDate(selectedDate)
          : `Week of ${formatDisplayDate(weekDates[0] || new Date())}`
        }
      </p>
    </div>
    
    <div class="flex items-center space-x-2">
      <!-- View Toggle -->
      <div class="bg-gray-100 rounded-lg p-1 flex">
        <button
          on:click={() => viewType = 'daily'}
          class="px-3 py-1 text-sm rounded-md transition-colors {
            viewType === 'daily' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }"
        >
          Daily
        </button>
        <button
          on:click={() => viewType = 'weekly'}
          class="px-3 py-1 text-sm rounded-md transition-colors {
            viewType === 'weekly' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }"
        >
          Weekly
        </button>
      </div>

      <!-- Date Navigation -->
      <div class="flex items-center space-x-2">
        <button
          on:click={() => {
            const newDate = new Date(selectedDate);
            newDate.setDate(selectedDate.getDate() - (viewType === 'weekly' ? 7 : 1));
            selectedDate = newDate;
          }}
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous {viewType === 'weekly' ? 'week' : 'day'}"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          on:click={() => selectedDate = new Date()}
          class="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          Today
        </button>
        <button
          on:click={() => {
            const newDate = new Date(selectedDate);
            newDate.setDate(selectedDate.getDate() + (viewType === 'weekly' ? 7 : 1));
            selectedDate = newDate;
          }}
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next {viewType === 'weekly' ? 'week' : 'day'}"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Daily View -->
  {#if viewType === 'daily'}
    <div class="space-y-4">
      {#if todayActivities.length === 0}
        <div class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-gray-500">No activities due today</p>
        </div>
      {:else}
        {#each todayActivities as activity}
          {@const status = getActivityStatus(activity.id, formatDate(selectedDate))}
          <div class="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center space-x-4">
              <!-- Activity Icon & Color -->
              <div 
                class="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl"
                style="background-color: {activity.color};"
              >
                {activity.icon || '📝'}
              </div>
              
              <!-- Activity Info -->
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{activity.title}</h3>
                <p class="text-sm text-gray-600">
                  {activity.category.name} • 
                  {activity.frequency.type === 'daily' ? 'Daily' : 
                   activity.frequency.type === 'weekly' ? `Weekly (${activity.frequency.specificDays?.length || 0} days)` :
                   activity.frequency.type === 'monthly' ? 'Monthly' :
                   `${activity.frequency.value}x per ${activity.frequency.period}`}
                </p>
                {#if activity.description}
                  <p class="text-sm text-gray-500 mt-1">{activity.description}</p>
                {/if}
              </div>

              <!-- Status & Actions -->
              <div class="flex items-center space-x-2">
                {#if status === 'completed'}
                  <div class="flex items-center text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-sm font-medium">Completed</span>
                  </div>
                {:else if status === 'missed'}
                  <div class="flex items-center text-red-600 bg-red-100 px-3 py-1 rounded-full">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-sm font-medium">Missed</span>
                  </div>
                {:else}
                  <div class="flex items-center space-x-2">
                    <button
                      on:click={() => handleMarkComplete(activity.id, formatDate(selectedDate))}
                      class="flex items-center text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg transition-colors"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span class="text-sm">Done</span>
                    </button>
                    <button
                      on:click={() => handleMarkMissed(activity.id, formatDate(selectedDate))}
                      class="flex items-center text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span class="text-sm">Miss</span>
                    </button>
                  </div>
                {/if}
                
                <!-- Note Button -->
                <button
                  on:click={() => openNoteModal(activity.id, formatDate(selectedDate))}
                  class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Add note"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        {/each}
      {/if}
    </div>

  <!-- Weekly View -->
  {:else}
    <div class="overflow-x-auto">
      <div class="min-w-full">
        <!-- Week Header -->
        <div class="grid grid-cols-7 gap-4 mb-4">
          {#each weekDates as date}
            <div class="text-center p-2">
              <div class="text-sm font-medium text-gray-900">
                {formatDisplayDate(date).split(',')[0]}
              </div>
              <div class="text-xs text-gray-500">
                {date.getDate()}
              </div>
            </div>
          {/each}
        </div>

        <!-- Activities Grid -->
        <div class="space-y-3">
          {#each activities as activity}
            <div class="grid grid-cols-7 gap-4 items-center">
              <!-- Activity Name -->
              <div class="col-span-7 lg:col-span-7 border border-gray-200 rounded-xl p-3">
                <div class="flex items-center space-x-3 mb-3">
                  <div 
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                    style="background-color: {activity.color};"
                  >
                    {activity.icon || '📝'}
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">{activity.title}</h4>
                    <p class="text-xs text-gray-500">{activity.category.name}</p>
                  </div>
                </div>
                
                <!-- Week Status Grid -->
                <div class="grid grid-cols-7 gap-2">
                  {#each weekDates as date}
                    {@const dateStr = formatDate(date)}
                    {@const isDue = getActivitiesDue(date).some(a => a.id === activity.id)}
                    {@const status = getActivityStatus(activity.id, dateStr)}
                    
                    <div class="text-center">
                      {#if isDue}
                        <button
                          on:click={() => {
                            if (status === 'pending') {
                              handleMarkComplete(activity.id, dateStr);
                            } else if (status === 'completed') {
                              handleMarkMissed(activity.id, dateStr);
                            } else {
                              handleMarkComplete(activity.id, dateStr);
                            }
                          }}
                          class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors {
                            status === 'completed' 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : status === 'missed'
                              ? 'bg-red-500 border-red-500 text-white'
                              : 'border-gray-300 hover:border-gray-400'
                          }"
                        >
                          {#if status === 'completed'}
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                          {:else if status === 'missed'}
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                          {/if}
                        </button>
                      {:else}
                        <div class="w-8 h-8 rounded-full bg-gray-100"></div>
                      {/if}
                    </div>
                  {/each}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- Note Modal -->
{#if noteModal.isOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl max-w-md w-full p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Add Note</h3>
      <textarea
        bind:value={noteModal.note}
        placeholder="Add a note about this activity..."
        rows="4"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
      ></textarea>
      <div class="flex justify-end space-x-3 mt-4">
        <button
          on:click={() => noteModal.isOpen = false}
          class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          on:click={saveNote}
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Save Note
        </button>
      </div>
    </div>
  </div>
{/if}