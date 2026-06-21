-- Let users with a pending friend request (in either direction) read each
-- other's profile. Without this, a pending requester/addressee falls outside
-- the "own profile" and "accepted friends" policies, so their name renders as
-- "Fan" in the Sent and Incoming request lists.

create or replace function public.has_pending_connection(a uuid, b uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.connections c
    where c.status = 'pending'
      and (
        (c.requester_id = a and c.addressee_id = b)
        or (c.requester_id = b and c.addressee_id = a)
      )
  );
$$;

drop policy if exists "Pending connections can view profiles" on public.profiles;

create policy "Pending connections can view profiles"
  on public.profiles for select
  using (public.has_pending_connection(auth.uid(), id));
