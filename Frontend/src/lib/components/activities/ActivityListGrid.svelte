<script lang="ts">
  import { onMount } from 'svelte';
  import ActivityManagement from '$lib/components/activities/ActivityManagement.svelte';
  import type { Activity, ActivityCategory, ActivityLog } from '$lib/types/activity';

  // Local mock state for UI-only flow
  let activities: Activity[] = [];
  let categories: ActivityCategory[] = [
    { id: 'reading', name: 'Reading', color: '#10b981' },
    { id: 'fitness', name: 'Fitness', color: '#ef4444' },
    { id: 'learning', name: 'Learning', color: '#6366f1' }
  ];
  let logs: ActivityLog[] = [];

  let search = '';
  let filterCategory = '';
  let filterStatus: 'all' | 'active' | 'inactive' = 'all';

  let showForm = false;
  let editing: Activity | null = null;

  // Seed with examples
  onMount(() => {
    if (activities.length === 0) {
      activities = [
        {
          id: crypto.randomUUID(),
          title: 'Read 20 pages',
          description: 'Evening reading',
          category: categories[0],
          frequency: { type: 'daily', value: 1 },
          color: '#10b981',
          icon: '📚',
          notes: '',
          isActive: true,
          streak: 3,
          totalCompletions: 25,
          consistency: 82,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          title: 'Workout',
          description: 'Gym or run',
          category: categories[1],
          frequency: { type: 'custom', value: 3, period: 'week', specificDays: [1,3,5] },
          color: '#ef4444',
          icon: '💪',
          notes: '',
          isActive: true,
          streak: 1,
          totalCompletions: 12,
          consistency: 60,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
    }
  });

  function openCreate() {
    editing = null;
    showForm = true;
  }
  function openEdit(a: Activity) {
    editing = a;
    showForm = true;
  }
  function handleSave(e: CustomEvent<any>) {
    const payload = e.detail;
    if (payload.id) {
      // update
      activities = activities.map(a => a.id === payload.id ? {
        ...a,
        title: payload.title,
        description: payload.description,
        category: categories.find(c => c.id === payload.categoryId)!,
        frequency: payload.frequency,
        color: payload.color,
        icon: payload.icon,
        notes: payload.notes,
        updatedAt: new Date().toISOString()
      } : a);
    } else {
      // create
      const newA: Activity = {
        id: crypto.randomUUID(),
        title: payload.title,
        description: payload.description,
        category: categories.find(c => c.id === payload.categoryId)!,
        frequency: payload.frequency,
        color: payload.color,
        icon: payload.icon,
        notes: payload.notes,
        isActive: true,
        streak: 0,
        totalCompletions: 0,
        consistency: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      activities = [newA, ...activities];
    }
    showForm = false;
  }
  function handleCancel() { showForm = false; }

  function remove(a: Activity) {
    if (confirm('Delete this activity?')) {
      activities = activities.filter(x => x.id !== a.id);
    }
  }

  $: filtered = activities.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !filterCategory || a.category.id === filterCategory;
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'active' ? a.isActive : !a.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });
</script>

<div class="min-h-screen bg-gray-50 text-gray-900 flex">
  <div class="flex-1 p-6">
    <!-- Header controls -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
      <div class="flex-1 flex items-center gap-3">
        <input
          type="text"
          placeholder="Search activities…"
          bind:value={search}
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <select bind:value={filterCategory} class="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">All categories</option>
          {#each categories as c}
            <option value={c.id}>{c.name}</option>
          {/each}
        </select>
        <select bind:value={filterStatus} class="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <button on:click={openCreate} class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Activity</button>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {#each filtered as a}
        <div class="bg-white rounded-2xl p-4 border border-gray-200">
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl text-white" style="background-color:{a.color}">{a.icon || '📝'}</div>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold">{a.title}</h3>
                <span class="text-xs px-2 py-0.5 rounded-full" style="background-color:{a.category.color}20;color:{a.category.color}">{a.category.name}</span>
              </div>
              <p class="text-sm text-gray-600 mt-1 line-clamp-2">{a.description}</p>
              <div class="flex items-center gap-4 mt-3 text-sm">
                <span>Streak: <strong>{a.streak}</strong></span>
                <span>Consistency: <strong>{a.consistency}%</strong></span>
                <span>Done: <strong>{a.totalCompletions}</strong></span>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 mt-4">
            <button on:click={() => openEdit(a)} class="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">Edit</button>
            <button on:click={() => remove(a)} class="px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50">Delete</button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<ActivityManagement isOpen={showForm} {categories} activity={editing} on:save={handleSave} on:cancel={handleCancel} />