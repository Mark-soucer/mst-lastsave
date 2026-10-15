import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
  const keyPresent = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const keySource = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? 'SUPABASE_SERVICE_ROLE_KEY'
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY'
      : 'niciuna';

  const client = getSupabaseClient();
  if (!client) {
    return NextResponse.json({
      ok: false,
      step: 'config',
      url,
      keyPresent,
      keySource,
      message: 'Clientul Supabase nu s-a putut crea (URL sau key lipsă).',
    });
  }

  const carsTest = await client.from('cars').select('id').limit(1);
  const appointmentsTest = await client.from('appointments').select('id').limit(1);

  return NextResponse.json({
    ok: !carsTest.error && !appointmentsTest.error,
    url,
    keyPresent,
    keySource,
    cars: carsTest.error ? { error: carsTest.error.message, code: carsTest.error.code } : { ok: true, rows: carsTest.data?.length },
    appointments: appointmentsTest.error
      ? { error: appointmentsTest.error.message, code: appointmentsTest.error.code }
      : { ok: true, rows: appointmentsTest.data?.length },
  });
}
