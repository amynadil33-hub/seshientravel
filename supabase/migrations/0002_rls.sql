-- Row Level Security
-- Public (anon) can only read PUBLISHED content. Bookings and enquiries are never
-- readable publicly; they are inserted by validated server actions using the
-- service-role key (server-only). Admins (rows in public.admins) can manage everything.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.admins enable row level security;
alter table public.media enable row level security;
alter table public.guesthouses enable row level security;
alter table public.room_types enable row level security;
alter table public.seasonal_rates enable row level security;
alter table public.date_blocks enable row level security;
alter table public.fees enable row level security;
alter table public.bookings enable row level security;
alter table public.surf_packages enable row level security;
alter table public.surf_breaks enable row level security;
alter table public.activities enable row level security;
alter table public.menu_items enable row level security;
alter table public.enquiries enable row level security;
alter table public.content_blocks enable row level security;
alter table public.gallery_items enable row level security;

-- admins: a user may see only their own allow-list row (used for the server check).
drop policy if exists admins_self_select on public.admins;
create policy admins_self_select on public.admins for select to authenticated using (user_id = auth.uid());

-- Public read policies
drop policy if exists media_public_read on public.media;
create policy media_public_read on public.media for select using (true);

drop policy if exists guesthouses_public_read on public.guesthouses;
create policy guesthouses_public_read on public.guesthouses for select using (status = 'published' or public.is_admin());

drop policy if exists room_types_public_read on public.room_types;
create policy room_types_public_read on public.room_types for select using (
  (status = 'published' and exists (select 1 from public.guesthouses g where g.id = room_types.guesthouse_id and g.status = 'published'))
  or public.is_admin()
);

drop policy if exists seasonal_rates_public_read on public.seasonal_rates;
create policy seasonal_rates_public_read on public.seasonal_rates for select using (
  exists (select 1 from public.room_types r where r.id = seasonal_rates.room_type_id and r.status = 'published')
  or public.is_admin()
);

drop policy if exists fees_public_read on public.fees;
create policy fees_public_read on public.fees for select using (active or public.is_admin());

drop policy if exists surf_packages_public_read on public.surf_packages;
create policy surf_packages_public_read on public.surf_packages for select using (status = 'published' or public.is_admin());

drop policy if exists surf_breaks_public_read on public.surf_breaks;
create policy surf_breaks_public_read on public.surf_breaks for select using (status = 'published' or public.is_admin());

drop policy if exists activities_public_read on public.activities;
create policy activities_public_read on public.activities for select using (status = 'published' or public.is_admin());

drop policy if exists menu_items_public_read on public.menu_items;
create policy menu_items_public_read on public.menu_items for select using (status = 'published' or public.is_admin());

drop policy if exists content_blocks_public_read on public.content_blocks;
create policy content_blocks_public_read on public.content_blocks for select using (true);

drop policy if exists gallery_items_public_read on public.gallery_items;
create policy gallery_items_public_read on public.gallery_items for select using (status = 'published' or public.is_admin());

-- Admin-only tables for reading
drop policy if exists date_blocks_admin_read on public.date_blocks;
create policy date_blocks_admin_read on public.date_blocks for select using (public.is_admin());

drop policy if exists bookings_admin_read on public.bookings;
create policy bookings_admin_read on public.bookings for select using (public.is_admin());

drop policy if exists enquiries_admin_read on public.enquiries;
create policy enquiries_admin_read on public.enquiries for select using (public.is_admin());

-- Admin write policies (insert/update/delete) on every managed table
do $$
declare t text;
begin
  foreach t in array array[
    'media', 'guesthouses', 'room_types', 'seasonal_rates', 'date_blocks', 'fees', 'bookings',
    'surf_packages', 'surf_breaks', 'activities', 'menu_items', 'enquiries', 'content_blocks', 'gallery_items'
  ] loop
    execute format('drop policy if exists %I on public.%I', t || '_admin_insert', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.is_admin())', t || '_admin_insert', t);
    execute format('drop policy if exists %I on public.%I', t || '_admin_update', t);
    execute format('create policy %I on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t || '_admin_update', t);
    execute format('drop policy if exists %I on public.%I', t || '_admin_delete', t);
    execute format('create policy %I on public.%I for delete to authenticated using (public.is_admin())', t || '_admin_delete', t);
  end loop;
end $$;
