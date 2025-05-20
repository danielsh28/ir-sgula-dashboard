import { OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

interface VectorStoreStatus {
  isInitialized: boolean;
  documentsCount: number;
  lastInitialized?: Date;
}

// Global instance that persists across API calls
let globalVectorStore: MemoryVectorStore | null = null;
let isInitialized = false;
let lastInitializedTime: Date | undefined;

export function getVectorStoreStatus(): VectorStoreStatus {
  return {
    isInitialized,
    documentsCount: globalVectorStore?.memoryVectors?.length || 0,
    lastInitialized: lastInitializedTime,
  };
}

export function isStoreInitialized(): boolean {
  return isInitialized && globalVectorStore !== null;
}

export function setInitialized(status: boolean): void {
  isInitialized = status;
  if (status) {
    lastInitializedTime = new Date();
  }
}

export function getVectorStore(): MemoryVectorStore {
  if (!globalVectorStore) {
    console.log(
      '\x1b[33m%s\x1b[0m',
      '🔄 Creating new vector store instance...'
    );
    const embeddings = new OpenAIEmbeddings({
      model: 'text-embedding-3-large',
    });
    globalVectorStore = new MemoryVectorStore(embeddings);
  } else {
    console.log('\x1b[32m%s\x1b[0m', '✅ Using existing vector store instance');
    console.log(
      '\x1b[36m%s\x1b[0m',
      `📚 Documents loaded: ${globalVectorStore.memoryVectors?.length || 0}`
    );
  }
  return globalVectorStore;
}

export function clearVectorStore(): void {
  globalVectorStore = null;
  isInitialized = false;
  lastInitializedTime = undefined;
  console.log('\x1b[31m%s\x1b[0m', '🗑️ Vector store cleared');
}
