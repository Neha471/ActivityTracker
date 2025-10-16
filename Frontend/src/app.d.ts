declare global {
  namespace App {
    interface Locals {
      token: string | null;
      refreshToken: string | null;
      user: {
        id: string;
        name: string;
        email: string;
      } | null;
    }
    
    interface PageData {
      user: {
        id: string;
        name: string;
        email: string;
      } | null;
    }
  }

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

  interface PageData {
    user?: User | null;
    [key: string]: any;
  }
  interface ActionResponse {
    success?: boolean;
    error?: string;
    [key: string]: any;
  }
}

export {};
