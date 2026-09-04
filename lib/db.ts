import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { APPOINTMENT_STATUSES, type AppointmentState } from './repair-orders/types';

export type AppointmentRecord = {
  id: string;
  service: string;
  carModel: string;
  carYear: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  notes?: string;
  status: AppointmentState;
  createdAt: string;
  updatedAt?: string;
  proposedDate?: string;
  proposedTime?: string;
  proposalMessage?: string;
  carMake?: string;
  problemDescription?: string;
};

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

const APPOINTMENTS_TABLE = 'appointments';

let supabaseClient: SupabaseClient | null = null;
let warnedMissingConfig = false;

function getSupabaseClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    if (!warnedMissingConfig) {
      console.warn('[db] SUPABASE_URL / SUPABASE_ANON_KEY lipsesc. Se folosește fallback local.');
      warnedMissingConfig = true;
    }
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      // Forțează fiecare request să NU fie cache-uit (Next.js App Router
      // cache-ui implicit fetch-urile în Server Components). Pagina /status/[id]
      // trebuie să citească întotdeauna valoarea curentă din Supabase.
      global: {
        fetch: (url, options) =>
          fetch(url, { ...options, cache: 'no-store' }),
      },
    });
  }
  return supabaseClient;
}

type AppointmentRow = {
  id: string;
  service: string;
  car_model: string;
  car_year: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  notes: string | null;
  status: AppointmentState;
  created_at: string;
  updated_at: string | null;
  proposed_date: string | null;
  proposed_time: string | null;
  proposal_message: string | null;
  car_make?: string | null;
  problem_description?: string | null;
};

/**
 * Fallback-uri de fier! Orice valoare lipsă (NULL) va fi înlocuită cu un text standard.
 * Astfel, pagina clientului nu va mai „crăpa” niciodată, chiar dacă formularul dă rateuri.
 */
function rowToAppointment(row: AppointmentRow): AppointmentRecord {
  return {
    id: row.id || 'id-necunoscut',
    service: row.service || 'Serviciu Nespecificat',
    carModel: row.car_model || 'Model Necunoscut',
    carYear: row.car_year || '-',
    date: row.date || '-',
    time: row.time || '-',
    name: row.name || 'Client',
    phone: row.phone || '-',
    notes: row.notes || undefined,
    status: (row.status || 'noua') as AppointmentState,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || row.created_at || new Date().toISOString(),
    proposedDate: row.proposed_date || undefined,
    proposedTime: row.proposed_time || undefined,
    proposalMessage: row.proposal_message || undefined,
    carMake: row.car_make || 'Necunoscut',
    problemDescription: row.problem_description || 'Fără descriere',
  };
}

function appointmentToRow(appointment: AppointmentRecord): AppointmentRow {
  return {
    id: appointment.id,
    service: appointment.service,
    car_model: appointment.carModel,
    car_year: appointment.carYear,
    date: appointment.date,
    time: appointment.time,
    name: appointment.name,
    phone: appointment.phone,
    notes: appointment.notes ?? null,
    status: appointment.status,
    created_at: appointment.createdAt,
    updated_at: appointment.updatedAt ?? null,
    proposed_date: appointment.proposedDate ?? null,
    proposed_time: appointment.proposedTime ?? null,
    proposal_message: appointment.proposalMessage ?? null,
  };
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'appointments.json');

function ensureDbExists() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

async function readLocalAppointments(): Promise<AppointmentRecord[]> {
  try {
    ensureDbExists();
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data) as AppointmentRecord[];
  } catch {
    return [];
  }
}

