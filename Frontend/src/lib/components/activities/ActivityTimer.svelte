<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import activityService from '$lib/services/activity.service';
  
  export let activityId: string;
  export let isActive: boolean;
  export let onUpdate: () => void;
  
  let elapsedTime = 0;
  let interval: number | null = null;
  
  // Format time as HH:MM:SS
  function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  }
  
  // Start the timer
  async function startTimer() {
    try {
      await activityService.startTracking(activityId);
      isActive = true;
      startInterval();
      onUpdate();
    } catch (error) {
      console.error('Failed to start tracking:', error);
    }
  }
  
  // Stop the timer
  async function stopTimer() {
    try {
      await activityService.stopTracking(activityId);
      isActive = false;
      stopInterval();
      onUpdate();
    } catch (error) {
      console.error('Failed to stop tracking:', error);
    }
  }
  
  // Toggle timer state
  function toggleTimer() {
    if (isActive) {
      stopTimer();
    } else {
      startTimer();
    }
  }
  
  // Start the interval for the running timer
  function startInterval() {
    stopInterval();
    elapsedTime = 0;
    interval = window.setInterval(() => {
      elapsedTime++;
    }, 1000);
  }
  
  // Stop the interval
  function stopInterval() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }
  
  // Clean up interval on component destroy
  onDestroy(() => {
    stopInterval();
  });
  
  // If the timer is active when the component mounts, start the interval
  onMount(() => {
    if (isActive) {
      startInterval();
    }
    
    return () => {
      stopInterval();
    };
  });
</script>

<button
  type="button"
  on:click|stopPropagation={toggleTimer}
  class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
  class:bg-green-600={!isActive}
  class:hover:bg-green-700={!isActive}
  class:focus:ring-green-500={!isActive}
  class:bg-red-600={isActive}
  class:hover:bg-red-700={isActive}
  class:focus:ring-red-500={isActive}
  title={isActive ? 'Stop tracking' : 'Start tracking'}
>
  {#if isActive}
    <span class="flex items-center">
      <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
      {formatTime(elapsedTime)}
    </span>
  {:else}
    <span class="flex items-center">
      <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Start
    </span>
  {/if}
</button>
