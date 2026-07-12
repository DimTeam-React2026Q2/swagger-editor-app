-- ============================================================================
-- Schema save/restore — run this in Supabase (SQL Editor) once.
-- ============================================================================

-- One saved schema per user.
create table if not exists public.schemas (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  content    text        not null,
  format     text        not null default 'json',
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security so users can only touch their own row.
alter table public.schemas enable row level security;

-- SELECT own row.
create policy "select own schema"
  on public.schemas for select
  using (auth.uid() = user_id);

-- INSERT own row.
create policy "insert own schema"
  on public.schemas for insert
  with check (auth.uid() = user_id);

-- UPDATE own row (upsert path).
create policy "update own schema"
  on public.schemas for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
