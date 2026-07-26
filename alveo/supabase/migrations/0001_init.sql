-- Alveo — initial schema.
--
-- The flour and recipe catalogues live in the repository as TypeScript and are
-- the single source of truth; Postgres holds what users produce: shelves, bake
-- logs, calibration submissions, and the editorial pipeline. Public content is
-- world-readable; everything user-owned is RLS-fenced to its owner.
--
-- engine_version is stamped on every computed artefact. When a model
-- coefficient changes — and the calibration loop guarantees it will — history
-- must stay interpretable under the model that produced it.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- users
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  country text check (char_length(country) = 2),
  kitchen_temp_c numeric(4,1),
  fridge_temp_c numeric(4,1) default 5.0,
  locale text not null default 'nl' check (locale in ('nl', 'en')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are self-readable"
  on public.profiles for select using (auth.uid() = id);
create policy "profiles are self-writable"
  on public.profiles for insert with check (auth.uid() = id);
create policy "profiles are self-updatable"
  on public.profiles for update using (auth.uid() = id);

-- ---------------------------------------------------------------- shelf
create table public.user_flours (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  flour_slug text not null,
  grams_on_hand integer check (grams_on_hand >= 0),
  -- A personal calibration overrides the model for this user only.
  measured_absorption numeric(5,1)
    check (measured_absorption between 40 and 130),
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, flour_slug)
);

alter table public.user_flours enable row level security;

create policy "shelf is owner-only (select)"
  on public.user_flours for select using (auth.uid() = user_id);
create policy "shelf is owner-only (insert)"
  on public.user_flours for insert with check (auth.uid() = user_id);
create policy "shelf is owner-only (update)"
  on public.user_flours for update using (auth.uid() = user_id);
create policy "shelf is owner-only (delete)"
  on public.user_flours for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------- bakes
create table public.bakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  recipe_slug text not null,
  baked_on date not null default current_date,
  -- The full engine input and output, so a bake is reproducible later even
  -- after the model moves on.
  engine_version text not null,
  inputs jsonb not null,
  result jsonb not null,
  actual_bulk_minutes integer,
  actual_cold_hours numeric(4,1),
  crumb_rating smallint check (crumb_rating between 1 and 5),
  spread_rating smallint check (spread_rating between 1 and 5),
  notes text,
  created_at timestamptz not null default now()
);

create index bakes_user_recency on public.bakes (user_id, baked_on desc);

alter table public.bakes enable row level security;

create policy "bakes are owner-only (select)"
  on public.bakes for select using (auth.uid() = user_id);
create policy "bakes are owner-only (insert)"
  on public.bakes for insert with check (auth.uid() = user_id);
create policy "bakes are owner-only (update)"
  on public.bakes for update using (auth.uid() = user_id);
create policy "bakes are owner-only (delete)"
  on public.bakes for delete using (auth.uid() = user_id);

create table public.bake_photos (
  id uuid primary key default gen_random_uuid(),
  bake_id uuid not null references public.bakes (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  storage_path text not null,
  kind text not null default 'crumb' check (kind in ('crumb', 'loaf', 'dough', 'other')),
  created_at timestamptz not null default now()
);

alter table public.bake_photos enable row level security;

create policy "photos are owner-only (select)"
  on public.bake_photos for select using (auth.uid() = user_id);
create policy "photos are owner-only (insert)"
  on public.bake_photos for insert with check (auth.uid() = user_id);
create policy "photos are owner-only (delete)"
  on public.bake_photos for delete using (auth.uid() = user_id);

-- ------------------------------------------------------- calibration
-- The moat. Individual submissions are private to their author; the consensus
-- view is public. Method is recorded because hand-kneading reads a couple of
-- points low and the engine corrects for it rather than pretending protocols
-- are equal.
create table public.flour_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  flour_slug text not null,
  flour_grams numeric(6,1) not null check (flour_grams >= 20),
  water_grams numeric(6,1) not null check (water_grams > 0),
  method text not null check (method in ('pinch', 'stand-mixer', 'hand-knead')),
  dough_temp_c numeric(4,1),
  engine_version text not null,
  -- Set by the evaluation function, never by the client.
  accepted boolean,
  reject_reason text,
  absorption numeric(5,1),
  created_at timestamptz not null default now()
);

create index measurements_by_flour on public.flour_measurements (flour_slug)
  where accepted is true;

alter table public.flour_measurements enable row level security;

create policy "measurements are owner-readable"
  on public.flour_measurements for select using (auth.uid() = user_id);
create policy "measurements are owner-insertable"
  on public.flour_measurements for insert with check (auth.uid() = user_id);

-- The public consensus: what the site is allowed to claim about a flour.
create table public.flour_consensus (
  flour_slug text primary key,
  median_absorption numeric(5,1),
  accepted_count integer not null default 0,
  spread numeric(4,1),
  promoted boolean not null default false,
  engine_version text not null,
  updated_at timestamptz not null default now()
);

alter table public.flour_consensus enable row level security;

create policy "consensus is world-readable"
  on public.flour_consensus for select using (true);
-- No insert/update policies: only the service role recomputes consensus.

-- ---------------------------------------------------------------- blog
-- Drafts are machine-generated; nothing reaches 'published' without a human
-- review recording who approved it. That constraint is enforced here, not
-- merely promised in the admin UI.
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  locale text not null check (locale in ('nl', 'en')),
  title text not null,
  summary text,
  body_md text not null,
  status text not null default 'draft'
    check (status in ('draft', 'review', 'rejected', 'published')),
  reviewed_by uuid references public.profiles (id),
  review_note text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_requires_reviewer
    check (status <> 'published' or reviewed_by is not null)
);

create table public.post_sources (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  claim text not null,
  url text not null,
  verdict text check (verdict in ('supported', 'unsupported', 'needs-source')),
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;
alter table public.post_sources enable row level security;

create policy "published posts are world-readable"
  on public.posts for select using (status = 'published');
create policy "sources of published posts are world-readable"
  on public.post_sources for select using (
    exists (
      select 1 from public.posts p
      where p.id = post_id and p.status = 'published'
    )
  );
-- Draft/review access and all writes go through the service role in the
-- admin review queue; no client-side policies exist for them on purpose.
