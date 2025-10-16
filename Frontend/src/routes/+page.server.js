import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').ServerLoad} */
export function load({ locals }) {
  // If user is logged in, redirect to dashboard
  if (locals.user) {
    throw redirect(303, '/dashboard');
  }
  // If not logged in, redirect to login
  throw redirect(303, '/login');
}
