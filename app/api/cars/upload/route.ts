import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSupabaseClient, ensureCarImagesBucket, CAR_IMAGES_BUCKET } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'images', 'cars');
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function extFromType(type: string): string {
  if (type === 'image/jpeg') return 'jpg';
  if (type === 'image/png') return 'png';
  if (type === 'image/webp') return 'webp';
  if (type === 'image/avif') return 'avif';
  return 'jpg';
}

// POST - primește una sau mai multe poze (FormData, câmp "files") și le salvează
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files').filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ success: false, message: 'Nicio poză trimisă.' }, { status: 400 });
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { success: false, message: `Tip de fișier neacceptat: ${file.type}` },
          { status: 400 }
        );
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { success: false, message: 'Poza este prea mare (max 5MB).' },
          { status: 400 }
        );
      }
    }

    const client = getSupabaseClient();
    const urls: string[] = [];

    if (client) {
      await ensureCarImagesBucket(client);

      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}.${extFromType(file.type)}`;

        const { error } = await client.storage
          .from(CAR_IMAGES_BUCKET)
          .upload(filename, buffer, { contentType: file.type, upsert: false });

        if (error) {
          return NextResponse.json(
            { success: false, message: `Încărcarea a eșuat: ${error.message}` },
            { status: 500 }
          );
        }

        const { data: publicUrlData } = client.storage.from(CAR_IMAGES_BUCKET).getPublicUrl(filename);
        urls.push(publicUrlData.publicUrl);
      }
    } else {
      // fallback local — doar pentru dezvoltare locală, fără Supabase configurat
      ensureUploadDir();
      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}.${extFromType(file.type)}`;
        fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);
        urls.push(`/images/cars/${filename}`);
      }
    }

    return NextResponse.json({ success: true, urls }, { status: 201 });
  } catch (err) {
    console.error('[cars/upload]', err);
    return NextResponse.json({ success: false, message: 'Încărcarea a eșuat.' }, { status: 500 });
  }
}
