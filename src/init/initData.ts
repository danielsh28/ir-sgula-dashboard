import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import {
  getVectorStore,
  getVectorStoreStatus,
  isStoreInitialized,
  setInitialized,
} from '../lib/vectorStore';

// Set runtime to nodejs since we're using fs operations
export const runtime = 'nodejs';

async function processFile(filePath: string) {
  const buffer = await fs.readFile(filePath);
  const pdfBlob = new Blob([buffer], { type: 'application/pdf' });

  // Load the PDF using LangChain's WebPDFLoader
  const loader = new WebPDFLoader(pdfBlob);
  const docs = await loader.load();

  console.log('\n');
  console.log('\x1b[36m%s\x1b[0m', '====================================');
  console.log('\x1b[36m%s\x1b[0m', `📚 Processing: ${path.basename(filePath)}`);
  console.log('\x1b[36m%s\x1b[0m', `📄 Number of pages: ${docs.length}`);
  console.log('\x1b[36m%s\x1b[0m', '====================================');

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const docContents = docs.map(doc => doc.pageContent);
  const splitDocs = await textSplitter.createDocuments(docContents);

  // Use the global vector store
  const vectorStore = getVectorStore();
  await vectorStore.addDocuments(splitDocs);

  return docs.length;
}

async function initializeWithFiles() {
  try {
    console.log('Initializing with files');
    const dataDir = path.join(process.cwd(), 'data');
    const files = await fs.readdir(dataDir);
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));

    console.log('\n');
    console.log('\x1b[36m%s\x1b[0m', '====================================');
    console.log('\x1b[36m%s\x1b[0m', '🚀 Starting IrSgula Initialization');
    console.log('\x1b[36m%s\x1b[0m', `📁 Found ${pdfFiles.length} PDF files`);
    console.log('\x1b[36m%s\x1b[0m', '====================================');
    console.log('\n');

    const results = [];
    for (const file of pdfFiles) {
      const filePath = path.join(dataDir, file);
      try {
        const pageCount = await processFile(filePath);
        results.push({ file, pageCount, success: true });
      } catch (error) {
        console.error(`Error processing ${file}:`, error);
        results.push({ file, error: (error as Error).message, success: false });
      }
    }

    // Mark the store as initialized after successful processing
    setInitialized(true);

    // Log vector store status after initialization
    const status = getVectorStoreStatus();
    console.log('\n');
    console.log('\x1b[36m%s\x1b[0m', '====================================');
    console.log('\x1b[36m%s\x1b[0m', '📊 Vector Store Status');
    console.log('\x1b[36m%s\x1b[0m', `🔵 Initialized: ${status.isInitialized}`);
    console.log(
      '\x1b[36m%s\x1b[0m',
      `📚 Documents loaded: ${status.documentsCount}`
    );
    console.log('\x1b[36m%s\x1b[0m', '====================================');
    console.log('\n');

    return results;
  } catch (error) {
    console.error('Initialization error:', error);
    throw error;
  }
}

export async function initiData() {
  try {
    if (!isStoreInitialized()) {
      const results = await initializeWithFiles();
      return NextResponse.json({
        success: true,
        results,
        totalFiles: results.length,
        successfulFiles: results.filter(r => r.success).length,
        vectorStoreStatus: getVectorStoreStatus(),
      });
    }
    return NextResponse.json({
      success: true,
      message: 'Already initialized',
      vectorStoreStatus: getVectorStoreStatus(),
    });
  } catch (error) {
    console.error('Error in init route:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
