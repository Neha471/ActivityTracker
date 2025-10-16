import { Writable } from 'svelte/store';

declare module '$lib/stores/auth' {
  interface User {
    id: string;
    name: string;
    email: string;
  }

  interface AuthResult {
    success: boolean;
    error?: string;
    user?: User;
    token?: string;
  }

  interface AuthStore extends Writable<User | null> {
    login: (email: string, password: string) => Promise<AuthResult>;
    register: (email: string, password: string, name: string) => Promise<AuthResult>;
    logout: () => Promise<void>;
    isAuthenticated: () => boolean;
    getToken: () => string | null;
    getRefreshToken: () => string | null;
  }

  export const user: AuthStore;
}
