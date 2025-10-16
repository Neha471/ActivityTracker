<script lang="ts">
  interface WeeklyData {
    day: string;
    value: number;
  }

  const weeklyData: WeeklyData[] = [
    { day: 'Mon', value: 45 },
    { day: 'Tue', value: 20 },
    { day: 'Wed', value: 80 },
    { day: 'Thu', value: 35 },
    { day: 'Fri', value: 90 },
    { day: 'Sat', value: 60 },
    { day: 'Sun', value: 75 }
  ];

  const totalTime = '2 h 45 m';
  const totalDistance = '10 km';
  const avgSpeed = '6.1 p/km';
  const progressDistance = '5.6 km';
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <!-- Total Time Card -->
  <div class="bg-gray-800 rounded-2xl p-6 text-white">
    <div class="flex items-center justify-between mb-4">
      <div class="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
        </svg>
      </div>
      <span class="text-sm text-gray-400">Total time</span>
    </div>
    
    <div class="text-3xl font-bold mb-4">{totalTime}</div>
    
    <!-- Weekly Bar Chart -->
    <div class="flex items-end justify-between h-16 space-x-1">
      {#each weeklyData as data}
        <div class="flex flex-col items-center flex-1">
          <div 
            class="bg-white rounded-t-sm w-full min-w-[8px] transition-all duration-300"
            style="height: {data.value}%"
          ></div>
          <span class="text-xs text-gray-400 mt-1">{data.day}</span>
        </div>
      {/each}
    </div>
  </div>

  <!-- Distance Metrics -->
  <div class="bg-gray-800 rounded-2xl p-6 text-white">
    <div class="space-y-4">
      <!-- Total Distance -->
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-400">Total distance</p>
            <p class="text-2xl font-bold">{totalDistance}</p>
          </div>
        </div>
      </div>

      <!-- Average Speed -->
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-400">Average speed</p>
            <p class="text-2xl font-bold">{avgSpeed}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Progress Visualization -->
  <div class="bg-gray-800 rounded-2xl p-6 text-white">
    <div class="text-center mb-6">
      <p class="text-sm text-gray-400 mb-2">Progress</p>
      <p class="text-3xl font-bold">{progressDistance}</p>
    </div>

    <!-- Circular Progress -->
    <div class="flex justify-center mb-4">
      <div class="relative w-24 h-24">
        <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <!-- Background circle -->
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="rgb(55 65 81)"
            stroke-width="8"
            fill="transparent"
          />
          <!-- Progress circle -->
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="rgb(168 85 247)"
            stroke-width="8"
            fill="transparent"
            stroke-dasharray="251.2"
            stroke-dashoffset="75.36"
            class="transition-all duration-500"
          />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-lg font-bold">70%</span>
        </div>
      </div>
    </div>

    <!-- Bar Chart -->
    <div class="flex items-end justify-center space-x-1 h-12">
      {#each Array(8) as _, i}
        <div 
          class="bg-white rounded-t-sm flex-1 transition-all duration-300"
          style="height: {Math.random() * 80 + 20}%; max-width: 12px; opacity: {Math.random() * 0.5 + 0.5}"
        ></div>
      {/each}
    </div>
  </div>
</div>