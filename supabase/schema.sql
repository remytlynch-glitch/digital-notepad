-- Private cloud sync for Bench Chemistry Keyboard.
-- No email account is required. Each page is protected by a 256-bit sync key
-- that the app sends in X-Bench-Key; the database stores only its SHA-256 hash.

create schema if not exists private;

create table if not exists public.chemistry_cloud_pages (
  id uuid primary key default gen_random_uuid(),
  key_hash text not null unique check (key_hash ~ '^[0-9a-f]{64}$'),
  notebook_html text not null default '' check (char_length(notebook_html) <= 200000),
  work_steps jsonb not null default '[]'::jsonb,
  entries jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.chemistry_cloud_pages enable row level security;
revoke all on table public.chemistry_cloud_pages from anon, authenticated;
grant select, insert, update, delete on table public.chemistry_cloud_pages to anon;

create or replace function private.chemistry_request_key_hash()
returns text
language sql
stable
set search_path = ''
as $$
  select encode(
    extensions.digest(
      coalesce((current_setting('request.headers', true)::jsonb ->> 'x-bench-key'), ''),
      'sha256'
    ),
    'hex'
  );
$$;

revoke all on function private.chemistry_request_key_hash() from public;
grant usage on schema private to anon;
grant execute on function private.chemistry_request_key_hash() to anon;

create policy "Chemistry page read with sync key"
on public.chemistry_cloud_pages for select to anon
using (key_hash = (select private.chemistry_request_key_hash()));

create policy "Chemistry page create with sync key"
on public.chemistry_cloud_pages for insert to anon
with check (key_hash = (select private.chemistry_request_key_hash()));

create policy "Chemistry page update with sync key"
on public.chemistry_cloud_pages for update to anon
using (key_hash = (select private.chemistry_request_key_hash()))
with check (key_hash = (select private.chemistry_request_key_hash()));

create policy "Chemistry page delete with sync key"
on public.chemistry_cloud_pages for delete to anon
using (key_hash = (select private.chemistry_request_key_hash()));
