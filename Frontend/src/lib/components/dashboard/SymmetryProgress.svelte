<script lang="ts">
  export let percentage: number = 95;
  
  // Generate bars with different heights for symmetry visualization
  const bars = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    height: Math.random() * 60 + 20, // Random height between 20% and 80%
    opacity: Math.random() * 0.5 + 0.5 // Random opacity between 0.5 and 1
  }));
</script>

<div class="bg-gray-800 rounded-2xl p-6 text-white">
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <h3 class="text-lg font-semibold">Symetry</h3>
    <button class="text-gray-400 hover:text-white transition-colors" aria-label="Symmetry options">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>

  <!-- Percentage Display -->
  <div class="text-center mb-6">
    <div class="text-4xl font-bold mb-2">{percentage}% <span class="text-green-400 text-2xl">▲</span></div>
  </div>

  <!-- Bar Visualization -->
  <div class="flex items-end justify-center space-x-1 h-20">
    {#each bars as bar}
      <div 
        class="bg-white rounded-t-sm flex-1 transition-all duration-300"
        style="height: {bar.height}%; opacity: {bar.opacity}; max-width: 12px;"
      ></div>
    {/each}
  </div>
</div>