// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }

  interface ActionData {
    email?: string;
    password?: string;
    error?: string;
    missing?: boolean;
    missingPassword?: boolean;
  }
}

export {};
