-- Run this in the Supabase SQL editor to enable real progress tracking.

create table if not exists practical_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null,
  reflection text not null default '',
  completed_at timestamptz not null default now(),
  unique (user_id, slug)
);

alter table practical_progress enable row level security;

create policy "Students can read their own progress"
  on practical_progress for select
  using (auth.uid() = user_id);

create policy "Students can upsert their own progress"
  on practical_progress for insert
  with check (auth.uid() = user_id);

create policy "Students can update their own progress"
  on practical_progress for update
  using (auth.uid() = user_id);

