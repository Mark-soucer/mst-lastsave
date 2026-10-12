import { NextRequest, NextResponse } from 'next/server';
import { getCars, saveCar } from '@/lib/cars';

export const dynamic = 'force-dynamic';

// GET - listează toate mașinile de vânzare
export async function GET() {
  try {
    const cars = await getCars();
    return NextResponse.json({ success: true, data: cars });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Eroare la citirea mașinilor.' },
      { status: 500 }
    );
  }
}

// POST - adaugă o mașină nouă (admin)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      make,
      model,
      year,
      price,
      mileage,
      fuel,
      transmission,
      color,
      description,
      images,
      status,
      hasVin,
      power,
      engineCapacity,
      doors,
      seats,
      paintType,
      firstRegistration,
      condition,
      features,
    } = body;

    if (!make || !model || !year || price === undefined) {
      return NextResponse.json(
        { success: false, message: 'Marca, modelul, anul și prețul sunt obligatorii.' },
        { status: 400 }
      );
    }

    const saved = await saveCar({
      make,
      model,
      year: Number(year),
      price: Number(price),
      mileage: Number(mileage) || 0,
      fuel: fuel || '-',
      transmission: transmission || '-',
      color: color || undefined,
      description: description || undefined,
      images: Array.isArray(images) ? images : [],
      status: status || 'disponibil',
      hasVin: Boolean(hasVin),
      power: Number(power) || 0,
      engineCapacity: Number(engineCapacity) || 0,
      doors: Number(doors) || 5,
      seats: Number(seats) || 5,
      paintType: paintType || undefined,
      firstRegistration: firstRegistration || undefined,
      condition: condition || 'utilizat',
      features: Array.isArray(features) ? features : [],
    });

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Nu s-a putut salva mașina.' },
      { status: 500 }
    );
  }
}