async function writeLocalAppointments(list: AppointmentRecord[]): Promise<void> {
  ensureDbExists();
  fs.writeFileSync(DB_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

export async function getAppointments(): Promise<AppointmentRecord[]> {
  const client = getSupabaseClient();
  if (!client) return readLocalAppointments();

  const { data, error } = await client
    .from(APPOINTMENTS_TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []).map((row) => rowToAppointment(row as AppointmentRow));
}

function normalizeLookupCode(value: string): string {
  return value.trim().replace(/^(?:#+|%23)+/i, '').toLowerCase();
}

/**
 * Căutare sigură: Caută codul scurt în tot ID-ul și previne eroarea PGRST116 prin folosirea `.limit(1)`
 */
export async function findAppointmentByCode(idOrCode: string): Promise<AppointmentRecord | null> {
  const code = normalizeLookupCode(idOrCode);
  if (!code) return null;

  const client = getSupabaseClient();

  if (!client) {
    const list = await readLocalAppointments();
    const found = list.find((candidate) => candidate.id.toLowerCase().includes(code));
    return found ?? null;
  }

  // Căutăm orice comandă al cărei ID conține codul nostru scurt.
  // limit(1) ne asigură că returnăm exact un singur rând, fără a declanșa eroarea Supabase.
  const { data, error } = await client
    .from(APPOINTMENTS_TABLE)
    .select('*')
    .ilike('id', `%${code}%`)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[db] Eroare căutare Supabase:', error.message);
    return null;
  }

  return data ? rowToAppointment(data as AppointmentRow) : null;
}

export async function saveAppointment(appointment: Omit<AppointmentRecord, 'id' | 'status' | 'createdAt'>): Promise<AppointmentRecord> {
  const client = getSupabaseClient();
  const newRecord: AppointmentRecord = {
    ...appointment,
    id: 'mst-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
    status: 'noua',
    createdAt: new Date().toISOString(),
  };

  if (!client) {
    const list = await readLocalAppointments();
    list.unshift(newRecord);
    await writeLocalAppointments(list);
    return newRecord;
  }

  const { error } = await client.from(APPOINTMENTS_TABLE).insert(appointmentToRow(newRecord));
  if (error) throw new Error('Nu s-a putut salva programarea.');
  return newRecord;
}

export async function updateAppointmentStatus(id: string, status: AppointmentRecord['status']): Promise<boolean> {
  if (!APPOINTMENT_STATUSES.includes(status as AppointmentState)) return false;
  const client = getSupabaseClient();

  if (!client) {
    const list = await readLocalAppointments();
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    list[idx].status = status;
    list[idx].updatedAt = new Date().toISOString();
    await writeLocalAppointments(list);
    return true;
  }

  const { data, error } = await client
    .from(APPOINTMENTS_TABLE)
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id');

  return !error && (data ?? []).length > 0;
}

export async function proposeAppointmentReschedule(id: string, proposedDate: string, proposedTime: string, proposalMessage?: string): Promise<boolean> {
  const client = getSupabaseClient();

  if (!client) {
    const list = await readLocalAppointments();
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    list[idx].status = 'reprogramare';
    list[idx].proposedDate = proposedDate;
    list[idx].proposedTime = proposedTime;
    list[idx].proposalMessage = proposalMessage || '';
    list[idx].updatedAt = new Date().toISOString();
    await writeLocalAppointments(list);
    return true;
  }

  const { data, error } = await client
    .from(APPOINTMENTS_TABLE)
    .update({
      status: 'reprogramare',
      proposed_date: proposedDate,
      proposed_time: proposedTime,
      proposal_message: proposalMessage || '',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('id');

  return !error && (data ?? []).length > 0;
}

export async function confirmAppointment(id: string): Promise<boolean> {
  const client = getSupabaseClient();

  if (!client) {
    const list = await readLocalAppointments();
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    const appointment = list[idx];
    if (appointment.status === 'reprogramare' && appointment.proposedDate && appointment.proposedTime) {
      appointment.date = appointment.proposedDate;
      appointment.time = appointment.proposedTime;
    }
    appointment.status = 'confirmata';
    appointment.proposedDate = undefined;
    appointment.proposedTime = undefined;
    appointment.proposalMessage = undefined;
    appointment.updatedAt = new Date().toISOString();
    await writeLocalAppointments(list);
    return true;
  }

  const { data, error } = await client.from(APPOINTMENTS_TABLE).select('*').eq('id', id).maybeSingle();
  if (error || !data) return false;

  const row = data as AppointmentRow;
  let date = row.date;
  let time = row.time;

  if (row.status === 'reprogramare' && row.proposed_date && row.proposed_time) {
    date = row.proposed_date;
    time = row.proposed_time;
  }

  const { error: updateError } = await client
    .from(APPOINTMENTS_TABLE)
    .update({
      status: 'confirmata',
      date,
      time,
      proposed_date: null,
      proposed_time: null,
      proposal_message: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  return !updateError;
}

export async function confirmByClient(id: string): Promise<boolean> {
  return confirmAppointment(id);
}

export async function cancelAppointment(id: string): Promise<boolean> {
  return updateAppointmentStatus(id, 'anulata');
}

export async function deleteAppointment(id: string): Promise<boolean> {
  const client = getSupabaseClient();

  if (!client) {
    const list = await readLocalAppointments();
    const filtered = list.filter((a) => a.id !== id);
    if (filtered.length === list.length) return false;
    await writeLocalAppointments(filtered);
    return true;
  }

  const { data, error } = await client.from(APPOINTMENTS_TABLE).delete().eq('id', id).select('id');
  return !error && (data ?? []).length > 0;
}