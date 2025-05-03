import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

import 'cheerio';
import { NextResponse } from 'next/server';


const queryVectorStore = async (vectorStore: MemoryVectorStore) => {
  const results = await vectorStore.similaritySearch('כמה החטיאו שחקניו של סטיב קר?');
  console.log(`Found ${results.length} results.`);
  for (const result of results) {
    console.log(`\n ${result.pageContent}`);
  }
};

export async function POST() {
  try {
    const embeddings = new OpenAIEmbeddings({
        model: 'text-embedding-3-large',
    });

    const vectorStore = new MemoryVectorStore(embeddings);

    // Load and chunk contents of blog
    const pTagSelector = 'p';
    const cheerioLoader = new CheerioWebBaseLoader(
      'https://www.ynet.co.il/sport/worldbasketball/article/ryct1b7xgx',
      {
        selector: pTagSelector,
      }
    );
    const docs = await cheerioLoader.load();
    console.assert(docs.length === 1);
    console.log(`Total characters: ${docs[0].pageContent.length}`);
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const allSplits = await splitter.splitDocuments(docs);
      console.log(`Split blog post into ${allSplits.length} sub-documents.`);

    await vectorStore.addDocuments(allSplits);
    console.log(`Added ${allSplits.length} documents to vector store.`);
    await queryVectorStore(vectorStore);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
