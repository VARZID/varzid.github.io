
-- VARZID SCORE: ибтидои сохтори база.
-- Пеш аз истифодаи оммавӣ амниятро санҷед.

create extension if not exists pgcrypto;

create table if not exists public.leagues(
id text primary key,
name_ru text not null,
name_tg text not null,
category text not null check(category in('featured','rural')),
sort_order int not null
);

insert into public.leagues values
('top','Группа высшего Фархора','Гурӯҳи олии Фархор','featured',1),
('town','Группа шаҳрак','Гурӯҳи шаҳрак','featured',2),
('east','Группа Деҳ Шарқ','Гурӯҳи Деҳ Шарқ','rural',3),
('west','Группа Деҳ Ғарб','Гурӯҳи Деҳ Ғарб','rural',4),
('north','Группа Деҳ Шимол','Гурӯҳи Деҳ Шимол','rural',5),
('south','Группа Деҳ Ҷануб','Гурӯҳи Деҳ Ҷануб','rural',6)
on conflict(id) do nothing;

create table if not exists public.profiles(
id uuid primary key references auth.users(id) on delete cascade,
full_name text not null,
role text not null check(role in('super_admin','league_admin')),
league_id text references public.leagues(id),
check(
(role='super_admin' and league_id is null)
or
(role='league_admin' and league_id is not null)
)
);

create table if not exists public.teams(
id uuid primary key default gen_random_uuid(),
name text not null,
league_id text not null references public.leagues(id),
permanent_rating numeric not null default 0,
created_at timestamptz default now(),
unique(name,league_id)
);

create table if not exists public.players(
id uuid primary key default gen_random_uuid(),
team_id uuid not null references public.teams(id) on delete cascade,
full_name text not null,
shirt_number int
);

create table if not exists public.matches(
id uuid primary key default gen_random_uuid(),
league_id text not null references public.leagues(id),
home_team_id uuid not null references public.teams(id),
away_team_id uuid not null references public.teams(id),
kickoff timestamptz,
home_score int,
away_score int,
status text not null default 'upcoming'
check(status in('upcoming','live','finished')),
created_by uuid references auth.users(id),
approved_by uuid references auth.users(id),
approved_at timestamptz,
check(home_team_id<>away_team_id),
check(home_score is null or home_score>=0),
check(away_score is null or away_score>=0)
);

create table if not exists public.rating_history(
id bigint generated always as identity primary key,
team_id uuid not null references public.teams(id),
match_id uuid not null references public.matches(id),
old_rating numeric not null,
new_rating numeric not null,
created_at timestamptz default now(),
unique(team_id,match_id)
);

create table if not exists public.match_events(
id uuid primary key default gen_random_uuid(),
match_id uuid not null references public.matches(id) on delete cascade,
player_id uuid references public.players(id),
event_type text not null
check(event_type in('goal','yellow_card','red_card')),
minute int
);

create or replace function public.current_role()
returns text
language sql stable security definer
set search_path=public
as $$
select role from public.profiles where id=auth.uid()
$$;

create or replace function public.current_league()
returns text
language sql stable security definer
set search_path=public
as $$
select league_id from public.profiles where id=auth.uid()
$$;

alter table public.leagues enable row level security;
alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.players enable row level security;
alter table public.matches enable row level security;
alter table public.rating_history enable row level security;
alter table public.match_events enable row level security;

create policy "public read leagues"
on public.leagues for select using(true);

create policy "public read teams"
on public.teams for select using(true);

create policy "public read matches"
on public.matches for select using(true);

create policy "public read players"
on public.players for select using(true);

create policy "public read ratings"
on public.rating_history for select using(true);

create policy "public read events"
on public.match_events for select using(true);

create policy "profile own or super"
on public.profiles for select
using(id=auth.uid() or public.current_role()='super_admin');

create policy "super admin creates profiles"
on public.profiles for insert
with check(public.current_role()='super_admin');

create policy "admin inserts teams in own league"
on public.teams for insert
with check(
public.current_role()='super_admin'
or
(public.current_role()='league_admin'
and league_id=public.current_league())
);

create policy "admin updates teams in own league"
on public.teams for update
using(
public.current_role()='super_admin'
or
(public.current_role()='league_admin'
and league_id=public.current_league())
)
with check(
public.current_role()='super_admin'
or
(public.current_role()='league_admin'
and league_id=public.current_league())
);

create policy "admin inserts matches in own league"
on public.matches for insert
with check(
public.current_role()='super_admin'
or
(public.current_role()='league_admin'
and league_id=public.current_league())
);

create policy "admin updates matches in own league"
on public.matches for update
using(
public.current_role()='super_admin'
or
(public.current_role()='league_admin'
and league_id=public.current_league())
)
with check(
public.current_role()='super_admin'
or
(public.current_role()='league_admin'
and league_id=public.current_league())
);

-- Муҳим:
-- Аввалин Super Admin баъди сохтани Auth user
-- бояд бо UUID-и воқеӣ аз SQL Editor таъин карда шавад.
-- service_role key-ро дар JavaScript нагузоред.
-- Рейтинги автоматӣ ҳанӯз trigger/server function мехоҳад.
