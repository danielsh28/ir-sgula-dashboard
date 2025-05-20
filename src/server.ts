'use server';

import { bootstrap } from './bootstrap';

let isBootstrapped = false;

export async function initializeServer() {
  if (isBootstrapped) return;

  try {
    await bootstrap();
    isBootstrapped = true;
  } catch (error) {
    console.error('Failed to initialize server:', error);
    throw error;
  }
}
