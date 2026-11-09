-- Day Board schema. Run in the Supabase SQL editor.
-- Identity is the Google account id (NextAuth `token.sub`), not Supabase Auth, so these
-- tables have no RLS policies — every query goes through the server using the service-role
-- key, scoped by user_id in application code (see lib/supabase.ts).

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text not null,
  category text not null default 'Personal',
  starred boolean not null default false,
  due_date date not null default current_date,
  done_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists briefs (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  date date not null,
  content_md text not null,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

create index if not exists tasks_user_due_idx on tasks (user_id, due_date);
