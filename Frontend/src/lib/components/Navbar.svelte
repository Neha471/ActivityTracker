<script lang="ts">
  import { user } from '$lib/stores/auth';
  import { page } from '$app/stores';
  import { enhance } from '$app/forms';
  import { browser } from '$app/environment';
  
  export let showAuth = true;
  
  // Hide navbar on login, register, and dashboard pages
  $: showNavbar = browser && !['/login', '/register'].includes($page.url.pathname) && !$page.url.pathname.startsWith('/dashboard');
  
  async function handleLogout() {
    try {
      await user.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
</script>

{#if showNavbar}
<nav class="bg-white shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex">
        <div class="flex-shrink-0 flex items-center">
          <span class="text-xl font-bold text-indigo-600">ActivityTracker</span>
        </div>
      </div>
      
      {#if showAuth && $user}
        <div class="flex items-center">
          <span class="text-sm text-gray-700 mr-4">Welcome, {$user?.name || 'User'}</span>
          <div class="ml-3">
            <form method="POST" action="?/logout" use:enhance={handleLogout}>
              <button 
                type="submit" 
                class="text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 py-1 rounded"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      {/if}
    </div>
  </div>
</nav>
{/if}
