import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 */

/**
 * @typedef {Object} AuthResult
 * @property {boolean} success
 * @property {string} [error]
 * @property {User} [user]
 * @property {string} [token]
 */

// Helper function to get a cookie by name
/** @param {string} name */
function getCookie(name) {
  if (!browser) return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// Create a custom store with additional methods
function createAuthStore() {
  let initialUser = null;
  
  // Initialize from cookies if in browser
  if (browser) {
    const userData = getCookie('user');
    if (userData) {
      try {
        initialUser = JSON.parse(decodeURIComponent(userData));
      } catch (e) {
        console.error('Failed to parse user data from cookie', e);
      }
    }
  }

  const { subscribe, set } = writable(initialUser);

  return {
    subscribe,
    set,
    /** @param {string} email @param {string} password */
    login: async (email, password) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        set(data.user);
        return { success: true, user: data.user };
      } else {
        const error = await response.json();
        return { success: false, error: error.message || 'Login failed' };
      }
    },
    /** @param {string} email @param {string} password @param {string} name */
    register: async (email, password, name) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      
      if (response.ok) {
        const data = await response.json();
        set(data.user);
        return { success: true, user: data.user };
      } else {
        const error = await response.json();
        return { success: false, error: error.message || 'Registration failed' };
      }
    },
    logout: async () => {
      console.log('Initiating logout process');
      
      // Clear the user store
      set(null);
      
      if (!browser) {
        console.log('Not in browser environment, skipping logout');
        return;
      }
      
      try {
        // First, try to call the server-side logout endpoint
        const formData = new FormData();
        const response = await fetch('/dashboard?/logout', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData,
          credentials: 'same-origin',
          // Add a timeout to prevent hanging
          signal: AbortSignal.timeout(5000)
        });
        
        if (!response.ok) {
          console.warn('Server logout failed, falling back to client-side cleanup');
          // Fall back to client-side cleanup
          ['auth_token', 'refresh_token', 'user', 'session', 'token'].forEach(name => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost`;
          });
        }
        
        // Clear all storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Force a full page reload to clear any remaining state
        window.location.href = '/login?logout=' + Date.now();
        
      } catch (error) {
        console.error('Error during logout:', error);
        // Still try to redirect even if there was an error
        window.location.href = '/login?error=logout_failed';
      }
    },
    // Check if user is authenticated based on cookies
    isAuthenticated: () => {
      if (!browser) return false;
      const token = getCookie('auth_token');
      const refreshToken = getCookie('refresh_token');
      return !!(token || refreshToken);
    },
    // Get current token
    getToken: () => browser ? getCookie('auth_token') : null,
    // Get refresh token
    getRefreshToken: () => browser ? getCookie('refresh_token') : null
  };
}

export const user = createAuthStore();
