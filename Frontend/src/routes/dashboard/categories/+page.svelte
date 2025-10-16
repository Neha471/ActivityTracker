<script lang="ts">
  import type { ActivityCategory } from '$lib/types/activity';
  
  let categories: ActivityCategory[] = [
    { id: 'reading', name: 'Reading', color: '#10b981', icon: '📚' },
    { id: 'fitness', name: 'Fitness', color: '#ef4444', icon: '💪' },
    { id: 'learning', name: 'Learning', color: '#6366f1', icon: '🎓' },
    { id: 'health', name: 'Health', color: '#8b5cf6', icon: '🏥' },
    { id: 'work', name: 'Work', color: '#f59e0b', icon: '💼' }
  ];
  
  let showForm = false;
  let editingCategory: ActivityCategory | null = null;
  let newCategory = { name: '', color: '#6366f1', icon: '📝' };

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
    if (editingCategory) {
      // Edit existing
      const index = categories.findIndex(c => c.id === editingCategory.id);
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
        <p class="text-gray-600 mt-1">Organize your activities with custom categories</p>
      </div>
      <button 
        on:click={openCreate}
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add Category
      </button>
    </div>

    <!-- Categories Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each categories as category}
        <div class="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div 
                class="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl"
                style="background-color: {category.color};"
              >
                {category.icon || '📝'}
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
  </div>
</div>

<!-- Category Form Modal -->
{#if showForm}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl max-w-md w-full p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        {editingCategory ? 'Edit Category' : 'Create Category'}
      </h3>
      
      <form on:submit|preventDefault={saveCategory} class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
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
          <label for="icon" class="block text-sm font-medium text-gray-700 mb-1">
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
          <label for="color" class="block text-sm font-medium text-gray-700 mb-1">
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
            on:click={() => showForm = false}
            class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {editingCategory ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}