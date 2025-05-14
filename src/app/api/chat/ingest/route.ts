import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

import 'cheerio';
import { NextResponse } from 'next/server';
import { queryVectorStore } from '../../helpers';

let vectorStore: MemoryVectorStore;

export function getVectorStore() {
  if (!vectorStore) {
    const embeddings = new OpenAIEmbeddings({
      model: 'text-embedding-3-large',
    });
    vectorStore = new MemoryVectorStore(embeddings);
  }
  return vectorStore;
}

export async function POST(request: Request) {
  try {
    const data = request.formData();
    const file: File | null = (await data).get('data') as unknown as File;
    if (!file) {
      return NextResponse.json({
        message: 'Missing file input',
        success: false,
      });
    }

    const fileContent = await file.text();
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splitDocs = await textSplitter.createDocuments([fileContent]);
    await getVectorStore().addDocuments(splitDocs);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
