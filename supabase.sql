-- VARZID SCORE
-- Permission policies update

alter table public.teams enable row level security;
alter table public.matches enable row level security;
alter table public.profiles enable row level security;

create or replace function public.current_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role
  from public.profiles
  where id = auth.uid()
  limit 1;
$$;

create or replace function public.current_league()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select league_id
  from public.profiles
  where id = auth.uid()
  limit 1;
$$;

-- Teams policies
drop policy if exists "teams_read" on public.teams;
drop policy if exists "teams_insert" on public.teams;
drop policy if exists "teams_update" on public.teams;
drop policy if exists "teams_delete" on public.teams;

create policy "teams_read"
on public.teams
for select
using (true);

create policy "teams_insert"
on public.teams
for insert
to authenticated
with check (
  public.current_role() = 'super_admin'
  or (
    public.current_role() = 'league_admin'
    and league = public.current_league()
  )
);

create policy "teams_update"
on public.teams
for update
to authenticated
using (
  public.current_role() = 'super_admin'
  or (
    public.current_role() = 'league_admin'
    and league = public.current_league()
  )
)
with check (
  public.current_role() = 'super_admin'
  or (
    public.current_role() = 'league_admin'
    and league = public.current_league()
  )
);

create policy "teams_delete"
on public.teams
for delete
to authenticated
using (
  public.current_role() = 'super_admin'
  or (
    public.current_role() = 'league_admin'
    and league = public.current_league()
  )
);

-- Matches policies
drop policy if exists "matches_read" on public.matches;
drop policy if exists "matches_insert" on public.matches;
drop policy if exists "matches_update" on public.matches;
drop policy if exists "matches_delete" on public.matches;

create policy "matches_read"
on public.matches
for select
using (true);

create policy "matches_insert"
on public.matches
for insert
to authenticated
with check (
  public.current_role() = 'super_admin'
  or (
    public.current_role() = 'league_admin'
    and league = public.current_league()
  )
);

create policy "matches_update"
on public.matches
for update
to authenticated
using (
  public.current_role() = 'super_admin'
  or (
    public.current_role() = 'league_admin'
    and league = public.current_league()
  )
)
with check (
  public.current_role() = 'super_admin'
  or (
    public.current_role() = 'league_admin'
    and league = public.current_league()
  )
);

create policy "matches_delete"
on public.matches
for delete
to authenticated
using (
  public.current_role() = 'super_admin'
);

-- Profiles: users can read their own profile.
drop policy if exists "profiles_read" on public.profiles;

create policy "profiles_read"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or public.current_role() = 'super_admin'
);
