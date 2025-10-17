<script lang="ts">
  import { onMount } from "svelte";
  import ActivityManagement from "$lib/components/activities/ActivityManagement.svelte";
  import type {
    Activity,
    ActivityCategory,
    ActivityLog,
  } from "$lib/types/activity";
  import apiClient from "$lib/api/client";

  let activities: Activity[] = [];


  let categories: ActivityCategory[] = [];
  let isLoading = true;
  let error: string | null = null;

  async function fetchCategories() {
    try {
      isLoading = true;
      error = null;
      const response = await apiClient.get("/activities/category/all");

      if (!response.status) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.data;
      categories = data.data || [];
    } catch (e) {
      console.error("Error fetching categories:", e);
      error = e instanceof Error ? e.message : "Failed to load categories";
    } finally {
      isLoading = false;
    }
  }

  async function fetchActivities() {
    try {
      isLoading = true;
      error = null;
      const response = await apiClient.get("/activities/");

      if (!response.status) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.data;
      activities = data.data || [];
    } catch (e) {
      console.error("Error fetching activities:", e);
      error = e instanceof Error ? e.message : "Failed to load activities";
    } finally {
      isLoading = false;
    }
  }
  let logs: ActivityLog[] = [];

  let search = "";
  let filterCategory = "";
  let filterStatus: "all" | "active" | "inactive" = "all";

  let showForm = false;
  let editing: Activity | null = null;

  // Seed with examples
  onMount(() => {
    fetchCategories();
    fetchActivities();
  });

  function openCreate() {
    editing = null;
    showForm = true;
    console.log("openCreate");
  }
  function openEdit(a: Activity) {
    editing = a;
    showForm = true;
    console.log(a);
  }

  async function handleSave(e: CustomEvent<any>) {
    const payload = e.detail;
    console.log("payload", payload);

    try {
      if (payload.id) {
        // Update existing activity
        const response = await apiClient.patch(`/activities/${payload.id}`, {
          title: payload.title,
          description: payload.description,
          categoryId: payload.categoryId,
          frequency: payload.frequency,
          color: payload.color,
          icon: payload.icon,
          notes: payload.notes,
        });

        const updatedActivity = response.data.data;
        
        activities = activities.map((a) =>
          a.id === updatedActivity.id
            ? {
                ...a,
                ...updatedActivity,
                category: categories.find((c) => c.id === updatedActivity.categoryId)!,
                updatedAt: new Date().toISOString(),
              }
            : a
        );
      } else {
        const response = await apiClient.post("/activities", {
          title: payload.title,
          description: payload.description,
          categoryId: payload.categoryId,
          frequency: payload.frequency,
          color: payload.color,
          icon: payload.icon,
          notes: payload.notes,
        });

        const newActivity = response.data.data;

        activities = [
          {
            ...newActivity,
            category: categories.find((c) => c.id === newActivity.categoryId)!,
            isActive: true,
            streak: 0,
            totalCompletions: 0,
            consistency: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...activities,
        ];
      }
      showForm = false;
    } catch (e) {
      console.error("Error saving activity:", e);
      error = e instanceof Error ? e.message : "Failed to save activity";
    }
    finally{
      isLoading = false;
      showForm = false;
    }
  }

  function handleCancel() {
    showForm = false;
  }

  function remove(a: Activity) {
    if (confirm("Delete this activity?")) {
      activities = activities.filter((x) => x.id !== a.id);
    }
  }

  $: filtered = activities.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.description || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !filterCategory || a.category.id === filterCategory;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" ? a.isActive : !a.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });
</script>

<div class="min-h-screen bg-gray-50 text-gray-900 flex">
  <div class="flex-1 p-6">
    <!-- Header controls -->
    <div
      class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6"
    >
      <div class="flex-1 flex items-center gap-3">
        <input
          type="text"
          placeholder="Search activities…"
          bind:value={search}
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          bind:value={filterCategory}
          class="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All categories</option>
          {#each categories as c}
            <option value={c.id}>{c.name}</option>
          {/each}
        </select>
        <select
          bind:value={filterStatus}
          class="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <button
        on:click={openCreate}
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >Add Activity</button
      >
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {#each filtered as a}
        <div class="bg-white rounded-2xl p-4 border border-gray-200">
          <div class="flex items-start gap-3">
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center text-xl text-white"
              style="background-color:{a.color}"
            >
              {a.icon || "📝"}
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold">{a.title}</h3>
                <span
                  class="text-xs px-2 py-0.5 rounded-full"
                  style="background-color:{a.category.color}20;color:{a.category
                    .color}">{a.category.name}</span
                >
              </div>
              <p class="text-sm text-gray-600 mt-1 line-clamp-2">
                {a.description}
              </p>
              <div class="flex items-center gap-4 mt-3 text-sm">
                <span>Streak: <strong>{a.streak}</strong></span>
                <span>Consistency: <strong>{a.consistency}%</strong></span>
                <span>Done: <strong>{a.totalCompletions}</strong></span>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 mt-4">
            <button
              on:click={() => openEdit(a)}
              class="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
              >Edit</button
            >
            <button
              on:click={() => remove(a)}
              class="px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
              >Delete</button
            >
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<ActivityManagement
  isOpen={showForm}
  {categories}
  activity={editing}
  on:save={handleSave}
  on:cancel={handleCancel}
/>
