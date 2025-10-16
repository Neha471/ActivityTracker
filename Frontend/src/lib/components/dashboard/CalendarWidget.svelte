<script lang="ts">
  import { onMount } from 'svelte';
  
  interface CalendarDay {
    date: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    hasActivity: boolean;
  }

  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  let calendarDays: CalendarDay[] = [];
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function generateCalendar() {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    calendarDays = [];
    
    // Add previous month's trailing days
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      calendarDays.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false,
        hasActivity: false
      });
    }
    
    // Add current month's days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = (
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear()
      );
      
      // Mock activity data - some days have activities
      const hasActivity = [18, 19, 20, 21, 22, 23, 24].includes(day);
      
      calendarDays.push({
        date: day,
        isCurrentMonth: true,
        isToday,
        hasActivity
      });
    }
    
    // Add next month's leading days to fill the grid
    const totalCells = Math.ceil(calendarDays.length / 7) * 7;
    let nextMonthDay = 1;
    while (calendarDays.length < totalCells) {
      calendarDays.push({
        date: nextMonthDay,
        isCurrentMonth: false,
        isToday: false,
        hasActivity: false
      });
      nextMonthDay++;
    }
  }

  onMount(() => {
    generateCalendar();
  });

  $: if (currentMonth !== undefined || currentYear !== undefined) {
    generateCalendar();
  }
</script>

<div class="bg-gray-800 rounded-2xl p-6 text-white">
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <div>
      <h2 class="text-xl font-bold mb-1">Activity Tracking</h2>
      <p class="text-gray-400 text-sm">Thursday, 22 Sep</p>
    </div>
    <button class="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors" aria-label="Calendar options">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
      </svg>
    </button>
  </div>

  <!-- Calendar Grid -->
  <div class="space-y-4">
    <!-- Day Labels -->
    <div class="grid grid-cols-7 gap-2 mb-2">
      {#each dayNames as dayName}
        <div class="text-xs text-gray-400 text-center py-1">
          {dayName}
        </div>
      {/each}
    </div>

    <!-- Calendar Days -->
    <div class="grid grid-cols-7 gap-2">
      {#each calendarDays as day}
        <button 
          class="aspect-square text-sm rounded-lg flex items-center justify-center relative transition-colors {
            day.isToday 
              ? 'bg-white text-gray-900 font-semibold' 
              : day.isCurrentMonth 
                ? 'text-white hover:bg-gray-700' 
                : 'text-gray-600 hover:text-gray-400'
          }"
        >
          {day.date}
          {#if day.hasActivity && day.isCurrentMonth}
            <div class="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <!-- Activity Chart Section -->
  <div class="mt-8 pt-6 border-t border-gray-700">
    <!-- Chart placeholder with mock data points -->
    <div class="h-24 relative flex items-end justify-between px-2">
      <svg class="absolute inset-0 w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
        <!-- Grid lines -->
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgb(75 85 99)" stroke-width="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        <!-- Activity line chart -->
        <polyline
          fill="none"
          stroke="rgb(156 163 175)"
          stroke-width="2"
          points="10,80 30,65 50,45 70,35 90,40 110,30 130,25 150,35 170,20 190,15"
        />
        
        <!-- Data points -->
        <circle cx="10" cy="80" r="3" fill="rgb(156 163 175)" />
        <circle cx="30" cy="65" r="3" fill="rgb(156 163 175)" />
        <circle cx="50" cy="45" r="3" fill="rgb(156 163 175)" />
        <circle cx="70" cy="35" r="3" fill="rgb(156 163 175)" />
        <circle cx="90" cy="40" r="3" fill="rgb(156 163 175)" />
        <circle cx="110" cy="30" r="3" fill="rgb(156 163 175)" />
        <circle cx="130" cy="25" r="3" fill="rgb(156 163 175)" />
        <circle cx="150" cy="35" r="3" fill="rgb(156 163 175)" />
        <circle cx="170" cy="20" r="3" fill="rgb(156 163 175)" />
        <circle cx="190" cy="15" r="3" fill="rgb(156 163 175)" />
      </svg>
    </div>
    
    <!-- Chart metrics -->
    <div class="flex justify-between items-end mt-4">
      <div>
        <p class="text-2xl font-bold">- 5.6</p>
        <p class="text-xs text-gray-400">Done</p>
      </div>
      <div class="text-right">
        <p class="text-2xl font-bold">4.4</p>
        <p class="text-xs text-gray-400">Left</p>
      </div>
    </div>
  </div>
</div>