-- Allow fan search by display name even when username is not set yet

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
