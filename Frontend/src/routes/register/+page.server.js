import { redirect } from '@sveltejs/kit';
import { register } from '$lib/stores/auth';

// Temporary types until SvelteKit generates them
/** @typedef {{ request: Request; cookies: any; locals: any }} RequestEvent */
/** @typedef {{ [key: string]: any }} Actions */

/** @type {Actions} */
export const actions = {
  /** @param {RequestEvent} event */
  register: async (event) => {
    const { request, cookies } = event;
    const data = await request.formData();
    const name = data.get('name')?.toString() || '';
    const email = data.get('email')?.toString() || '';
    const password = data.get('password')?.toString() || '';
    const confirmPassword = data.get('confirmPassword')?.toString() || '';
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      return {
        error: 'All fields are required'
      };
    }
    
    if (password !== confirmPassword) {
      return {
        error: 'Passwords do not match'
      };
    }
    
    if (password.length < 8) {
      return {
        error: 'Password must be at least 8 characters long'
      };
    }
    
    try {
      const result = await register(email, password, name);
      
      if (result.success) {
        // In a real app, you would set an HTTP-only cookie with the auth token
        // cookies.set('session', result.token, {
        //   path: '/',
        //   httpOnly: true,
        //   sameSite: 'strict',
        //   secure: process.env.NODE_ENV === 'production',
        //   maxAge: 60 * 60 * 24 * 30 // 30 days
        // });
        
        throw redirect(303, '/dashboard');
      } else {
        return {
          error: result.error || 'Registration failed. Please try again.'
        };
      }
    } catch (/** @type {any} */ error) {
      if (error.status === 303) throw error; // This is our redirect
      
      console.error('Registration error:', error);
      return {
        error: 'An error occurred during registration. Please try again.'
      };
    }
  }
};

/**
 * @param {Object} params
 * @param {any} params.locals
 * @returns {Promise<Object>}
 */
export async function load({ locals }) {
  // If user is already logged in, redirect to dashboard
  if (locals.user) {
    throw redirect(303, '/dashboard');
  }
  
  return {};
}
