<script lang="ts">
  import { onMount } from 'svelte';
  import type { ActivityCategory } from '$lib/types/activity';
  import apiClient from '$lib/api/client';
  
  let categories: ActivityCategory[] = [];
  let isLoading = true;
  let error: string | null = null;
  
  let showForm = false;
  let editingCategory: ActivityCategory | null = null;
  let newCategory = { name: '', color: '#6366f1', icon: '📝' };

  async function fetchCategories() {
    try {
      isLoading = true;
      error = null;
      const response = await apiClient.get('/activities/category/all');
      
      if (!response.status) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.data;
      categories = data.data || [];
    } catch (e) {
      console.error('Error fetching categories:', e);
      error = e instanceof Error ? e.message : 'Failed to load categories';
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    fetchCategories();
  });

  function openCreate() {
    editingCategory = null;
    newCategory = { name: '', color: '#6366f1', icon: '📝' };
    showForm = true;
  }
  
  function openEdit(category: ActivityCategory) {
    editingCategory = category;
    newCategory = { ...category };
    showForm = true;
  }
  
  function saveCategory() {
    // TODO: Implement API call to save/update category
    if (editingCategory) {
      // Edit existing
      const index = categories.findIndex(c => c.id === editingCategory?.id);
      if (index >= 0) {
        categories[index] = { ...editingCategory, ...newCategory };
        categories = [...categories];
      }
    } else {
      // Create new
      const newCat: ActivityCategory = {
        id: crypto.randomUUID(),
        ...newCategory
      };
      categories = [...categories, newCat];
    }
    showForm = false;
  }
  
  function deleteCategory(category: ActivityCategory) {
    if (confirm(`Delete "${category.name}" category?`)) {
      // TODO: Implement API call to delete category
      categories = categories.filter(c => c.id !== category.id);
    }
  }
</script>

<div class="min-h-screen bg-gray-50 p-6">
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Categories</h1>
        <p class="text-gray-600 mt-1">
          Organize your activities with custom categories
        </p>
      </div>
      <button
        on:click={openCreate}
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add Category
      </button>
    </div>

    <!-- Categories Grid -->
    <!-- Loading and Error States -->
    {#if isLoading}
      <div class="col-span-full flex justify-center items-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        ></div>
      </div>
    {:else if error}
      <div class="col-span-full bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">
              {error}
              <button
                on:click={fetchCategories}
                class="ml-2 text-blue-600 hover:text-blue-800"
              >
                Try again
              </button>
            </p>
          </div>
        </div>
      </div>
    {:else if categories.length === 0}
      <div class="col-span-full text-center py-12">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No categories</h3>
        <p class="mt-1 text-sm text-gray-500">
          Get started by creating a new category.
        </p>
        <div class="mt-6">
          <button
            type="button"
            on:click={openCreate}
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              class="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            New Category
          </button>
        </div>
      </div>
    {:else}
      <!-- Categories Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each categories as category}
          <div
            class="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl"
                  style="background-color: {category.color};"
                >
                  {category.icon || "📝"}
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">{category.name}</h3>
                  <p class="text-sm text-gray-500">{category.color}</p>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-2">
              <button
                on:click={() => openEdit(category)}
                class="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                on:click={() => deleteCategory(category)}
                class="px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<!-- Category Form Modal -->
{#if showForm}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-2xl max-w-md w-full p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        {editingCategory ? "Edit Category" : "Create Category"}
      </h3>

      <form on:submit|preventDefault={saveCategory} class="space-y-4">
        <div>
          <label
            for="name"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Category Name
          </label>
          <input
            id="name"
            type="text"
            bind:value={newCategory.name}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Reading, Fitness"
          />
        </div>

        <div>
          <label
            for="icon"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Icon
          </label>
          <input
            id="icon"
            type="text"
            bind:value={newCategory.icon}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="📚"
          />
        </div>

        <div>
          <label
            for="color"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Color
          </label>
          <input
            id="color"
            type="color"
            bind:value={newCategory.color}
            class="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            on:click={() => (showForm = false)}
            class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {editingCategory ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
