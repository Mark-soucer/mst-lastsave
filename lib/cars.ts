import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from './supabase';

export const CAR_STATUSES = ['disponibil', 'rezervat', 'vandut'] as const;
export type CarStatus = (typeof CAR_STATUSES)[number];

export const CAR_CONDITIONS = ['nou', 'utilizat'] as const;
export type CarCondition = (typeof CAR_CONDITIONS)[number];

export type CarRecord = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  color?: string;
  description?: string;
  images: string[];
  status: CarStatus;
  // Specificații
  hasVin: boolean;
  power: number; // CP
  engineCapacity: number; // cm3
  doors: number;
  seats: number;
  paintType?: string; // Optiuni culoare: Metalizata, Lucioasa etc.
  firstRegistration?: string; // data primei inmatriculari (text liber sau ISO date)
  condition: CarCondition;
  features: string[]; // dotari
  createdAt: string;
  updatedAt?: string;
};

const CARS_TABLE = 'cars';

type CarRow = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  color: string | null;
  description: string | null;
  images: string[] | null;
  status: CarStatus;
  has_vin: boolean | null;
  power: number | null;
  engine_capacity: number | null;
  doors: number | null;
  seats: number | null;
  paint_type: string | null;
  first_registration: string | null;
  condition: CarCondition | null;
  features: string[] | null;
  created_at: string;
  updated_at: string | null;
};

function rowToCar(row: CarRow): CarRecord {
  return {
    id: row.id,
    make: row.make || 'Necunoscut',
    model: row.model || '-',
    year: row.year || 0,
    price: row.price || 0,
    mileage: row.mileage || 0,
    fuel: row.fuel || '-',
    transmission: row.transmission || '-',
    color: row.color || undefined,
    description: row.description || undefined,
    images: row.images || [],
    status: (row.status || 'disponibil') as CarStatus,
    hasVin: row.has_vin ?? false,
    power: row.power || 0,
    engineCapacity: row.engine_capacity || 0,
    doors: row.doors || 5,
    seats: row.seats || 5,
    paintType: row.paint_type || undefined,
    firstRegistration: row.first_registration || undefined,
    condition: (row.condition || 'utilizat') as CarCondition,
    features: row.features || [],
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || row.created_at || new Date().toISOString(),
  };
}

function carToRow(car: CarRecord): CarRow {
  return {
    id: car.id,
    make: car.make,
    model: car.model,
    year: car.year,
    price: car.price,
    mileage: car.mileage,
    fuel: car.fuel,
    transmission: car.transmission,
    color: car.color ?? null,
    description: car.description ?? null,
    images: car.images,
    status: car.status,
    has_vin: car.hasVin,
    power: car.power,
    engine_capacity: car.engineCapacity,
    doors: car.doors,
    seats: car.seats,
    paint_type: car.paintType ?? null,
    first_registration: car.firstRegistration ?? null,
    condition: car.condition,
    features: car.features,
    created_at: car.createdAt,
    updated_at: car.updatedAt ?? null,
  };
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'cars.json');

function ensureDbExists() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
}

async function readLocalCars(): Promise<CarRecord[]> {
  try {
    ensureDbExists();
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')) as CarRecord[];
  } catch {
    return [];
  }
}

async function writeLocalCars(list: CarRecord[]): Promise<void> {
  ensureDbExists();
  fs.writeFileSync(DB_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

export async function getCars(): Promise<CarRecord[]> {
  const client = getSupabaseClient();
  if (!client) return readLocalCars();

  const { data, error } = await client
    .from(CARS_TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []).map((row) => rowToCar(row as CarRow));
}

export async function getCarById(id: string): Promise<CarRecord | null> {
  const client = getSupabaseClient();
  if (!client) {
    const list = await readLocalCars();
    return list.find((c) => c.id === id) ?? null;
  }

  const { data, error } = await client.from(CARS_TABLE).select('*').eq('id', id).maybeSingle();
  if (error || !data) return null;
  return rowToCar(data as CarRow);
}

export async function saveCar(
  car: Omit<CarRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<CarRecord> {
  const client = getSupabaseClient();
  const newRecord: CarRecord = {
    ...car,
    id: 'car-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
    createdAt: new Date().toISOString(),
  };

  if (!client) {
    const list = await readLocalCars();
    list.unshift(newRecord);
    await writeLocalCars(list);
    return newRecord;
  }

  const { error } = await client.from(CARS_TABLE).insert(carToRow(newRecord));
  if (error) throw new Error('Nu s-a putut salva mașina.');
  return newRecord;
}

const UPDATABLE_KEYS = [
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
] as const;

const KEY_TO_COLUMN: Record<(typeof UPDATABLE_KEYS)[number], string> = {
  make: 'make',
  model: 'model',
  year: 'year',
  price: 'price',
  mileage: 'mileage',
  fuel: 'fuel',
  transmission: 'transmission',
  color: 'color',
  description: 'description',
  images: 'images',
  status: 'status',
  hasVin: 'has_vin',
  power: 'power',
  engineCapacity: 'engine_capacity',
  doors: 'doors',
  seats: 'seats',
  paintType: 'paint_type',
  firstRegistration: 'first_registration',
  condition: 'condition',
  features: 'features',
};

export async function updateCar(
  id: string,
  updates: Partial<Omit<CarRecord, 'id' | 'createdAt'>>
): Promise<CarRecord | null> {
  const client = getSupabaseClient();

  if (!client) {
    const list = await readLocalCars();
    const idx = list.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
    await writeLocalCars(list);
    return list[idx];
  }

  const rowUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of UPDATABLE_KEYS) {
    if (updates[key] !== undefined) rowUpdates[KEY_TO_COLUMN[key]] = updates[key];
  }

  const { data, error } = await client
    .from(CARS_TABLE)
    .update(rowUpdates)
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error || !data) return null;
  return rowToCar(data as CarRow);
}

export async function deleteCar(id: string): Promise<boolean> {
  const client = getSupabaseClient();

  if (!client) {
    const list = await readLocalCars();
    const filtered = list.filter((c) => c.id !== id);
    if (filtered.length === list.length) return false;
    await writeLocalCars(filtered);
    return true;
  }

  const { data, error } = await client.from(CARS_TABLE).delete().eq('id', id).select('id');
  return !error && (data ?? []).length > 0;
}
