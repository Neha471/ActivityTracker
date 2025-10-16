<script lang="ts">
  interface RunningActivity {
    id: string;
    title: string;
    date: string;
    time: string;
    user: {
      name: string;
      avatar: string;
    };
    shoes: {
      left: string;
      right: string;
    };
  }

  const activity: RunningActivity = {
    id: '1',
    title: 'Running with Kate',
    date: '9 July, 2022',
    time: '34 min',
    user: {
      name: 'Kate',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e5d05c?w=100&h=100&fit=crop&crop=face'
    },
    shoes: {
      left: 'shoe-left',
      right: 'shoe-right'
    }
  };
</script>

<div class="bg-gray-800 rounded-2xl p-6 text-white relative overflow-hidden">
  <!-- Background decoration -->
  <div class="absolute top-0 right-0 opacity-10">
    <svg class="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13.5,5.5C13.5,3.5 11.5,2 9.5,2C7.5,2 5.5,3.5 5.5,5.5C5.5,7.5 7.5,9 9.5,9C11.5,9 13.5,7.5 13.5,5.5M9.89,9.89L8.43,15L4.5,21H6.5L9.5,16L11.5,21H13.5L10.39,14.26L12.89,9.89H9.89M21.7,18.27C21.7,18.27 20.5,19 19.77,19.5C19.04,20 18.27,20.5 18.27,20.5L16.06,18.29C16.06,18.29 17.04,17.5 17.77,17C18.5,16.5 19.27,16 19.27,16L21.7,18.27Z"/>
    </svg>
  </div>

  <!-- User Profile -->
  <div class="flex items-center mb-4 relative z-10">
    <img 
      src={activity.user.avatar}
      alt={activity.user.name}
      class="w-10 h-10 rounded-full object-cover mr-3"
      on:error={(e) => {
        // Fallback to a default avatar
        e.currentTarget.src = `https://ui-avatars.com/api/?name=${activity.user.name}&background=6366f1&color=fff`;
      }}
    />
    <div>
      <h3 class="text-lg font-semibold">{activity.title}</h3>
      <div class="flex items-center text-sm text-gray-400">
        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
        </svg>
        <span>{activity.date}</span>
      </div>
    </div>
    
    <button class="ml-auto text-gray-400 hover:text-white transition-colors">
      <span class="text-sm font-medium">View more</span>
    </button>
  </div>

  <!-- Shoe Icons -->
  <div class="flex items-center justify-center space-x-8 mb-6 relative z-10">
    <!-- Left shoe -->
    <div class="flex flex-col items-center">
      <svg class="w-12 h-12 text-white mb-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2,18H22L20.5,16.5C20.5,16.5 19,15 19,13.5C19,12 19,11 19,11H15L13,8H11V6H7V8H5C3.89,8 3,8.89 3,10V12C3,12.89 3.89,13 4,13H6V15C6,15 6,16.5 2,18Z"/>
      </svg>
    </div>
    
    <!-- Right shoe -->
    <div class="flex flex-col items-center">
      <svg class="w-12 h-12 text-white mb-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22,18H2C6,16.5 6,15 6,15V13H4C3.89,13 3,12.89 3,12V10C3,8.89 3.89,8 5,8H7V6H11V8H13L15,11H19C19,11 19,12 19,13.5C19,15 20.5,16.5 20.5,16.5L22,18Z"/>
      </svg>
    </div>
  </div>

  <!-- Progress Bar -->
  <div class="relative z-10">
    <div class="flex justify-between items-center mb-2">
      <span class="text-sm text-gray-400">Double Walking Time</span>
    </div>
    <div class="w-full bg-gray-700 rounded-full h-2 mb-2">
      <div class="bg-white h-2 rounded-full" style="width: 75%"></div>
    </div>
    <div class="text-center">
      <span class="text-2xl font-bold">{activity.time}</span>
    </div>
  </div>
</div>