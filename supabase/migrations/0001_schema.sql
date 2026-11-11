-- Sea Shine Travel & Tours — core schema
-- Run in order: 0001_schema.sql, 0002_rls.sql, 0003_functions.sql, 0004_storage.sql, then seed.sql (optional demo data).

create extension if not exists pgcrypto;

-- Admin allow-list. Add rows manually after creating the admin user (see README).
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  storage_path text,
  alt text not null default '',
  caption text,
  width int,
  height int,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.guesthouses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  summary text not null default '',
  description text not null default '',
  location text not null default 'Huraa, North Malé Atoll',
  map_link text,
  amenities text[] not null default '{}',
  house_rules text,
  cover_media_id uuid references public.media(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  is_demo boolean not null default false,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.room_types (
  id uuid primary key default gen_random_uuid(),
  guesthouse_id uuid not null references public.guesthouses(id) on delete cascade,
  name text not null,
  description text not null default '',
  bed_config text not null default '',
  size_sqm int,
  max_adults int not null default 2 check (max_adults >= 1),
  max_children int not null default 0 check (max_children >= 0),
  max_occupancy int not null default 2 check (max_occupancy >= 1),
  inventory int not null default 1 check (inventory >= 0),
  base_rate numeric(10,2) not null check (base_rate >= 0),
  min_nights int not null default 1 check (min_nights >= 1),
  amenities text[] not null default '{}',
  cover_media_id uuid references public.media(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists room_types_guesthouse_idx on public.room_types(guesthouse_id);

create table if not exists public.seasonal_rates (
  id uuid primary key default gen_random_uuid(),
  room_type_id uuid not null references public.room_types(id) on delete cascade,
  label text not null,
  start_date date not null,
  end_date date not null,
  nightly_rate numeric(10,2) not null check (nightly_rate >= 0),
  min_nights int check (min_nights is null or min_nights >= 1),
  created_at timestamptz not null default now(),
  check (end_date >= start_date)
);
create index if not exists seasonal_rates_room_idx on public.seasonal_rates(room_type_id);

-- Inclusive date range of nights blocked (e.g. partner sold rooms elsewhere, maintenance).
create table if not exists public.date_blocks (
  id uuid primary key default gen_random_uuid(),
  room_type_id uuid not null references public.room_types(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  units int not null default 1 check (units >= 1),
  reason text,
  created_at timestamptz not null default now(),
  check (end_date >= start_date)
);
create index if not exists date_blocks_room_idx on public.date_blocks(room_type_id);

create table if not exists public.fees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text not null check (kind in ('percent', 'percent_compound', 'per_person_night', 'per_room_night', 'per_stay')),
  amount numeric(10,2) not null check (amount >= 0),
  active boolean not null default true,
  sort int not null default 0,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  guesthouse_id uuid not null references public.guesthouses(id) on delete restrict,
  room_type_id uuid not null references public.room_types(id) on delete restrict,
  check_in date not null,
  check_out date not null,
  adults int not null check (adults >= 1),
  children int not null default 0 check (children >= 0),
  units int not null default 1 check (units >= 1),
  guest_name text not null,
  email text not null,
  phone text not null,
  country text,
  arrival_notes text,
  price_breakdown jsonb not null,
  total numeric(10,2) not null,
  currency text not null default 'USD',
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'declined', 'cancelled')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'deposit_paid', 'paid', 'refunded')),
  admin_notes text,
  cancellation_reason text,
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  check (check_out > check_in)
);
create index if not exists bookings_room_dates_idx on public.bookings(room_type_id, check_in, check_out);
create index if not exists bookings_status_idx on public.bookings(status);

create table if not exists public.surf_packages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  summary text not null default '',
  description text not null default '',
  duration_label text not null default '',
  duration_nights int,
  inclusions text[] not null default '{}',
  accommodation_options text[] not null default '{}',
  price_from numeric(10,2),
  price_note text,
  cover_media_id uuid references public.media(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  is_legacy boolean not null default false,
  is_demo boolean not null default false,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.surf_breaks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  wave text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  summary text not null default '',
  description text not null default '',
  duration_label text not null default '',
  inclusions text[] not null default '{}',
  price_from numeric(10,2),
  price_note text,
  cover_media_id uuid references public.media(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  is_demo boolean not null default false,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  description text not null default '',
  price numeric(10,2),
  dietary text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  is_demo boolean not null default false,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('surf', 'activity', 'restaurant', 'contact', 'guesthouse')),
  subject_id uuid,
  subject_title text,
  name text not null,
  email text not null,
  phone text,
  preferred_date date,
  party_size int check (party_size is null or party_size between 1 and 100),
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  created_at timestamptz not null default now()
);

-- Editable page text / image slots. Image slots use media_id; text slots use value.
create table if not exists public.content_blocks (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  key text not null,
  value text,
  media_id uuid references public.media(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (page, key)
);

-- Ordered galleries. gallery_key examples: 'gallery', 'huraa', 'restaurant',
-- 'guesthouse:<uuid>', 'surf:<uuid>', 'activity:<uuid>'.
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  gallery_key text not null,
  media_id uuid not null references public.media(id) on delete cascade,
  position int not null default 0,
  caption text,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);
create index if not exists gallery_items_key_idx on public.gallery_items(gallery_key, position);
