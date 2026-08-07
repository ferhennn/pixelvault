-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.screenshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  title text not null,
  storage_path text not null,
  category text not null check (
    category in (
      'Code', 'Design', 'Errors', 'Documents',
      'Receipts', 'Ideas', 'AI', 'UI Inspiration'
    )
  ),
  tags text[] not null default '{}',
  width int not null,
  height int not null,
  created_at timestamptz not null default now()
);

create index if not exists screenshots_user_id_created_at_idx
  on public.screenshots (user_id, created_at desc);
create index if not exists screenshots_project_id_created_at_idx
  on public.screenshots (project_id, created_at desc);
create index if not exists projects_user_id_updated_at_idx
  on public.projects (user_id, updated_at desc);

alter table public.projects enable row level security;
alter table public.screenshots enable row level security;

create policy "Users manage their own projects"
  on public.projects for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users manage their own screenshots"
  on public.screenshots for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Storage: private bucket, one folder per user (folder name = user id).
insert into storage.buckets (id, name, public)
values ('screenshots', 'screenshots', false)
on conflict (id) do nothing;

create policy "Users manage their own screenshot files"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'screenshots'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  )
  with check (
    bucket_id = 'screenshots'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );
