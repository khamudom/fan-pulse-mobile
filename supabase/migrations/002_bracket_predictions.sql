-- Bracket predictions (full tournament path)

create table if not exists public.bracket_predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id)
);

alter table public.bracket_predictions enable row level security;

create policy "Users can view own bracket predictions"
  on public.bracket_predictions for select
  using (auth.uid() = user_id);

create policy "Users can insert own bracket predictions"
  on public.bracket_predictions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own bracket predictions"
  on public.bracket_predictions for update
  using (auth.uid() = user_id);

create index if not exists idx_bracket_predictions_user_id
  on public.bracket_predictions(user_id);
