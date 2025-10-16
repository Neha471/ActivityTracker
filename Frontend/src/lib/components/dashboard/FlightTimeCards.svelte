<script lang="ts">
  interface FlightCard {
    id: string;
    title: string;
    time: string;
    flightTime: string;
    icon: string;
  }

  const flightCards: FlightCard[] = [
    {
      id: 'contact1',
      title: 'Contact',
      time: '17 min',
      flightTime: '17 min',
      icon: 'shoe1'
    },
    {
      id: 'contact2',
      title: 'Contact',
      time: '17 min',
      flightTime: '17 min',
      icon: 'shoe2'
    }
  ];
</script>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
  {#each flightCards as card}
    <div class="bg-gray-800 rounded-2xl p-6 text-white">
      <!-- Icon and dropdown -->
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
          {#if card.icon === 'shoe1'}
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2,18H22L20.5,16.5C20.5,16.5 19,15 19,13.5C19,12 19,11 19,11H15L13,8H11V6H7V8H5C3.89,8 3,8.89 3,10V12C3,12.89 3.89,13 4,13H6V15C6,15 6,16.5 2,18Z"/>
            </svg>
          {:else}
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22,18H2C6,16.5 6,15 6,15V13H4C3.89,13 3,12.89 3,12V10C3,8.89 3.89,8 5,8H7V6H11V8H13L15,11H19C19,11 19,12 19,13.5C19,15 20.5,16.5 20.5,16.5L22,18Z"/>
            </svg>
          {/if}
        </div>
        
        <button class="text-gray-400 hover:text-white transition-colors" aria-label="Flight time options">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="space-y-3">
        <div>
          <h3 class="text-lg font-semibold mb-1">{card.title}</h3>
          <p class="text-2xl font-bold text-white">{card.time} <span class="text-gray-400 text-sm">▲</span></p>
        </div>
        
        <div>
          <p class="text-sm text-gray-400 mb-1">Flight time</p>
          <p class="text-lg font-semibold">{card.flightTime} <span class="text-gray-400 text-sm">▼</span></p>
        </div>
      </div>
    </div>
  {/each}
</div>