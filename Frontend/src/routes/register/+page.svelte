<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import type { RegisterFormData } from "./types";

  let email = "";
  let password = "";
  let firstName = "";
  let lastName = "";
  let confirmPassword = "";
  let error = "";
  let isLoading = false;
  export let data;

  export let form: RegisterFormData = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
    error: "",
  };

  onMount(() => {
    if (form) {
      if (form.email) email = form.email;
      if (form.password) password = form.password;
      if (form.error) error = form.error;
      if (form.firstName) firstName = form.firstName;
      if (form.lastName) lastName = form.lastName;
      if (form.confirmPassword) confirmPassword = form.confirmPassword;
    }

    if (data?.user) {
      goto("/dashboard");
    }
  });

  function handleSubmit() {
    isLoading = true;
    error = "";

    return async ({ result, update }: { result: any; update: () => void }) => {
      try {
        update();

        if (result.type === "failure") {
          error = result.data?.error || "Register failed";
        } else if (result.type === "success") {
          // The server has set the cookies, now redirect to dashboard
          // Use a small delay to ensure cookies are properly set
          // await new Promise(resolve => setTimeout(resolve, 100));
          window.location.href = "/dashboard";
        } else if (result.type === "redirect") {
          window.location.href = result.location;
        }
      } catch (err) {
        console.error("Register error:", err);
        error = "An error occurred during register. Please try again.";

        if (err instanceof Error && err.message.includes("Redirect")) {
          window.location.href = "/dashboard";
        }
      } finally {
        isLoading = false;
      }
    };
  }

  function handleDirectSubmit() {
    isLoading = true;
    return true;
  }
</script>

<div class="min-h-screen bg-gray-50 flex w-full">
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

  <div class="flex-1 flex flex-col justify-center items-center p-8">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Already have an account?
          <a
            href="/login"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </a>
        </p>
      </div>

      {#if form?.error}
        <div class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">{form.error}</h3>
            </div>
          </div>
        </div>
      {/if}

      <form
        class="mt-8 space-y-4"
        method="POST"
        action="?/register"
        use:enhance={handleSubmit}
        on:submit={handleDirectSubmit}
        use:enhance
      >
        <input type="hidden" name="_action" value="register" />

        <div
          class="rounded-lg bg-white p-6 shadow-sm border border-gray-200 space-y-4"
        >
          <div>
            <label
              for="firstName"
              class="block text-sm font-medium text-gray-700">First name</label
            >
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="First name"
              bind:value={firstName}
              on:input={(e) => firstName = e.currentTarget.value}
            />
          </div>
          <div>
            <label
              for="lastName"
              class="block text-sm font-medium text-gray-700">Last name</label
            >
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Last name"
              bind:value={lastName}
              on:input={(e) => lastName = e.currentTarget.value}
            />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"
              >Email address</label
            >
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
            <label
              for="password"
              class="block text-sm font-medium text-gray-700">Password</label
            >
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              bind:value={password}
              on:input={(e) => password = e.currentTarget.value}
            />
          </div>
          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700"
              >Confirm Password</label
            >
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Confirm Password"
              bind:value={confirmPassword}
              on:input={(e) => confirmPassword = e.currentTarget.value}
            />
          </div>
        </div>

        <div>
          <button
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Account
          </button>
        </div>
      </form>

      <p class="mt-4 text-center text-sm text-gray-600">
        By signing up, you agree to our
        <a href="/terms" class="font-medium text-indigo-600 hover:text-indigo-500"
          >Terms of Service</a
        >
        and
        <a href="/privacy" class="font-medium text-indigo-600 hover:text-indigo-500"
          >Privacy Policy</a
        >.
      </p>
    </div>
  </div>
</div>
