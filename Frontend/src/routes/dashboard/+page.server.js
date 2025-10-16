import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').ServerLoad} */
export function load({ locals }) {
  // If no user is logged in, redirect to login
  if (!locals.user) {
    throw redirect(303, '/login');
  }
  
  return {
    token: locals.token,
    user: {
      id: locals.user.id,
      name: locals.user.name,
      email: locals.user.email
    }
  };
}

export const actions = {
  logout: async ({ cookies, locals }) => {
    // Clear all auth-related cookies
    ['auth_token', 'refresh_token', 'user'].forEach(cookie => {
      cookies.delete(cookie, { path: '/' });
    });
    
    // Clear locals
    locals.user = null;
    locals.token = null;
    
    throw redirect(303, '/login');
  }
};
