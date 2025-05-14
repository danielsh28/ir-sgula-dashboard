import { MemoryVectorStore } from "langchain/vectorstores/memory";

export const queryVectorStore = async (
  vectorStore: MemoryVectorStore,
  query: string
) => {
  const results = await vectorStore.similaritySearch(query);
  console.log(`Found ${results.length} results.`);
  for (const result of results) {
    console.log(`\n ${result.pageContent}`);
  }
};
