<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Activity, CreateActivityDto, UpdateActivityDto, ActivityCategory, ActivityFrequency } from '$lib/types/activity';

  export let activity: Activity | null = null;
  export let isOpen = false;
  export let categories: ActivityCategory[] = [];

  const dispatch = createEventDispatcher<{
    save: CreateActivityDto | (UpdateActivityDto & { id: string });
    cancel: void;
  }>();

  let formData: CreateActivityDto = {
    title: '',
    description: '',
    categoryId: '',
    frequency: { type: 'daily', value: 1 },
    color: '#6366f1',
    icon: '',
    notes: ''
  };

  let selectedFrequencyType: 'daily' | 'weekly' | 'monthly' | 'custom' = 'daily';
  let frequencyValue = 1;
  let selectedDays: number[] = [];

  const weekDays = [
    { id: 1, name: 'Mon', full: 'Monday' },
    { id: 2, name: 'Tue', full: 'Tuesday' },
    { id: 3, name: 'Wed', full: 'Wednesday' },
    { id: 4, name: 'Thu', full: 'Thursday' },
    { id: 5, name: 'Fri', full: 'Friday' },
    { id: 6, name: 'Sat', full: 'Saturday' },
    { id: 0, name: 'Sun', full: 'Sunday' }
  ];

  const activityIcons = [
    '🏃‍♀️', '📚', '💪', '🧘‍♀️', '🎯', '💧', '🏋️‍♀️', '🚶‍♀️', '✍️', '🎨',
    '🎵', '👥', '💻', '🍎', '😴', '📱', '🧹', '💊', '🎸', '📝'
  ];

  const colorOptions = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b',
    '#10b981', '#06b6d4', '#84cc16', '#f97316', '#6b7280'
  ];

  $: if (activity) {
    formData = {
      title: activity.title,
      description: activity.description || '',
      categoryId: activity.category.id,
      frequency: activity.frequency,
      color: activity.color,
      icon: activity.icon || '',
      notes: activity.notes || ''
    };
    selectedFrequencyType = activity.frequency.type;
    frequencyValue = activity.frequency.value;
    selectedDays = activity.frequency.specificDays || [];
  }

  function handleFrequencyChange() {
    formData.frequency = {
      type: selectedFrequencyType,
      value: frequencyValue,
      ...(selectedFrequencyType === 'weekly' && { specificDays: selectedDays }),
      ...(selectedFrequencyType === 'custom' && { period: 'week' })
    };
  }

  function toggleDay(dayId: number) {
    if (selectedDays.includes(dayId)) {
      selectedDays = selectedDays.filter(id => id !== dayId);
    } else {
      selectedDays = [...selectedDays, dayId];
    }
    handleFrequencyChange();
  }

  function handleSave() {
    handleFrequencyChange();
    
    if (activity) {
      dispatch('save', { ...formData, id: activity.id });
    } else {
      dispatch('save', formData);
    }
  }

  function handleCancel() {
    dispatch('cancel');
  }

  $: isValid = formData.title.trim() && formData.categoryId && formData.frequency;
</script>

{#if isOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {activity ? 'Edit Activity' : 'Create New Activity'}
          </h2>
          <button 
            on:click={handleCancel}
            class="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form on:submit|preventDefault={handleSave} class="space-y-6">
          <!-- Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              Activity Title *
            </label>
            <input
              id="title"
              type="text"
              bind:value={formData.title}
              placeholder="e.g., Read 20 pages, Morning workout"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              bind:value={formData.description}
              placeholder="Optional description..."
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            ></textarea>
          </div>

          <!-- Category -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              bind:value={formData.categoryId}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a category</option>
              {#each categories as category}
                <option value={category.id}>{category.name}</option>
              {/each}
            </select>
          </div>

          <!-- Frequency -->
          <div>
            <label for="frequency" class="block text-sm font-medium text-gray-700 mb-2">
              Frequency *
            </label>
            <div class="space-y-4">
              <!-- Frequency Type -->
              <div class="grid grid-cols-4 gap-2">
                {#each ['daily', 'weekly', 'monthly', 'custom'] as type}
                  <button
                    type="button"
                    on:click={() => { selectedFrequencyType = type; handleFrequencyChange(); }}
                    class="px-3 py-2 text-sm rounded-lg border transition-colors {
                      selectedFrequencyType === type
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }"
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                {/each}
              </div>

              <!-- Custom frequency value -->
              {#if selectedFrequencyType === 'custom'}
                <div class="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="7"
                    bind:value={frequencyValue}
                    on:change={handleFrequencyChange}
                    class="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span class="text-sm text-gray-600">times per week</span>
                </div>
              {/if}

              <!-- Weekly day selection -->
              {#if selectedFrequencyType === 'weekly' || selectedFrequencyType === 'custom'}
                <div>
                  <p class="text-sm text-gray-600 mb-2">Select specific days:</p>
                  <div class="flex flex-wrap gap-2">
                    {#each weekDays as day}
                      <button
                        type="button"
                        on:click={() => toggleDay(day.id)}
                        class="px-3 py-2 text-sm rounded-lg border transition-colors {
                          selectedDays.includes(day.id)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }"
                      >
                        {day.name}
                      </button>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          </div>

          <!-- Icon Selection -->
          <div>
            <label for="icon-selection" class="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div class="grid grid-cols-10 gap-2">
              {#each activityIcons as icon}
                <button
                  type="button"
                  on:click={() => formData.icon = icon}
                  class="w-10 h-10 flex items-center justify-center text-lg border rounded-lg transition-colors {
                    formData.icon === icon
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }"
                >
                  {icon}
                </button>
              {/each}
            </div>
          </div>

          <!-- Color Selection -->
          <div>
            <label for="color-selection" class="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div class="flex flex-wrap gap-2">
              {#each colorOptions as color}
                <button
                  type="button"
                  on:click={() => formData.color = color}
                  class="w-8 h-8 rounded-full border-2 transition-transform {
                    formData.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                  }"
                  style="background-color: {color};"
                  aria-label="Select color {color}"
                ></button>
              {/each}
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              bind:value={formData.notes}
              placeholder="Additional notes or reminders..."
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              on:click={handleCancel}
              class="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {activity ? 'Update' : 'Create'} Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}