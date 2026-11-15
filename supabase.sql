
create extension if not exists pgcrypto;

create table if not exists public.leagues (
  id bigint generated always as identity primary key,
  name text not null unique,
  created_at timestamptz default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'viewer'
    check (role in ('super_admin','league_admin','viewer')),
  league_id bigint references public.leagues(id),
  created_at timestamptz default now(),
  check (
    (role = 'league_admin' and league_id is not null)
    or role <> 'league_admin'
  )
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  league_id bigint not null references public.leagues(id),
  rating numeric not null default 0,
  created_at timestamptz default now(),
  unique(name, league_id)
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  full_name text not null,
  shirt_number integer,
  created_at timestamptz default now()
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  league_id bigint not null references public.leagues(id),
  home_team_id uuid not null references public.teams(id),
  away_team_id uuid not null references public.teams(id),
  kickoff timestamptz,
  home_score integer,
  away_score integer,
  status text not null default 'upcoming'
    check (status in ('upcoming','live','finished')),
  minute integer,
  created_by uuid references auth.users(id),
  updated_at timestamptz default now(),
  check (home_team_id <> away_team_id),
  check (home_score is null or home_score >= 0),
  check (away_score is null or away_score >= 0)
);

create table if not exists public.match_events (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  player_id uuid references public.players(id),
  event_type text not null
    check (event_type in ('goal','yellow_card','red_card')),
  minute integer,
  created_at timestamptz default now()
);

create table if not exists public.rating_history (
  id bigint generated always as identity primary key,
  team_id uuid not null references public.teams(id),
  match_id uuid references public.matches(id),
  old_rating numeric not null,
  new_rating numeric not null,
  created_at timestamptz default now()
);

create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id),
  action text not null,
  table_name text not null,
  record_id text,
  created_at timestamptz default now()
);

insert into public.leagues(name) values
('Лигаи дуюми шаҳрак'),
('Деҳшарқ'),
('Деҳшимол'),
('Деҳҷануб'),
('Деҳғарб'),
('Лигаи олии шаҳрак')
on conflict (name) do nothing;

alter table public.profiles enable row level security;
alter table public.leagues enable row level security;
alter table public.teams enable row level security;
alter table public.players enable row level security;
alter table public.matches enable row level security;
alter table public.match_events enable row level security;
alter table public.rating_history enable row level security;
alter table public.audit_log enable row level security;

create or replace function public.my_role()
returns text
language sql stable security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.my_league()
returns bigint
language sql stable security definer
set search_path = public
as $$
  select league_id from public.profiles where id = auth.uid()
$$;

create policy "Read leagues"
on public.leagues for select
using (true);

create policy "Read profiles"
on public.profiles for select
using (id = auth.uid() or public.my_role() = 'super_admin');

create policy "Read teams"
on public.teams for select
using (true);

create policy "Admins add teams"
on public.teams for insert
with check (
  public.my_role() = 'super_admin'
  or (public.my_role() = 'league_admin' and league_id = public.my_league())
);

create policy "Admins update teams"
on public.teams for update
using (
  public.my_role() = 'super_admin'
  or (public.my_role() = 'league_admin' and league_id = public.my_league())
)
with check (
  public.my_role() = 'super_admin'
  or (public.my_role() = 'league_admin' and league_id = public.my_league())
);

create policy "Read players"
on public.players for select using (true);

create policy "Admins add players"
on public.players for insert
with check (
  public.my_role() = 'super_admin'
  or (
    public.my_role() = 'league_admin'
    and exists (
      select 1 from public.teams t
      where t.id = team_id and t.league_id = public.my_league()
    )
  )
);

create policy "Read matches"
on public.matches for select using (true);

create policy "Admins add matches"
on public.matches for insert
with check (
  public.my_role() = 'super_admin'
  or (
    public.my_role() = 'league_admin'
    and league_id = public.my_league()
  )
);

create policy "Admins update matches"
on public.matches for update
using (
  public.my_role() = 'super_admin'
  or (public.my_role() = 'league_admin' and league_id = public.my_league())
)
with check (
  public.my_role() = 'super_admin'
  or (public.my_role() = 'league_admin' and league_id = public.my_league())
);

create policy "Read match events"
on public.match_events for select using (true);

create policy "Admins add match events"
on public.match_events for insert
with check (
  public.my_role() = 'super_admin'
  or (
    public.my_role() = 'league_admin'
    and exists (
      select 1
      from public.matches m
      where m.id = match_id and m.league_id = public.my_league()
    )
  )
);

create policy "Read rating history"
on public.rating_history for select using (true);

create policy "Read audit log"
on public.audit_log for select
using (public.my_role() = 'super_admin');
