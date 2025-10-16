// Type definitions for the auth store
declare global {
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
}

export {}; // This file needs to be a module.
