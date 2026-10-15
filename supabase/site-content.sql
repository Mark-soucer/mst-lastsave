-- =============================================================================
-- MST Service — tabel pentru conținutul editabil al site-ului
-- Rulează în Supabase: SQL Editor -> New query -> Paste -> Run
-- Fiecare secțiune editabilă e o linie: key (ex: 'home') + value (JSON).
-- =============================================================================
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content disable row level security;
