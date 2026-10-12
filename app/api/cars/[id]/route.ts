import { NextRequest, NextResponse } from 'next/server';
import { getCarById, updateCar, deleteCar, CAR_STATUSES } from '@/lib/cars';

export const dynamic = 'force-dynamic';

// GET - detaliile unei mașini
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const car = await getCarById(params.id);
  if (!car) {
    return NextResponse.json({ success: false, message: 'Mașina nu a fost găsită.' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: car });
}

// PATCH - actualizează preț, poze, status, etc (admin)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();

    if (body.status !== undefined && !CAR_STATUSES.includes(body.status)) {
      return NextResponse.json({ success: false, message: 'Status invalid.' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    for (const key of [
      'make',
      'model',
      'year',
      'price',
      'mileage',
      'fuel',
      'transmission',
      'color',
      'description',
      'images',
      'status',
      'hasVin',
      'power',
      'engineCapacity',
      'doors',
      'seats',
      'paintType',
      'firstRegistration',
      'condition',
      'features',
    ]) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    const updated = await updateCar(params.id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Mașina nu a fost găsită.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, message: 'Eroare la actualizare.' }, { status: 500 });
  }
}

// DELETE - șterge o mașină (admin)
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const ok = await deleteCar(params.id);
  if (!ok) {
    return NextResponse.json({ success: false, message: 'Mașina nu a fost găsită.' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: 'Mașină ștearsă cu succes.' });
}
