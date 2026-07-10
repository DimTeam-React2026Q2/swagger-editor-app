-- ============================================================================
-- request history & analytics — run this in Supabase (SQL Editor) once.
-- ============================================================================

create table if not exists public.request_history (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users (id) on delete cascade,
  method        text        not null,
  url           text        not null,
  endpoint      text,
  status_code   integer     not null,
  duration_ms   integer     not null default 0,
  request_size  integer     not null default 0,
  response_size integer     not null default 0,
  error         text,
  created_at    timestamptz not null default now()
);

-- Index for the "most recent first" listing per user.
create index if not exists request_history_user_created_idx
  on public.request_history (user_id, created_at desc);

-- Row Level Security: each user only sees/writes their own rows.
alter table public.request_history enable row level security;

create policy "select own history"
  on public.request_history for select
  using (auth.uid() = user_id);

create policy "insert own history"
  on public.request_history for insert
  with check (auth.uid() = user_id);
