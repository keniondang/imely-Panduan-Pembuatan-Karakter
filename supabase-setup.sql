-- ============================================================
-- Imely "Belajar Buat Karakter" — Supabase setup
-- Paste this whole file into: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- 1) Table -----------------------------------------------------
create table if not exists public.characters (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  name        text,
  score       jsonb,          -- { "ok": 13, "total": 13 }
  values      jsonb,          -- the whole form object (name, tagline, kepribadian, ...)
  created_at  timestamptz not null default now()
);

create index if not exists characters_user_id_idx on public.characters (user_id);

-- 2) Row Level Security ---------------------------------------
-- Without this, ANY user could read/write everyone's rows. Do not skip.
alter table public.characters enable row level security;

-- Each policy is scoped to the logged-in user (auth.uid()).
drop policy if exists "own_select" on public.characters;
create policy "own_select" on public.characters
  for select using (auth.uid() = user_id);

drop policy if exists "own_insert" on public.characters;
create policy "own_insert" on public.characters
  for insert with check (auth.uid() = user_id);

drop policy if exists "own_update" on public.characters;
create policy "own_update" on public.characters
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own_delete" on public.characters;
create policy "own_delete" on public.characters
  for delete using (auth.uid() = user_id);

-- Done. Table is private per-user and ready for the app.
