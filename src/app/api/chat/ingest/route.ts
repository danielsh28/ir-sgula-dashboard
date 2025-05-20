import { getVectorStore, setInitialized } from '@/lib/vectorStore';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['text/plain', 'application/pdf'];

async function validateFile(file: File): Promise<string | null> {
  if (file.size > MAX_FILE_SIZE) {
    return `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`;
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return `File type ${file.type} not supported. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('data') as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Missing file input' },
        { status: 400 }
      );
    }

    // Validate file
    const validationError = await validateFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    console.log(
      `Processing file: ${file.name} (${file.type}, ${file.size} bytes)`
    );

    const fileContent = await file.text();
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splitDocs = await textSplitter.createDocuments([fileContent]);
    console.log(`Split into ${splitDocs.length} chunks`);

    const vectorStore = getVectorStore();
    await vectorStore.addDocuments(splitDocs);

    // Mark as initialized after successful ingestion
    setInitialized(true);

    return NextResponse.json(
      {
        success: true,
        message: 'File processed successfully',
        details: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          chunks: splitDocs.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ingest error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process file',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
