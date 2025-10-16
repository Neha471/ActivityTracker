<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { format } from 'date-fns';
  import ActivityForm from './ActivityForm.svelte';
  import ActivityTimer from './ActivityTimer.svelte';
  import activityService from '$lib/services/activity.service';
  import type { Activity } from '$lib/types/activity';
  
  export let activities: Activity[] = [];
  export let onActivityUpdate: () => void;
  
  let showForm = false;
  let selectedActivity: Activity | null = null;
  let isEditing = false;
  
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      await activityService.deleteActivity(id);
      onActivityUpdate();
    }
  };
  
  const handleEdit = (activity: Activity) => {
    selectedActivity = activity;
    isEditing = true;
    showForm = true;
  };
  
  const handleFormSubmit = () => {
    showForm = false;
    selectedActivity = null;
    isEditing = false;
    onActivityUpdate();
  };
</script>

<div class="space-y-4">
  <div class="flex justify-between items-center">
    <h2 class="text-lg font-medium text-gray-900">Your Activities</h2>
    <button
      on:click={() => {
        selectedActivity = null;
        isEditing = false;
        showForm = !showForm;
      }}
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      {showForm ? 'Cancel' : 'Add Activity'}
    </button>
  </div>
  
  {#if showForm}
    <div in:fade>
      <ActivityForm 
        activity={selectedActivity}
        onCancel={() => showForm = false}
        onSubmit={handleFormSubmit}
      />
    </div>
  {/if}
  
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each activities as activity (activity.id)}
      <div class="relative bg-white rounded-lg shadow overflow-hidden border-l-4" 
           style="border-left-color: {activity.color}">
        <div class="p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">{activity.name}</h3>
            <div class="flex space-x-2">
              <button
                on:click|stopPropagation={() => handleEdit(activity)}
                class="text-indigo-600 hover:text-indigo-900"
                aria-label="Edit activity"
                title="Edit"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                on:click|stopPropagation={() => handleDelete(activity.id)}
                class="text-red-600 hover:text-red-900"
                aria-label="Delete activity"
                title="Delete"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {#if activity.description}
            <p class="mt-1 text-sm text-gray-600">{activity.description}</p>
          {/if}
          
          <div class="mt-4 flex items-center justify-between">
            <span class="text-sm text-gray-500">
              Total: {Math.floor(activity.totalTime / 3600)}h {Math.floor((activity.totalTime % 3600) / 60)}m
            </span>
            <ActivityTimer
              activityId={activity.id}
              isActive={activity.isActive}
              onUpdate={onActivityUpdate}
            />
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
