<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { user } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  
  // Import global styles
  import '../app/app.css';
  
  // Export data for potential future use
  export const data = {};
  
  let mobileMenuOpen = false;
  let isAuthenticated = false;
  
  // Track if we should show auth UI
  let showAuth = true;
  
  // Update auth state when page loads or user changes
  const unsubscribe = user.subscribe((userData) => {
    isAuthenticated = !!userData;
  });
  
  // Check for existing auth on mount
  onMount(() => {
    if (browser) {
      isAuthenticated = user.isAuthenticated();
      
      // Don't show auth UI on login/register pages
      const noAuthPaths = ['/login', '/register'];
      showAuth = !noAuthPaths.includes(window.location.pathname);
    }
  });
  
  // Clean up subscription
  onDestroy(unsubscribe);
  
  // Close mobile menu when navigating
  function navigateAndCloseMenu(href: string) {
    mobileMenuOpen = false;
    goto(href);
  }
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Activity Tracker - Track your daily activities and build habits" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <main class="flex-1">
    <slot></slot>
  </main>
</div>
