import { VercelPostgres } from '@langchain/community/vectorstores/vercel_postgres';
import { OpenAIEmbeddings } from '@langchain/openai';

// Create a singleton for vector store
let vectorStore: VercelPostgres | null = null;
let isInitialized = false;

/**
 * Gets or initializes the vector store singleton
 */
export async function getVectorStore(): Promise<VercelPostgres> {
  // Return existing instance if available
  if (vectorStore) {
    return vectorStore;
  }

  // Initialize a new instance
  console.log('Initializing vector store...');
  const embeddings = new OpenAIEmbeddings({
    model: 'text-embedding-3-large',
  });

  vectorStore = await VercelPostgres.initialize(embeddings, {
    postgresConnectionOptions: {
      connectionString: process.env.POSTGRES_URL,
      max: 5, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
    },
    tableName: 'langchain_vectors',
  });

  isInitialized = true;
  console.log('Vector store initialized successfully');
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
