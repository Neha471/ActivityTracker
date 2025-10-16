<script>
  import Sidebar from '$lib/components/dashboard/Sidebar.svelte';
  import { page } from '$app/stores';
</script>

<div class="min-h-screen bg-gray-50 text-gray-900 flex">
  <Sidebar />
  <main class="flex-1 p-6">
    <slot />
  </main>
</div>

<style>
  /* Add any global styles for the dashboard layout here */
</style>
