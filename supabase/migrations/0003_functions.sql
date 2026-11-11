-- Atomic booking confirmation.
-- Locks the room type row so two admins confirming at once cannot oversell,
-- then checks every night of the stay against inventory minus confirmed
-- bookings and date blocks. Pending requests never hold inventory.

create or replace function public.confirm_booking(p_booking_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  b public.bookings%rowtype;
  inv int;
  night date;
  used int;
begin
  if not public.is_admin() then
    raise exception 'not authorised' using errcode = '42501';
  end if;

  select * into b from public.bookings where id = p_booking_id for update;
  if not found then
    raise exception 'Booking not found';
  end if;
  if b.status = 'confirmed' then
    return 'already_confirmed';
  end if;
  if b.status not in ('pending', 'declined', 'cancelled') then
    raise exception 'Booking cannot be confirmed from status %', b.status;
  end if;

  select inventory into inv from public.room_types where id = b.room_type_id for update;
  if inv is null then
    raise exception 'Room type not found';
  end if;

  night := b.check_in;
  while night < b.check_out loop
    select coalesce(sum(x.units), 0) into used
    from public.bookings x
    where x.room_type_id = b.room_type_id
      and x.status = 'confirmed'
      and x.id <> b.id
      and x.check_in <= night and x.check_out > night;

    used := used + coalesce((
      select sum(d.units) from public.date_blocks d
      where d.room_type_id = b.room_type_id and d.start_date <= night and d.end_date >= night
    ), 0);

    if used + b.units > inv then
      raise exception 'Not enough inventory on % (% of % rooms already taken)', night, used, inv
        using errcode = 'P0001';
    end if;
    night := night + 1;
  end loop;

  update public.bookings
  set status = 'confirmed', decided_at = now(), cancellation_reason = null
  where id = b.id;

  return 'confirmed';
end;
$$;

revoke all on function public.confirm_booking(uuid) from public;
grant execute on function public.confirm_booking(uuid) to authenticated;

-- Nightly availability summary for a room type (used by the public booking
-- engine through the service role, and the admin calendar).
create or replace function public.room_occupancy(p_room_type_id uuid, p_from date, p_to date)
returns table (night date, confirmed_units int, blocked_units int, pending_units int)
language sql
stable
security definer
set search_path = ''
as $$
  select d::date as night,
    coalesce((select sum(b.units) from public.bookings b where b.room_type_id = p_room_type_id and b.status = 'confirmed' and b.check_in <= d and b.check_out > d), 0)::int,
    coalesce((select sum(x.units) from public.date_blocks x where x.room_type_id = p_room_type_id and x.start_date <= d and x.end_date >= d), 0)::int,
    coalesce((select sum(b.units) from public.bookings b where b.room_type_id = p_room_type_id and b.status = 'pending' and b.check_in <= d and b.check_out > d), 0)::int
  from generate_series(p_from, p_to - 1, interval '1 day') d;
$$;

revoke all on function public.room_occupancy(uuid, date, date) from public;
grant execute on function public.room_occupancy(uuid, date, date) to service_role;
