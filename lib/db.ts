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
  /** Ultima dată la care statusul a fost modificat. Setat automat. */
  updatedAt?: string;
  proposedDate?: string;
  proposedTime?: string;
  proposalMessage?: string;
};

// ===========================================================================
// Supabase (bază de date cloud, gratuită)
// ---------------------------------------------------------------------------
// Toate funcțiile din acest fișier citesc/scriu într-un tabel `appointments`
// din proiectul Supabase. Dacă variabilele de mediu lipsesc (dezvoltare locală
// fără configurare), se folosește automat fișierul `data/appointments.json`
// ca fallback, astfel încât aplicația continuă să funcționeze normal.
// ===========================================================================

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  '';

const APPOINTMENTS_TABLE = 'appointments';

let supabaseClient: SupabaseClient | null = null;
let warnedMissingConfig = false;

function getSupabaseClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    if (!warnedMissingConfig) {
      console.warn(
        '[db] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY lipsesc. Se folosește data/appointments.json (fallback local, doar pentru dezvoltare).'
      );
      warnedMissingConfig = true;
    }
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return supabaseClient;
}

// Structura unui rând în tabelul Supabase (coloane snake_case).
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
};

function rowToAppointment(row: AppointmentRow): AppointmentRecord {
  return {
    id: row.id,
    service: row.service,
    carModel: row.car_model,
    carYear: row.car_year,
    date: row.date,
    time: row.time,
    name: row.name,
    phone: row.phone,
    notes: row.notes ?? undefined,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
    proposedDate: row.proposed_date ?? undefined,
    proposedTime: row.proposed_time ?? undefined,
    proposalMessage: row.proposal_message ?? undefined,
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

// ===========================================================================
// Fallback local (doar pentru dezvoltare, când Supabase nu e configurat)
// ===========================================================================
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

// ===========================================================================
// Operațiuni CRUD
// ===========================================================================

export async function getAppointments(): Promise<AppointmentRecord[]> {
  const client = getSupabaseClient();

  if (!client) {
    return readLocalAppointments();
  }

  const { data, error } = await client
    .from(APPOINTMENTS_TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[db] Supabase: eroare la citirea programărilor:', error.message);
    return [];
  }

  return (data ?? []).map((row) => rowToAppointment(row as AppointmentRow));
}

export async function saveAppointment(
  appointment: Omit<AppointmentRecord, 'id' | 'status' | 'createdAt'>
): Promise<AppointmentRecord> {
  const client = getSupabaseClient();

  const newRecord: AppointmentRecord = {
    ...appointment,
    id: 'mst-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
    status: 'noua',
    createdAt: new Date().toISOString(),
  };

  if (!client) {
    const list = await readLocalAppointments();
    list.unshift(newRecord); // newest first
    await writeLocalAppointments(list);
    return newRecord;
  }

  const { error } = await client
    .from(APPOINTMENTS_TABLE)
    .insert(appointmentToRow(newRecord));

  if (error) {
    console.error('[db] Supabase: eroare la salvarea programării:', error.message);
    throw new Error('Nu s-a putut salva programarea.');
  }

  return newRecord;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentRecord['status']
): Promise<boolean> {
  // Validare defensivă: acceptăm doar statusuri din catalogul oficial.
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

  if (error) {
    console.error('[db] Supabase: eroare la actualizarea statusului:', error.message);
    return false;
  }

  return (data ?? []).length > 0;
}

export async function proposeAppointmentReschedule(
  id: string,
  proposedDate: string,
  proposedTime: string,
  proposalMessage?: string
): Promise<boolean> {
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

  if (error) {
    console.error('[db] Supabase: eroare la propunerea reprogramării:', error.message);
    return false;
  }

  return (data ?? []).length > 0;
}

export async function confirmAppointment(id: string): Promise<boolean> {
  const client = getSupabaseClient();

  if (!client) {
    const list = await readLocalAppointments();
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return false;

    const appointment = list[idx];

    // Dacă clientul confirmă o reprogramare propusă de admin,
    // preluăm oficial data și ora propuse.
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

  const { data, error } = await client
    .from(APPOINTMENTS_TABLE)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return false;

  const row = data as AppointmentRow;
  let date = row.date;
  let time = row.time;

  // Dacă clientul confirmă o reprogramare propusă de admin,
  // preluăm oficial data și ora propuse.
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

  if (updateError) {
    console.error('[db] Supabase: eroare la confirmarea programării:', updateError.message);
    return false;
  }

  return true;
}

// Confirmă programarea din partea clientului (ex: acceptă ora curentă
// sau confirmă o reprogramare propusă de admin).
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

  const { data, error } = await client
    .from(APPOINTMENTS_TABLE)
    .delete()
    .eq('id', id)
    .select('id');

  if (error) {
    console.error('[db] Supabase: eroare la ștergerea programării:', error.message);
    return false;
  }

  return (data ?? []).length > 0;
}
