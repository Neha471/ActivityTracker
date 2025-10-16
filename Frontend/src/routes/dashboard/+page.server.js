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
  logout: async ({ cookies, locals, url }) => {
    console.log('Starting server-side logout');
    
    // Get the same options used when setting the cookies
    const cookieOptions = {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    };

    // Clear all auth-related cookies with the exact same options they were set with
    ['auth_token', 'refresh_token', 'user'].forEach(name => {
      try {
        // Clear with standard options
        cookies.delete(name, cookieOptions);
        
        // Also clear with httpOnly: false for the user cookie
        if (name === 'user') {
          cookies.delete(name, { ...cookieOptions, httpOnly: false });
        }
        
        console.log(`Cleared cookie: ${name}`);
      } catch (error) {
        console.error(`Error clearing cookie ${name}:`, error);
      }
    });

    // Clear locals
    locals.user = null;
    locals.token = null;
    
    console.log('Logout successful, redirecting to login');
    
    // Force redirect to login with cache-busting
    throw redirect(303, '/login?logout=' + Date.now());
  }
};
