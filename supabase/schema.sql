-- =============================================================================
-- MST Service — schema pentru tabelul `appointments`
-- -----------------------------------------------------------------------------
-- Rulează acest script în Supabase:
--   Dashboard -> SQL Editor -> New query -> Paste -> Run
--
-- Creează tabelul `appointments`, index-ul pe created_at și o politică RLS
-- simplă (doar citire/scriere din aplicație; opțional, poți dezactiva RLS
-- dacă folosești doar Service Role Key).
-- =============================================================================

create table if not exists public.appointments (
  id text primary key,
  service text not null,
  car_model text not null,
  car_year text not null default '',
  date text not null,
  time text not null,
  name text not null,
  phone text not null,
  notes text,
  status text not null default 'noua',
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  proposed_date text,
  proposed_time text,
  proposal_message text
);

-- Index pentru ordonarea listelor (cele mai noi primele).
create index if not exists idx_appointments_created_at
  on public.appointments (created_at desc);

-- -----------------------------------------------------------------------------
-- Row Level Security (opțional dar recomandat)
-- -----------------------------------------------------------------------------
-- Notă: aplicația folosește Service Role Key, care ocolește RLS. Dacă vrei să
-- folosești cheia publică (anon), activează RLS și adaugă politici aici.
-- Pentru început simplu, dezactivăm RLS:
alter table public.appointments disable row level security;

-- =============================================================================
-- MST Service — schema pentru tabelul `cars` (mașini de vânzare)
-- =============================================================================

create table if not exists public.cars (
  id text primary key,
  make text not null,
  model text not null,
  year int not null,
  price numeric not null,
  mileage int not null default 0,
  fuel text not null default '-',
  transmission text not null default '-',
  color text,
  description text,
  images jsonb not null default '[]'::jsonb,
  status text not null default 'disponibil',
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create index if not exists idx_cars_created_at
  on public.cars (created_at desc);

alter table public.cars disable row level security;

-- Specificații extinse (rulează și dacă tabelul `cars` există deja)
alter table public.cars add column if not exists has_vin boolean not null default false;
alter table public.cars add column if not exists power int not null default 0;
alter table public.cars add column if not exists engine_capacity int not null default 0;
alter table public.cars add column if not exists doors int not null default 5;
alter table public.cars add column if not exists seats int not null default 5;
alter table public.cars add column if not exists paint_type text;
alter table public.cars add column if not exists first_registration text;
alter table public.cars add column if not exists condition text not null default 'utilizat';
alter table public.cars add column if not exists features jsonb not null default '[]'::jsonb;
