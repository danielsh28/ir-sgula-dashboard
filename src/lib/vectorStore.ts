import {
  AstraDBVectorStore,
  AstraLibArgs,
} from '@langchain/community/vectorstores/astradb';
import { OpenAIEmbeddings } from '@langchain/openai';

// Create a singleton for vector store
let vectorStore: AstraDBVectorStore | null = null;
let isInitialized = false;

/**
 * Gets or initializes the vector store singleton
 */
    export async function getVectorStore(): Promise<AstraDBVectorStore> {
  // Return existing instance if available
  if (vectorStore) {
    return vectorStore;
  }

  const embeddings = new OpenAIEmbeddings();

  const config: AstraLibArgs = {
    token: process.env.ASTRA_APPLICATION_TOKEN as string,
    endpoint: process.env.ASTRA_API_ENDPOINT as string,
    collection: process.env.ASTRA_DB_COLLECTION as string,
    collectionOptions: {
      vector: {
        dimension: 1536,
        metric: 'cosine' as const,
      },
    },
  };

  // Create the vector store instance

  try {
    vectorStore = await AstraDBVectorStore.fromExistingIndex(embeddings, config);
  } catch (error) {
    console.error('Error initializing vector store:', error);
    throw new Error('Error initializing vector store');
  }

  return vectorStore;
}

/**
 * Check if the vector store is initialized
 */
export function getVectorStoreStatus() {
  return {
    initialized: isInitialized,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Mark the vector store as initialized
 */
export function setInitialized(value: boolean) {
  isInitialized = value;
}
