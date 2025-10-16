import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { LoginResponse } from './types';

export const actions = {
  login: async ({ request, cookies, fetch }:any) => {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    console.log("🚀 ~ password:", password)

    if (!email) {
      return fail(400, { email, missing: true });
    }

    if (!password) {
      return fail(400, { email, missingPassword: true });
    }

    try {
      console.log('Attempting login with:', { email });
      
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({ email, password })
      });

      const data = await response.json().catch(() => ({}));
      console.log('Login response:', { status: response.status, data });

      if (!response.ok) {
        return fail(response.status, { 
          email,
          error: data?.message || 'Login failed. Please check your credentials.',
          ...data
        });
      }

      if (!data.data) {
        console.error('Invalid response format from server:', data);
        return fail(500, { email, error: 'Invalid response from server' });
      }

      const { token, refreshToken, user } = data.data as LoginResponse;
      console.log("🚀 ~ token, refreshToken, user:", token, refreshToken, user)
      
      // Set the auth tokens in HTTP-only cookies with proper settings
      const cookieOptions = {
        path: '/',
        httpOnly: true,
        sameSite: 'lax' as const,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        encode: (value: string) => value // Prevent encoding of cookie values
      };

      // Set auth token
      cookies.set('auth_token', token, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      // Set refresh token
      cookies.set('refresh_token', refreshToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });

      // Store user data in session
      cookies.set('user', JSON.stringify(user), {
        ...cookieOptions,
        httpOnly: false, // Allow client-side access to user data
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      console.log('Successfully set authentication cookies');
      
      // Return success response instead of throwing redirect
      // The client will handle the redirect to ensure cookies are properly set
      return {
        success: true,
        user
      };

    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        return fail(500, { 
          email, 
          error: error.message || 'An error occurred during login' 
        });
      }
      return fail(500, { 
        email, 
        error: 'An unknown error occurred during login' 
      });
    }
  }
} satisfies Actions;
