import { getVectorStoreStatus } from '@/lib/vectorStore';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const status = getVectorStoreStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check status', details: (error as Error).message },
      { status: 500 }
    );
  }
}
