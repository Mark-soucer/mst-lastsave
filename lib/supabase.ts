import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const CAR_IMAGES_BUCKET = 'car-images';

let client: SupabaseClient | null = null;
let warned = false;

export function getSupabaseClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    if (!warned) {
      console.warn('[supabase] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY lipsesc.');
      warned = true;
    }
    return null;
  }

  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
      },
    });
  }
  return client;
}

let bucketChecked = false;

export async function ensureCarImagesBucket(client: SupabaseClient): Promise<void> {
  if (bucketChecked) return;
  bucketChecked = true;
  try {
    const { data } = await client.storage.getBucket(CAR_IMAGES_BUCKET);
    if (!data) {
      await client.storage.createBucket(CAR_IMAGES_BUCKET, { public: true });
    }
  } catch {
    // dacă bucket-ul există deja sau nu avem voie să-l creăm, continuăm — upload-ul va eșua clar dacă e cazul
  }
}
