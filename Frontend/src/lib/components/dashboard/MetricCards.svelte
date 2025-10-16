<script lang="ts">
  interface MetricCard {
    id: string;
    title: string;
    value: string;
    icon: string;
    bgColor: string;
  }

  const metrics: MetricCard[] = [
    {
      id: 'time',
      title: 'Time',
      value: '56m',
      icon: 'time',
      bgColor: 'bg-gray-700'
    },
    {
      id: 'distance',
      title: 'Total distance',
      value: '15 h 5km',
      icon: 'distance',
      bgColor: 'bg-purple-400'
    },
    {
      id: 'energy',
      title: 'Energy burn',
      value: '1345 kal',
      icon: 'energy',
      bgColor: 'bg-pink-400'
    },
    {
      id: 'sleep',
      title: 'Sleep',
      value: '56m',
      icon: 'sleep',
      bgColor: 'bg-blue-300'
    }
  ];
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  {#each metrics as metric}
    <div class="rounded-2xl p-6 {metric.bgColor} text-gray-900 relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute top-4 right-4 opacity-20">
        {#if metric.icon === 'time'}
          <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
          </svg>
        {:else if metric.icon === 'distance'}
          <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        {:else if metric.icon === 'energy'}
          <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
          </svg>
        {:else if metric.icon === 'sleep'}
          <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        {/if}
      </div>
      
      <!-- Content -->
      <div class="relative z-10">
        <div class="flex items-center mb-2">
          <div class="w-8 h-8 bg-black bg-opacity-20 rounded-full flex items-center justify-center mr-3">
            {#if metric.icon === 'time'}
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
            {:else if metric.icon === 'distance'}
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            {:else if metric.icon === 'energy'}
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
              </svg>
            {:else if metric.icon === 'sleep'}
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            {/if}
          </div>
        </div>
        
        <h3 class="text-sm font-medium mb-1 opacity-80">{metric.title}</h3>
        <p class="text-3xl font-bold">{metric.value}</p>
      </div>
    </div>
  {/each}
</div>