import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // Get user data from the user cookie
  const userData = event.cookies.get('user');
  const authToken = event.cookies.get('auth_token');
  
  if (userData && authToken) {
    try {
      const user = JSON.parse(userData);
      
      event.locals = {
        ...event.locals,
        token: authToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      };
    } catch (error) {
      console.error('Invalid user data in cookie:', error);
      // Clear invalid cookies
      ['user', 'auth_token', 'refresh_token'].forEach(cookie => {
        event.cookies.delete(cookie, { path: '/' });
      });
    }
  } else {
    // Ensure user is null if no session
    event.locals = {
      ...event.locals,
      user: null
    };
  }

  // Handle protected routes
  if (event.url.pathname.startsWith('/dashboard') && !event.locals.user) {
    throw redirect(303, '/login');
  }

  // Handle auth routes when already logged in
  if ((event.url.pathname === '/login' || event.url.pathname === '/register') && event.locals.user) {
    throw redirect(303, '/dashboard');
  }

  // Resolve the request
  const response = await resolve(event);
  return response;
}
