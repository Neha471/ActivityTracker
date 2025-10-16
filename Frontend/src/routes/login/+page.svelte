<script lang="ts">
  import { goto } from "$app/navigation";
  import { enhance } from "$app/forms";
  import { onMount } from 'svelte';
  import type { LoginFormData } from "./types";

  let email = '';
  let password = '';
  let error = '';
  let isLoading = false;
  
  export let form: LoginFormData = {
    email: '',
    password: '',
    error: ''
  };
  export let data;
  
  onMount(() => {
    if (form) {
      if (form.email) email = form.email;
      if (form.password) password = form.password;
      if (form.error) error = form.error;
    }
    
    if (data?.user) {
      goto("/dashboard");
    }
  });

  function handleSubmit() {
    isLoading = true;
    error = '';
    
    return async ({ result, update }: { result: any, update: () => void }) => {
      try {
        update();
        
        if (result.type === 'failure') {
          error = result.data?.error || 'Login failed';
        } else if (result.type === 'success') {
          // The server has set the cookies, now redirect to dashboard
          // Use a small delay to ensure cookies are properly set
          // await new Promise(resolve => setTimeout(resolve, 100));
          window.location.href = '/dashboard';
        } else if (result.type === 'redirect') {
          window.location.href = result.location;
        }
      } catch (err) {
        console.error('Login error:', err);
        error = 'An error occurred during login. Please try again.';
        
        if (err instanceof Error && err.message.includes('Redirect')) {
          window.location.href = '/dashboard';
        }
      } finally {
        isLoading = false;
      }
    };
  }
  
  // Handle direct form submission without JavaScript
  function handleDirectSubmit() {
    isLoading = true;
    return true; // Allow the form to submit normally
  }
</script>

<div class="min-h-screen bg-gray-50 flex w-full">
  <!-- Left Column - Project Info -->
  <div
    class="hidden lg:flex flex-col justify-center w-1/2 bg-gradient-to-br from-indigo-600 to-blue-600 text-white"
  >
    <div class="max-w-md mx-auto">
      <div class="flex items-center mb-8">
        <svg
          class="h-10 w-10 text-white mr-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span class="text-2xl font-bold">ActivityTracker</span>
      </div>
      <h1 class="text-4xl font-bold mb-4">Start Your Journey</h1>
      <p class="text-lg mb-8 text-indigo-100">
        Join thousands of users who track their daily activities and boost their
        productivity with our intuitive platform.
      </p>
      <ul class="space-y-4">
        <li class="flex items-start">
          <svg
            class="h-5 w-5 text-green-300 mt-0.5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Track all your activities in one place</span>
        </li>
        <li class="flex items-start">
          <svg
            class="h-5 w-5 text-green-300 mt-0.5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Get detailed insights and analytics</span>
        </li>
        <li class="flex items-start">
          <svg
            class="h-5 w-5 text-green-300 mt-0.5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Set and achieve your goals</span>
        </li>
      </ul>
    </div>
  </div>

  <!-- Right Column - Login Form -->
  <div class="flex-1 flex flex-col justify-center items-center p-8">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Don't have an account?{' '}
          <a
            href="/register"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>

    {#if error}
      <div class="rounded-md bg-red-50 p-4 mb-4" role="alert">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              {error}
            </h3>
          </div>
        </div>
      </div>
    {/if}

    <form 
      action="?/login"
      method="POST"
      class="mt-8 space-y-6"
      use:enhance={handleSubmit}
      on:submit={handleDirectSubmit}
    >
      <input type="hidden" name="_action" value="login" />

      <div class="rounded-lg bg-white p-6 shadow-sm border border-gray-200 space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
            bind:value={email}
            on:input={(e) => email = e.currentTarget.value}
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            bind:value={password}
            on:input={(e) => password = e.currentTarget.value}
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Password"
          />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <a
              href="/forgot-password"
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </a>
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {#if isLoading}
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Signing in...
          {:else}
            Sign in
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>
