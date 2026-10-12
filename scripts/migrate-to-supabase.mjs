#!/usr/bin/env node
// =============================================================================
// MST Service — migrare a datelor existente din data/appointments.json în Supabase
// -----------------------------------------------------------------------------
// Cum se folosește:
//   1. Creează tabelul `appointments` rulând supabase/schema.sql în Supabase.
//   2. Completează SUPABASE_URL și SUPABASE_SERVICE_ROLE_KEY în .env.local.
//   3. Rulează:   node scripts/migrate-to-supabase.mjs
//
// Scriptul citește data/appointments.json, transformă câmpurile din camelCase
// în snake_case și le inserează în tabelul `appointments`. Dacă un ID există
// deja, rândul se actualizează (upsert pe coloana id).
// =============================================================================

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, '..', 'data', 'appointments.json');

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    '[migrate] Lipsește SUPABASE_URL sau SUPABASE_SERVICE_ROLE_KEY. ' +
    'Verifică .env.local (vezi SUPABASE.md).'
  );
  process.exit(1);
}

if (!existsSync(DB_FILE)) {
  console.error(`[migrate] Nu am găsit fișierul: ${DB_FILE}`);
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Transformă un obiect appointments.json în rândul de tabel (snake_case).
function toRow(appointment) {
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

async function main() {
  const raw = readFileSync(DB_FILE, 'utf-8');
  const appointments = JSON.parse(raw);

  if (!Array.isArray(appointments) || appointments.length === 0) {
    console.log('[migrate] Nu există programări de migrat (lista e goală).');
    return;
  }

  const rows = appointments.map(toRow);

  const { data, error } = await supabase
    .from('appointments')
    .upsert(rows, { onConflict: 'id' });

  if (error) {
    console.error('[migrate] Eroare la migrare:', error.message);
    process.exit(1);
  }

  console.log(
    `[migrate] Migrare finalizată cu succes: ${rows.length} programări importate în Supabase.`
  );
}

main().catch((err) => {
  console.error('[migrate] Eroare neașteptată:', err);
  process.exit(1);
});
