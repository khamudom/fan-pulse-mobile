-- FanPulse retention schema

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  favorite_country text,
  secondary_country text,
  favorite_player_ids text[] default '{}',
  onboarding_complete boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User stats (points, level, streak)
create table if not exists public.user_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  points integer default 0 not null,
  level integer default 1 not null,
  current_streak integer default 0 not null,
  last_check_in date,
  prediction_accuracy numeric(5,2) default 0 not null,
  updated_at timestamptz default now()
);

-- Predictions
create table if not exists public.predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  match_id text not null,
  predicted_home integer not null,
  predicted_away integer not null,
  resolved boolean default false,
  correct boolean,
  created_at timestamptz default now(),
  unique (user_id, match_id)
);

-- Point events ledger
create table if not exists public.point_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  points integer not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- Daily challenges
create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  points integer not null default 50,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.challenge_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  completed_date date not null,
  created_at timestamptz default now(),
  unique (user_id, challenge_id, completed_date)
);

-- Cached daily briefings
create table if not exists public.daily_briefings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  briefing_date date not null,
  content text not null,
  created_at timestamptz default now(),
  unique (user_id, briefing_date)
);

-- Auto-create profile + stats on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));

  insert into public.user_stats (user_id)
  values (new.id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Seed default daily challenges
insert into public.challenges (slug, title, description, points) values
  ('daily-check-in', 'Daily Check-in', 'Open FanPulse today and check in.', 10),
  ('predict-today', 'Predict Today''s Matches', 'Submit predictions for all of today''s matches.', 50),
  ('read-briefing', 'Read Morning Briefing', 'Read your personalized World Cup briefing.', 15)
on conflict (slug) do nothing;

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.user_stats enable row level security;
alter table public.predictions enable row level security;
alter table public.point_events enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_completions enable row level security;
alter table public.daily_briefings enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- User stats policies
create policy "Users can view own stats" on public.user_stats for select using (auth.uid() = user_id);
create policy "Users can update own stats" on public.user_stats for update using (auth.uid() = user_id);
create policy "Users can insert own stats" on public.user_stats for insert with check (auth.uid() = user_id);

-- Predictions policies
create policy "Users can view own predictions" on public.predictions for select using (auth.uid() = user_id);
create policy "Users can insert own predictions" on public.predictions for insert with check (auth.uid() = user_id);
create policy "Users can update own predictions" on public.predictions for update using (auth.uid() = user_id);

-- Point events policies
create policy "Users can view own point events" on public.point_events for select using (auth.uid() = user_id);
create policy "Users can insert own point events" on public.point_events for insert with check (auth.uid() = user_id);

-- Challenges (public read)
create policy "Anyone can view active challenges" on public.challenges for select using (active = true);

-- Challenge completions
create policy "Users can view own completions" on public.challenge_completions for select using (auth.uid() = user_id);
create policy "Users can insert own completions" on public.challenge_completions for insert with check (auth.uid() = user_id);

-- Daily briefings
create policy "Users can view own briefings" on public.daily_briefings for select using (auth.uid() = user_id);
create policy "Users can insert own briefings" on public.daily_briefings for insert with check (auth.uid() = user_id);

-- Indexes
create index if not exists idx_predictions_user_id on public.predictions(user_id);
create index if not exists idx_point_events_user_id on public.point_events(user_id);
create index if not exists idx_daily_briefings_user_date on public.daily_briefings(user_id, briefing_date);
