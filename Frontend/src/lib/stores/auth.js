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
      // Clear the user store first
      set(null);
      
      if (browser) {
        // Get the current hostname
        const hostname = window.location.hostname;
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
        
        // Clear all auth cookies with proper attributes
        const cookies = ['auth_token', 'refresh_token', 'user'];
        const cookieAttributes = [
          'Path=/',
          'Expires=Thu, 01 Jan 1970 00:00:01 GMT',
          'SameSite=Strict',
          'Secure',
          'HttpOnly'
        ];
        
        if (!isLocalhost) {
          cookieAttributes.push(`Domain=${hostname}`);
        }
        
        // Clear cookies
        cookies.forEach(cookie => {
          // Set the cookie with past expiry and empty value
          document.cookie = `${cookie}=; ${cookieAttributes.join('; ')}`;
          
          // Also try to clear with . prefix for subdomains
          if (!isLocalhost) {
            document.cookie = `${cookie}=; ${cookieAttributes.join('; ').replace(`Domain=${hostname}`, `Domain=.${hostname}`)}`;
          }
        });
        
        // Clear local storage and session storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Use a small timeout to ensure cookies are cleared before redirect
        setTimeout(() => {
          // Use replaceState to prevent back button from going back to the authenticated page
          window.history.replaceState({}, '', '/login');
          // Force a full page reload to clear all state
          window.location.href = '/login';
        }, 100);
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
