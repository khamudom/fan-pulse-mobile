-- FanPulse social: friends, invites, activity feed

-- Username for discovery (display_name remains for show)
alter table public.profiles add column if not exists username text;
create unique index if not exists idx_profiles_username_lower
  on public.profiles (lower(username))
  where username is not null;

-- Friend connections
create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  addressee_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  check (requester_id <> addressee_id),
  unique (requester_id, addressee_id)
);

-- Shareable invite links
create table if not exists public.connection_invites (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- Activity feed events
create table if not exists public.activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('nation', 'bracket', 'prediction')),
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- Helper: are two users accepted friends?
create or replace function public.are_friends(a uuid, b uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.connections c
    where c.status = 'accepted'
      and (
        (c.requester_id = a and c.addressee_id = b)
        or (c.requester_id = b and c.addressee_id = a)
      )
  );
$$;

-- Safe profile search (no email or private fields)
create or replace function public.search_profiles(q text)
returns table (
  id uuid,
  username text,
  display_name text,
  favorite_country text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.id,
    p.username,
    p.display_name,
    p.favorite_country
  from public.profiles p
  where length(trim(q)) >= 2
    and (
      lower(coalesce(p.username, '')) like lower(trim(q)) || '%'
      or lower(coalesce(p.display_name, '')) like lower(trim(q)) || '%'
    )
    and (
      p.username is not null
      or coalesce(p.display_name, '') <> ''
    )
  order by
    case when lower(coalesce(p.username, '')) = lower(trim(q)) then 0 else 1 end,
    case when lower(coalesce(p.display_name, '')) = lower(trim(q)) then 0 else 1 end,
    p.username nulls last,
    p.display_name
  limit 20;
$$;

-- Redeem invite link and auto-connect
create or replace function public.redeem_invite(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_invite record;
  v_owner_id uuid;
begin
  if v_user_id is null then
    return jsonb_build_object('error', 'Not signed in.');
  end if;

  select * into v_invite
  from public.connection_invites
  where code = trim(p_code);

  if not found then
    return jsonb_build_object('error', 'Invite not found.');
  end if;

  if v_invite.expires_at is not null and v_invite.expires_at < now() then
    return jsonb_build_object('error', 'Invite expired.');
  end if;

  v_owner_id := v_invite.owner_id;

  if v_owner_id = v_user_id then
    return jsonb_build_object('error', 'You cannot connect with yourself.');
  end if;

  insert into public.connections (requester_id, addressee_id, status, updated_at)
  values (v_owner_id, v_user_id, 'accepted', now())
  on conflict (requester_id, addressee_id) do update
    set status = 'accepted', updated_at = now();

  return jsonb_build_object('success', true, 'owner_id', v_owner_id);
end;
$$;

-- Row Level Security
alter table public.connections enable row level security;
alter table public.connection_invites enable row level security;
alter table public.activity_events enable row level security;

-- Profiles: friends can view each other
create policy "Friends can view profiles"
  on public.profiles for select
  using (auth.uid() = id or public.are_friends(auth.uid(), id));

-- User stats: friends can view each other
create policy "Friends can view stats"
  on public.user_stats for select
  using (auth.uid() = user_id or public.are_friends(auth.uid(), user_id));

-- Predictions: friends can view each other
create policy "Friends can view predictions"
  on public.predictions for select
  using (auth.uid() = user_id or public.are_friends(auth.uid(), user_id));

-- Bracket predictions: friends can view each other
create policy "Friends can view bracket predictions"
  on public.bracket_predictions for select
  using (auth.uid() = user_id or public.are_friends(auth.uid(), user_id));

-- Connections policies
create policy "Users can view own connections"
  on public.connections for select
  using (auth.uid() in (requester_id, addressee_id));

create policy "Users can send friend requests"
  on public.connections for insert
  with check (auth.uid() = requester_id);

create policy "Users can update own connections"
  on public.connections for update
  using (auth.uid() in (requester_id, addressee_id));

create policy "Users can delete own connections"
  on public.connections for delete
  using (auth.uid() in (requester_id, addressee_id));

-- Connection invites policies
create policy "Users can view own invites"
  on public.connection_invites for select
  using (auth.uid() = owner_id);

create policy "Users can create invites"
  on public.connection_invites for insert
  with check (auth.uid() = owner_id);

create policy "Users can delete own invites"
  on public.connection_invites for delete
  using (auth.uid() = owner_id);

-- Activity events policies
create policy "Users can view own activity"
  on public.activity_events for select
  using (auth.uid() = user_id);

create policy "Friends can view activity"
  on public.activity_events for select
  using (public.are_friends(auth.uid(), user_id));

create policy "Users can insert own activity"
  on public.activity_events for insert
  with check (auth.uid() = user_id);

-- Indexes
create index if not exists idx_connections_requester on public.connections(requester_id);
create index if not exists idx_connections_addressee on public.connections(addressee_id);
create index if not exists idx_connections_status on public.connections(status);
create index if not exists idx_connection_invites_owner on public.connection_invites(owner_id);
create index if not exists idx_activity_events_user on public.activity_events(user_id);
create index if not exists idx_activity_events_created on public.activity_events(created_at desc);
