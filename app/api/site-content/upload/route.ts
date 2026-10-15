import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BUCKET = 'site-images';
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

function isAdmin(req: NextRequest): boolean {
  return req.cookies.get('admin_token')?.value === 'authenticated';
}

async function ensureBucket(client: NonNullable<ReturnType<typeof getSupabaseClient>>) {
  try {
    const { data } = await client.storage.getBucket(BUCKET);
    if (!data) await client.storage.createBucket(BUCKET, { public: true });
  } catch {
    // bucket-ul există deja sau nu se poate crea; upload-ul va raporta eroarea reală
  }
}

// POST - încarcă o poză în Supabase Storage (doar admin)
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ success: false, message: 'Neautorizat.' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, message: 'Nicio poză trimisă.' }, { status: 400 });
  }
  if (!EXT[file.type]) {
    return NextResponse.json({ success: false, message: 'Format neacceptat. Folosește JPG, PNG, WebP sau AVIF.' }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ success: false, message: 'Poza este prea mare (max 5MB).' }, { status: 400 });
  }

  const client = getSupabaseClient();
  if (!client) {
    return NextResponse.json(
      { success: false, message: 'Baza de date nu este configurată, poza nu poate fi salvată.' },
      { status: 500 }
    );
  }

  await ensureBucket(client);

  const filename = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}.${EXT[file.type]}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await client.storage.from(BUCKET).upload(filename, buffer, {
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    return NextResponse.json({ success: false, message: `Încărcarea a eșuat: ${error.message}` }, { status: 500 });
  }

  const { data } = client.storage.from(BUCKET).getPublicUrl(filename);
  return NextResponse.json({ success: true, url: data.publicUrl });
}
