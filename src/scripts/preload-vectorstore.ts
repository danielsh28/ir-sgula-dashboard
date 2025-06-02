import { getVectorStore } from '../lib/vectorStore';

/**
 * Simple script to preload the vector store
 * Can be run with: pnpm preload
 */
async function preloadVectorStore() {
  console.log('🚀 Pre-warming vector store...');
  const startTime = Date.now();

  try {
    await getVectorStore();
    const elapsed = Date.now() - startTime;
    console.log(`✅ Vector store initialized successfully in ${elapsed}ms`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to initialize vector store:', error);
    process.exit(1);
  }
}

// Run the preload function
preloadVectorStore();
