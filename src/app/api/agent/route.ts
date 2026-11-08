import { NextRequest, NextResponse } from 'next/server';
import { runSimoCPQAgent } from '@/lib/agent/controller';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds timeout on Vercel

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body.prompt;
    const customerTier = body.customerTier || 'Standard (0%)';

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'A valid text prompt describing product requirements is required.' },
        { status: 400 }
      );
    }

    const result = await runSimoCPQAgent(prompt, customerTier);
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error('API /api/agent error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
