-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;

create policy "profiles_select_public"
  on public.profiles for select
  using (true);

create policy "profiles_modify_own"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Pins
create table if not exists public.pins (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image text,
  code text not null,
  lang text not null,
  tags text[] default '{}',
  height int not null default 320,
  created_at timestamptz default now(),
  posted_by uuid references public.profiles(id) on delete set null
);
alter table public.pins enable row level security;

create policy "pins_select_all"
  on public.pins for select
  using (true);

create policy "pins_insert_auth"
  on public.pins for insert
  with check (auth.role() = 'authenticated');

create policy "pins_update_own"
  on public.pins for update
  using (auth.uid() = posted_by)
  with check (auth.uid() = posted_by);

-- Boards
create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now()
);
alter table public.boards enable row level security;

create policy "boards_select_owner_or_public"
  on public.boards for select
  using (auth.uid() = owner_id);

create policy "boards_insert_auth"
  on public.boards for insert
  with check (auth.role() = 'authenticated');

create policy "boards_update_owner"
  on public.boards for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Board Pins (ordering)
create table if not exists public.board_pins (
  board_id uuid references public.boards(id) on delete cascade,
  pin_id uuid references public.pins(id) on delete cascade,
  sort_order int not null default 0,
  added_by uuid references public.profiles(id) on delete set null,
  added_at timestamptz default now(),
  primary key (board_id, pin_id)
);
alter table public.board_pins enable row level security;

create policy "board_pins_select_owner"
  on public.board_pins for select
  using (exists (select 1 from public.boards b where b.id = board_id and b.owner_id = auth.uid()));

create policy "board_pins_modify_owner"
  on public.board_pins for all
  using (exists (select 1 from public.boards b where b.id = board_id and b.owner_id = auth.uid()))
  with check (exists (select 1 from public.boards b where b.id = board_id and b.owner_id = auth.uid()));

-- Votes
create table if not exists public.votes (
  user_id uuid references public.profiles(id) on delete cascade,
  pin_id uuid references public.pins(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, pin_id)
);
alter table public.votes enable row level security;

create policy "votes_select_public"
  on public.votes for select using (true);

create policy "votes_insert_auth"
  on public.votes for insert
  with check (auth.role() = 'authenticated');

create policy "votes_delete_own"
  on public.votes for delete
  using (auth.uid() = user_id);

-- Badges
create table if not exists public.badges (
  id serial primary key,
  name text unique not null
);

create table if not exists public.pin_badges (
  pin_id uuid references public.pins(id) on delete cascade,
  badge_id int references public.badges(id) on delete cascade,
  primary key (pin_id, badge_id)
);
alter table public.pin_badges enable row level security;
create policy "pin_badges_select_public" on public.pin_badges for select using (true);

-- Hackathons and Submissions
create table if not exists public.hackathons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  prize text,
  tags text[] default '{}',
  start_at timestamptz not null,
  end_at timestamptz not null
);
alter table public.hackathons enable row level security;
create policy "hackathons_select_public" on public.hackathons for select using (true);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  hackathon_id uuid references public.hackathons(id) on delete cascade,
  repo_url text not null,
  demo_url text,
  notes text,
  status text not null default 'pending',
  created_at timestamptz default now(),
  user_id uuid references public.profiles(id) on delete set null
);
alter table public.submissions enable row level security;
create policy "submissions_select_public" on public.submissions for select using (true);
create policy "submissions_insert_auth" on public.submissions for insert with check (auth.role() = 'authenticated');

-- Indexes
create index if not exists idx_pins_lang on public.pins (lang);
create index if not exists idx_pins_tags_gin on public.pins using gin (tags);
create index if not exists idx_board_pins_board on public.board_pins (board_id, sort_order);
create index if not exists idx_votes_pin on public.votes (pin_id);
