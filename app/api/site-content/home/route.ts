import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getHomeText, saveHomeText } from '@/lib/site-text';

export const dynamic = 'force-dynamic';

function isAdmin(req: NextRequest): boolean {
  return req.cookies.get('admin_token')?.value === 'authenticated';
}

export async function GET() {
  const data = await getHomeText();
  return NextResponse.json({ success: true, data });
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ success: false, message: 'Neautorizat.' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Cerere invalidă.' }, { status: 400 });
  }

  try {
    const data = await saveHomeText(body);
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Eroare necunoscută.';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
