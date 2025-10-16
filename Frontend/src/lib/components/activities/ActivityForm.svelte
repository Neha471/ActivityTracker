<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { slide } from 'svelte/transition';
  import { fade } from 'svelte/transition';
  import { tick } from 'svelte';
  import activityService from '$lib/services/activity.service';
  import type { Activity, CreateActivityDto } from '$lib/types/activity';
  
  const colors = [
    { name: 'Red', value: '#EF4444' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' }
  ];
  
  export let activity: Activity | null = null;
  export let onSubmit: () => void;
  export let onCancel: () => void;
  
  const dispatch = createEventDispatcher();
  
  let name = '';
  let description = '';
  let selectedColor = colors[1].value;
  let isSubmitting = false;
  let error = '';
  
  $: isEditMode = !!activity;
  
  // Initialize form with activity data if in edit mode
  $: if (activity) {
    name = activity.name;
    description = activity.description || '';
    selectedColor = activity.color;
  }
  
  async function handleSubmit() {
    if (!name.trim()) {
      error = 'Activity name is required';
      return;
    }
    
    isSubmitting = true;
    error = '';
    
    try {
      const activityData: CreateActivityDto = {
        name: name.trim(),
        description: description.trim() || undefined,
        color: selectedColor
      };
      
      if (isEditMode && activity) {
        await activityService.updateActivity(activity.id, activityData);
      } else {
        await activityService.createActivity(activityData);
      }
      
      onSubmit();
    } catch (err) {
      console.error('Error saving activity:', err);
      error = 'Failed to save activity. Please try again.';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6" in:fade>
  <div class="px-4 py-5 sm:p-6">
    <h3 class="text-lg leading-6 font-medium text-gray-900">
      {isEditMode ? 'Edit Activity' : 'Add New Activity'}
    </h3>
    
    {#if error}
      <div class="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
        {error}
      </div>
    {/if}
    
    <form class="mt-6 space-y-6" on:submit|preventDefault={handleSubmit}>
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">
          Activity Name *
        </label>
        <div class="mt-1">
          <input
            type="text"
            id="name"
            bind:value={name}
            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="e.g. Coding, Reading, Exercise"
          />
        </div>
      </div>
      
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">
          Description (Optional)
        </label>
        <div class="mt-1">
          <textarea
            id="description"
            rows={3}
            bind:value={description}
            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Add some details about this activity...">
          </textarea>
        </div>
      </div>
      
      <div>
        <label for="color-selector" class="block text-sm font-medium text-gray-700 mb-2">
          Color
        </label>
        <div id="color-selector" class="flex space-x-2">
          {#each colors as color}
            <button
              type="button"
              class="w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              class:ring-2={selectedColor === color.value}
              class:ring-offset-1={selectedColor === color.value}
              style="background-color: {color.value}"
              on:click={() => selectedColor = color.value}
              aria-label={`Select ${color.name} color`}
              title={color.name}
            >
              <span class="sr-only">{color.name}</span>
            </button>
          {/each}
        </div>
      </div>
      
      <div class="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          on:click={onCancel}
          class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Activity' : 'Add Activity'}
        </button>
      </div>
    </form>
  </div>
</div>
