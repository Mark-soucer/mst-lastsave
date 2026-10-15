// Citire și salvare a textelor principale din Supabase (doar pe server).
import { getSupabaseClient } from './supabase';
import { DEFAULT_HOME_TEXT, mergeHomeText, validateHomeText, type HomeText } from './site-text-shared';

const TABLE = 'site_content';
const KEY = 'home';

export async function getHomeText(): Promise<HomeText> {
  try {
    const client = getSupabaseClient();
    if (!client) return DEFAULT_HOME_TEXT;

    const { data, error } = await client
      .from(TABLE)
      .select('value')
      .eq('key', KEY)
      .maybeSingle();

    if (error) {
      console.error('[site-text] citire eșuată:', error.message);
      return DEFAULT_HOME_TEXT;
    }
    return mergeHomeText(data?.value);
  } catch (err) {
    console.error('[site-text] eroare:', err);
    return DEFAULT_HOME_TEXT;
  }
}

export async function saveHomeText(input: unknown): Promise<HomeText> {
  const text = validateHomeText(input);

  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Baza de date nu este configurată (lipsesc SUPABASE_URL sau SUPABASE_SERVICE_ROLE_KEY).');
  }

  const { error } = await client.from(TABLE).upsert({
    key: KEY,
    value: text,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(`Salvarea a eșuat: ${error.message}`);
  return text;
}
