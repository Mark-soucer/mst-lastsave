import { NextRequest, NextResponse } from 'next/server';
import { getAppointments } from '@/lib/db';
import { getShortCode } from '@/lib/repair-orders/repository';

export const dynamic = 'force-dynamic';

// Comparație tolerantă: fără diacritice, fără majuscule, spații unice.
const normName = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

// Ultimele 9 cifre, ca +40 757 240 854, 0757240854 și 757240854 să fie egale.
const normPhone = (s: string) => s.replace(/\D/g, '').slice(-9);

// POST - caută comenzile după nume ȘI telefon. Returnează doar codul, serviciul și data.
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Cerere invalidă.' }, { status: 400 });
  }

  const raw = (body ?? {}) as Record<string, unknown>;
  const name = normName(typeof raw.name === 'string' ? raw.name : '');
  const phone = normPhone(typeof raw.phone === 'string' ? raw.phone : '');

  if (name.length < 3 || phone.length < 9) {
    return NextResponse.json(
      { success: false, message: 'Introdu numele complet și un număr de telefon valid.' },
      { status: 400 }
    );
  }

  const appointments = await getAppointments();
  const results = appointments
    .filter((a) => normPhone(a.phone ?? '') === phone && normName(a.name ?? '') === name)
    .slice(0, 5)
    .map((a) => ({
      code: getShortCode(a.id),
      service: a.service,
      date: a.date,
    }));

  if (results.length === 0) {
    return NextResponse.json(
      { success: false, message: 'Nu am găsit nicio comandă cu acest nume și număr de telefon.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, results });
}
