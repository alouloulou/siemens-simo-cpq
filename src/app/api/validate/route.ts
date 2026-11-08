import { NextRequest, NextResponse } from 'next/server';
import { validateConfigurationConstraints, CustomerRequirements } from '@/lib/engine/constraints';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const requirements: CustomerRequirements = body.requirements;
    const selectedComponentIds: string[] = body.selectedComponentIds || [];

    if (!requirements) {
      return NextResponse.json({ error: 'Requirements object is required' }, { status: 400 });
    }

    const validation = validateConfigurationConstraints(requirements, selectedComponentIds);
    return NextResponse.json(validation);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Validation error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
