'use server';

import { initiData } from "./init/initData";

export async function bootstrap() {
  try {
    // Call our initialization API
    console.log('Initializing server: ');

    const data = await initiData();

    if (!data) {
      throw new Error( 'Initialization failed');
    }
  } catch (error) {
    console.error('Bootstrap error:', error);
    throw error;
  }
}
