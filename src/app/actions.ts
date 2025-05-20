'use server';

import { initializeServer } from '../server';

let initPromise: Promise<void> | null = null;

export async function initialize() {
  if (!initPromise) {
    initPromise = (async () => {
      if (process.env.NODE_ENV !== 'development') {
        console.log('Starting server initialization...');
      }

      try {
        await initializeServer();

        if (process.env.NODE_ENV !== 'development') {
          console.log('Server initialization complete');
        }
      } catch (error) {
        console.error('Server initialization failed:', error);
        // Reset the promise so we can try again
        initPromise = null;
        throw error;
      }
    })();
  }
  return initPromise;
}
