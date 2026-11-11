-- ============================================================
-- DEMO SEED DATA — clearly labelled placeholder content.
-- Generated from lib/demo-data.ts by `pnpm seed:generate`.
-- Partner guesthouses, rooms, rates, fees, menu items and durations
-- are DEMO values. Replace them with verified details before launch.
-- Legacy prices from the previous website are inserted as DRAFT.
-- Image URLs point to /images/* bundled with the site; replace them
-- through Admin → Media.
-- Safe to re-run: existing rows with the same id are skipped.
-- ============================================================

-- media
insert into public.media (id, url, storage_path, alt, caption, width, height, is_demo, created_at) values
  ('00000000-0000-4000-8000-000000000001', '/images/hero-huraa.png', null, 'Aerial view of Huraa island with its harbour, palms and turquoise lagoon', 'Huraa, North Malé Atoll', null, null, true, '2026-01-01T00:00:00.000Z'),
  ('00000000-0000-4000-8000-000000000002', '/images/huraa-village.png', null, 'Sandy lane on Huraa lined with coral-stone walls, bougainvillea and bicycles', 'Everyday island life', null, null, true, '2026-01-01T00:00:00.000Z'),
  ('00000000-0000-4000-8000-000000000003', '/images/huraa-beach.png', null, 'Quiet white sand beach with a leaning palm and clear shallow water', 'Huraa beach', null, null, true, '2026-01-01T00:00:00.000Z'),
  ('00000000-0000-4000-8000-000000000004', '/images/huraa-harbour.png', null, 'Wooden dhoni boats moored in the harbour at sunset', 'The harbour at dusk', null, null, true, '2026-01-01T00:00:00.000Z'),
  ('00000000-0000-4000-8000-000000000005', '/images/surf-reef.png', null, 'Surfer riding a glassy right-hand reef wave over clear turquoise water', 'North Malé reef break', null, null, true, '2026-01-01T00:00:00.000Z'),
  ('00000000-0000-4000-8000-000000000006', '/images/surf-boat.png', null, 'Surfboards stacked on a boat anchored in a channel beside a reef break', 'Boat trips to the breaks', null, null, true, '2026-01-01T00:00:00.000Z'),
  ('00000000-0000-4000-8000-000000000007', '/images/surf-paddle.png', null, 'Aerial view of two surfers paddling over turquoise water and reef', 'Paddling out', null, null, true, '2026-01-01T00:00:00.000Z'),
  ('00000000-0000-4000-8000-000000000008', '/images/snorkel.png', null, 'Snorkeller floating above a colourful coral reef with tropical fish', 'House reef snorkelling', null, null, true, '2026-01-01T00:00:00.000Z'),
  ('00000000-0000-4000-8000-000000000009', '/images/sandbank.png', null, 'Tiny white sandbank in a turquoise lagoon with a shade umbrella and boat', 'Sandbank picnic', null, null, true, '2026-01-01T00:00:00.000Z'),
  ('00000000-0000-4000-8000-000000000010', '/images/fishing.png', null, 'Silhouetted hands holding a fishing line over the ocean at sunset', 'Traditional handline fishing', null, null, true, '2026-01-01T00:00:00.000Z'),
  ('00000000-0000-4000-8000-000000000011', '/images/diving.png', null, 'Scuba diver beside a coral wall as a manta ray glides overhead', 'Diving North Malé Atoll', null, null, true, '2026-01-01T00:00:00.000Z'),
  ('00000000-0000-4000-8000-000000000012', '/images/restaurant.png', null, 'Open-air restaurant tables on the sand under palms and string lights at dusk', 'Sea Shine restaurant (demo photo)', null, null, true, '2026-01-01T00:00:00.000Z'),
  ('00000000-0000-4000-8000-000000000013', '/images/food-curry.png', null, 'Tuna curry with roshi flatbread, rice, lime and chilli', 'Island-style curry (demo photo)', null, null, true, '2026-01-01T00:00:00.000Z'),
  ('00000000-0000-4000-8000-000000000014', '/images/food-grill.png', null, 'Whole grilled reef fish with lime, chilli and coconut sambal', 'Grilled catch (demo photo)', null, null, true, '2026-01-01T00:00:00.000Z'),
  ('00000000-0000-4000-8000-000000000015', '/images/food-breakfast.png', null, 'Mas huni with roshi flatbread, black tea and fresh papaya', 'Maldivian breakfast (demo photo)', null, null, true, '2026-01-01T00:00:00.000Z'),
  ('00000000-0000-4000-8000-000000000016', '/images/stay-exterior.png', null, 'Small white two-storey guesthouse with a wooden balcony and palms', 'Demo partner guesthouse', null, null, true, '2026-01-01T00:00:00.000Z'),
  ('00000000-0000-4000-8000-000000000017', '/images/stay-room.png', null, 'Bright double bedroom with white linen and a palm-view window', 'Demo partner room', null, null, true, '2026-01-01T00:00:00.000Z'),
  ('00000000-0000-4000-8000-000000000018', '/images/stay-terrace.png', null, 'Rooftop terrace with bean bags overlooking palms and the lagoon at sunset', 'Demo rooftop terrace', null, null, true, '2026-01-01T00:00:00.000Z'),
  ('00000000-0000-4000-8000-000000000019', '/images/huraa-mangrove.png', null, 'Calm mangrove lagoon with trees reflected in still water', 'Huraa mangroves', null, null, true, '2026-01-01T00:00:00.000Z')
on conflict (id) do nothing;

-- guesthouses
insert into public.guesthouses (id, slug, name, summary, description, location, map_link, amenities, house_rules, cover_media_id, status, is_demo, sort) values
  ('00000000-0000-4000-8000-000000000101', 'demo-lagoon-house', 'Lagoon House (Demo Partner)', 'DEMO LISTING — replace with a verified partner guesthouse. A short walk to the beach.', 'This is placeholder content showing how a partner guesthouse appears on the site. Replace the name, photos, description, rooms and rates with verified details supplied by the partner property before publishing.

Sea Shine Travel & Tours handles your booking request and confirms availability directly with the guesthouse.', 'Huraa, North Malé Atoll', null, array['Air conditioning', 'Wi-Fi', 'Private bathroom', 'Breakfast available', 'Airport transfer on request']::text[], 'Local island etiquette applies: modest dress in the village, bikini beach for swimwear. No alcohol on local islands.', '00000000-0000-4000-8000-000000000016', 'published', true, 1),
  ('00000000-0000-4000-8000-000000000102', 'demo-harbour-view', 'Harbour View Rooms (Demo Partner)', 'DEMO LISTING — replace with a verified partner guesthouse. Rooftop terrace over the lagoon.', 'Placeholder partner property for the demo preview. Use the admin portal to replace every detail and photo with verified information, or set the listing to draft.', 'Huraa, North Malé Atoll', null, array['Air conditioning', 'Wi-Fi', 'Rooftop terrace', 'Surfboard storage']::text[], 'Quiet hours after 22:00. Local island etiquette applies.', '00000000-0000-4000-8000-000000000018', 'published', true, 2)
on conflict (id) do nothing;

-- room_types
insert into public.room_types (id, guesthouse_id, name, description, bed_config, size_sqm, max_adults, max_children, max_occupancy, inventory, base_rate, min_nights, amenities, cover_media_id, status, sort) values
  ('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000101', 'Double Room (Demo)', 'Demo room type — replace with verified room details from the partner.', '1 double bed', null, 2, 1, 3, 4, 70, 2, array['Air conditioning', 'Private bathroom', 'Wi-Fi']::text[], '00000000-0000-4000-8000-000000000017', 'published', 1),
  ('00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000101', 'Triple Room (Demo)', 'Demo room type — replace with verified room details from the partner.', '1 double + 1 single bed', null, 3, 1, 3, 2, 90, 2, array['Air conditioning', 'Private bathroom', 'Wi-Fi']::text[], '00000000-0000-4000-8000-000000000017', 'published', 2),
  ('00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000102', 'Standard Double (Demo)', 'Demo room type — replace with verified room details from the partner.', '1 double bed', null, 2, 0, 2, 3, 65, 2, array['Air conditioning', 'Private bathroom', 'Wi-Fi']::text[], '00000000-0000-4000-8000-000000000017', 'published', 1),
  ('00000000-0000-4000-8000-000000000204', '00000000-0000-4000-8000-000000000102', 'Family Room (Demo)', 'Demo room type — replace with verified room details from the partner.', '1 double + 2 single beds', null, 2, 2, 4, 1, 110, 2, array['Air conditioning', 'Private bathroom', 'Wi-Fi']::text[], '00000000-0000-4000-8000-000000000017', 'published', 2)
on conflict (id) do nothing;

-- seasonal_rates
insert into public.seasonal_rates (id, room_type_id, label, start_date, end_date, nightly_rate, min_nights) values
  ('00000000-0000-4000-8000-000000000301', '00000000-0000-4000-8000-000000000201', 'Festive season (demo)', '2026-12-20', '2027-01-05', 95, 4),
  ('00000000-0000-4000-8000-000000000302', '00000000-0000-4000-8000-000000000203', 'Peak surf season (demo)', '2027-03-01', '2027-04-30', 80, null)
on conflict (id) do nothing;

-- fees
insert into public.fees (id, name, kind, amount, active, sort, note) values
  ('00000000-0000-4000-8000-000000000401', 'Service charge (demo — verify)', 'percent', 10, true, 1, 'Applied to accommodation.'),
  ('00000000-0000-4000-8000-000000000402', 'T-GST (demo — verify current rate)', 'percent_compound', 17, true, 2, 'Applied to accommodation plus prior charges.'),
  ('00000000-0000-4000-8000-000000000403', 'Green tax (demo — verify)', 'per_person_night', 6, true, 3, 'Per guest per night.')
on conflict (id) do nothing;

-- surf_packages
insert into public.surf_packages (id, slug, title, summary, description, duration_label, duration_nights, inclusions, accommodation_options, price_from, price_note, cover_media_id, status, is_legacy, is_demo, sort) values
  ('00000000-0000-4000-8000-000000000501', 'north-male-surf-week', 'North Malé Surf Week', 'Seven nights on Huraa with daily boat trips to the North Malé Atoll reef breaks.', 'If you grew up looking at surf magazines with double-page spreads of perfect reef breaks peeling around empty tropical islands, start packing. Surfers from around the world make the pilgrimage to the Maldives every year — and Huraa puts you a short boat ride from some of the best-known breaks in North Malé Atoll.

We arrange your stay at a partner guesthouse, daily surf trips with a local boat crew and help choosing the right break for the swell and wind.', '7 nights (demo — confirm)', 7, array['Partner guesthouse accommodation', 'Daily boat surf trips', 'Local crew who know the breaks', 'Meal plan options on request']::text[], array['Double room', 'Triple room (shared)']::text[], null, 'Rates confirmed on enquiry', '00000000-0000-4000-8000-000000000005', 'published', false, true, 1),
  ('00000000-0000-4000-8000-000000000502', 'flexible-surf-stay', 'Flexible Surf Stay', 'Choose your dates and nights — we build a surf trip around the swell.', 'Not sure how many nights you need? Tell us your dates and level, and we will put together accommodation and boat trips that suit you. Ideal for surfers combining Huraa with time elsewhere in the Maldives.', 'Flexible (demo — confirm)', null, array['Partner guesthouse accommodation', 'Boat surf trips (per session or daily)', 'Board storage']::text[], array['Double room', 'Triple room (shared)', 'Family room']::text[], null, 'Rates confirmed on enquiry', '00000000-0000-4000-8000-000000000006', 'published', false, true, 2),
  ('00000000-0000-4000-8000-000000000503', 'legacy-double-room-surf-package', 'LEGACY — Double Room Surf Package', 'Imported from the previous website for review. Not published.', 'Previous website listing: "Surf Package includes: Room, Full Board and Daily Surf Trips — $100 per person, per night." This referred to the former Sea Shine guesthouse and must be reviewed before any use.', 'Per night', null, array['Room', 'Full board', 'Daily surf trips']::text[], array['Double room']::text[], 100, 'Legacy price per person, per night — pending review', '00000000-0000-4000-8000-000000000007', 'draft', true, false, 10),
  ('00000000-0000-4000-8000-000000000504', 'legacy-triple-room-surf-package', 'LEGACY — Triple Room Surf Package', 'Imported from the previous website for review. Not published.', 'Previous website listing: "Surf Package includes: Room, Full Board and Daily Surf Trips — $85 per person, per night." Previous free-night specials: 7+ nights 1 night free, 14+ nights 2 nights free. Pending review.', 'Per night', null, array['Room', 'Full board', 'Daily surf trips']::text[], array['Triple room']::text[], 85, 'Legacy price per person, per night — pending review', '00000000-0000-4000-8000-000000000007', 'draft', true, false, 11)
on conflict (id) do nothing;

-- surf_breaks
insert into public.surf_breaks (id, name, wave, description, status, sort) values
  ('00000000-0000-4000-8000-000000000601', 'Sultans', 'Right-hand reef', 'An exposed reef break with consistent surf that picks up distant groundswell from the south. Good at all stages of the tide, popular and can get crowded. Watch out for rocks.', 'published', 1),
  ('00000000-0000-4000-8000-000000000602', 'Honky''s', 'Left-hand reef', 'A reliable, exposed left-hand reef that favours clean south groundswells and north-easterly offshores. Surfable through the tide; take care with urchins and rocks.', 'published', 2),
  ('00000000-0000-4000-8000-000000000603', 'Jailbreaks', 'Right-hand reef', 'A reasonably consistent right-hander that works best with south swell and south-south-west offshores. Good through the tide. Watch for rocks and dead coral.', 'published', 3),
  ('00000000-0000-4000-8000-000000000604', 'Chickens', 'Left-hand reef', 'A long left-hand reef break in North Malé Atoll. Conditions and access details to be confirmed by the Sea Shine team.', 'published', 4),
  ('00000000-0000-4000-8000-000000000605', 'Cokes (Colas)', 'Right-hand reef', 'A fairly consistent right-hander that likes south-west groundswell and north-west offshores. Rocks are a hazard.', 'published', 5),
  ('00000000-0000-4000-8000-000000000606', 'Ninja''s', 'Right-hand reef', 'Imported from the previous website. Access arrangements unverified — pending review before publishing.', 'draft', 6),
  ('00000000-0000-4000-8000-000000000607', 'Lohi''s', 'Left-hand reef', 'Imported from the previous website. Access arrangements unverified — pending review before publishing.', 'draft', 7),
  ('00000000-0000-4000-8000-000000000608', 'Pasta Point', 'Left-hand reef', 'Imported from the previous website. Access arrangements unverified — pending review before publishing.', 'draft', 8)
on conflict (id) do nothing;

-- activities
insert into public.activities (id, slug, title, summary, description, duration_label, inclusions, price_from, price_note, cover_media_id, status, is_demo, sort) values
  ('00000000-0000-4000-8000-000000000701', 'snorkelling', 'Snorkelling trips', 'Float over coral gardens and reef edges a short boat ride from Huraa.', 'Join a boat trip to nearby reefs to snorkel among reef fish, turtles and coral. Our crew picks spots that suit the conditions and your confidence in the water.', 'Duration confirmed on enquiry', array['Boat transport', 'Local guide', 'Snorkel equipment on request']::text[], null, 'Price on enquiry', '00000000-0000-4000-8000-000000000008', 'published', true, 1),
  ('00000000-0000-4000-8000-000000000702', 'sandbank-picnic', 'Sandbank picnic', 'A day out on a tiny strip of white sand in the middle of the lagoon.', 'Spend a few hours on a sandbank surrounded by turquoise water — swim, snorkel and relax. A perfect half-day between surf sessions.', 'Duration confirmed on enquiry', array['Boat transport', 'Shade on request', 'Snacks or picnic on request']::text[], null, 'Price on enquiry', '00000000-0000-4000-8000-000000000009', 'published', true, 2),
  ('00000000-0000-4000-8000-000000000703', 'sunset-fishing', 'Traditional sunset fishing', 'Try Maldivian handline fishing as the sun goes down.', 'Head out on a local boat at dusk and learn the traditional handline technique used by island fishermen for generations.', 'Duration confirmed on enquiry', array['Boat transport', 'Handlines and bait', 'Local crew']::text[], null, 'Price on enquiry', '00000000-0000-4000-8000-000000000010', 'published', true, 3),
  ('00000000-0000-4000-8000-000000000704', 'diving', 'Diving', 'Explore North Malé Atoll reefs, channels and walls.', 'We can arrange dives with a licensed dive centre for certified divers and beginners. Dive sites and schedules depend on conditions and are confirmed on enquiry.', 'Duration confirmed on enquiry', array['Arranged with a licensed dive centre', 'Equipment options on request']::text[], null, 'Price on enquiry', '00000000-0000-4000-8000-000000000011', 'published', true, 4),
  ('00000000-0000-4000-8000-000000000705', 'fish-feeding-trip', 'Fish feeding trip', 'A short boat trip to watch reef life up close.', 'A relaxed outing suited to families and non-swimmers. Details are confirmed by our team on enquiry.', 'Duration confirmed on enquiry', array['Boat transport', 'Local crew']::text[], null, 'Price on enquiry', '00000000-0000-4000-8000-000000000004', 'published', true, 5)
on conflict (id) do nothing;

-- menu_items
insert into public.menu_items (id, category, name, description, price, dietary, status, is_demo, sort) values
  ('00000000-0000-4000-8000-000000000801', 'Breakfast', 'Mas huni & roshi (demo)', 'Demo menu item — tuna, coconut, onion and chilli with warm flatbread.', null, array[]::text[], 'published', true, 1),
  ('00000000-0000-4000-8000-000000000802', 'Breakfast', 'Fresh fruit plate (demo)', 'Demo menu item — seasonal tropical fruit.', null, array['Vegan']::text[], 'published', true, 2),
  ('00000000-0000-4000-8000-000000000803', 'Mains', 'Island fish curry (demo)', 'Demo menu item — replace with the real menu.', null, array[]::text[], 'published', true, 3),
  ('00000000-0000-4000-8000-000000000804', 'Mains', 'Grilled catch of the day (demo)', 'Demo menu item — replace with the real menu.', null, array['Gluten free']::text[], 'published', true, 4),
  ('00000000-0000-4000-8000-000000000805', 'Mains', 'Vegetable curry (demo)', 'Demo menu item — replace with the real menu.', null, array['Vegetarian']::text[], 'published', true, 5),
  ('00000000-0000-4000-8000-000000000806', 'Drinks', 'Fresh coconut (demo)', 'Demo menu item.', null, array['Vegan']::text[], 'published', true, 6)
on conflict (id) do nothing;

-- gallery_items
insert into public.gallery_items (id, gallery_key, media_id, position, caption, status) values
  ('00000000-0000-4000-8000-000000000901', 'huraa', '00000000-0000-4000-8000-000000000002', 1, null, 'published'),
  ('00000000-0000-4000-8000-000000000902', 'huraa', '00000000-0000-4000-8000-000000000003', 2, null, 'published'),
  ('00000000-0000-4000-8000-000000000903', 'huraa', '00000000-0000-4000-8000-000000000004', 3, null, 'published'),
  ('00000000-0000-4000-8000-000000000904', 'huraa', '00000000-0000-4000-8000-000000000019', 4, null, 'published'),
  ('00000000-0000-4000-8000-000000000910', 'restaurant', '00000000-0000-4000-8000-000000000012', 1, null, 'published'),
  ('00000000-0000-4000-8000-000000000911', 'restaurant', '00000000-0000-4000-8000-000000000015', 2, null, 'published'),
  ('00000000-0000-4000-8000-000000000912', 'restaurant', '00000000-0000-4000-8000-000000000013', 3, null, 'published'),
  ('00000000-0000-4000-8000-000000000913', 'restaurant', '00000000-0000-4000-8000-000000000014', 4, null, 'published'),
  ('00000000-0000-4000-8000-000000000920', 'gallery', '00000000-0000-4000-8000-000000000001', 1, null, 'published'),
  ('00000000-0000-4000-8000-000000000921', 'gallery', '00000000-0000-4000-8000-000000000005', 2, null, 'published'),
  ('00000000-0000-4000-8000-000000000922', 'gallery', '00000000-0000-4000-8000-000000000002', 3, null, 'published'),
  ('00000000-0000-4000-8000-000000000923', 'gallery', '00000000-0000-4000-8000-000000000009', 4, null, 'published'),
  ('00000000-0000-4000-8000-000000000924', 'gallery', '00000000-0000-4000-8000-000000000008', 5, null, 'published'),
  ('00000000-0000-4000-8000-000000000925', 'gallery', '00000000-0000-4000-8000-000000000004', 6, null, 'published'),
  ('00000000-0000-4000-8000-000000000926', 'gallery', '00000000-0000-4000-8000-000000000007', 7, null, 'published'),
  ('00000000-0000-4000-8000-000000000927', 'gallery', '00000000-0000-4000-8000-000000000003', 8, null, 'published'),
  ('00000000-0000-4000-8000-000000000928', 'gallery', '00000000-0000-4000-8000-000000000019', 9, null, 'published'),
  ('00000000-0000-4000-8000-000000000929', 'gallery', '00000000-0000-4000-8000-000000000010', 10, null, 'published'),
  ('00000000-0000-4000-8000-000000000930', 'guesthouse:00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000016', 1, null, 'published'),
  ('00000000-0000-4000-8000-000000000931', 'guesthouse:00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000017', 2, null, 'published'),
  ('00000000-0000-4000-8000-000000000932', 'guesthouse:00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000003', 3, null, 'published'),
  ('00000000-0000-4000-8000-000000000933', 'guesthouse:00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000018', 1, null, 'published'),
  ('00000000-0000-4000-8000-000000000934', 'guesthouse:00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000017', 2, null, 'published'),
  ('00000000-0000-4000-8000-000000000935', 'guesthouse:00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000004', 3, null, 'published'),
  ('00000000-0000-4000-8000-000000000940', 'surf:00000000-0000-4000-8000-000000000501', '00000000-0000-4000-8000-000000000005', 1, null, 'published'),
  ('00000000-0000-4000-8000-000000000941', 'surf:00000000-0000-4000-8000-000000000501', '00000000-0000-4000-8000-000000000006', 2, null, 'published'),
  ('00000000-0000-4000-8000-000000000942', 'surf:00000000-0000-4000-8000-000000000501', '00000000-0000-4000-8000-000000000007', 3, null, 'published'),
  ('00000000-0000-4000-8000-000000000943', 'surf:00000000-0000-4000-8000-000000000502', '00000000-0000-4000-8000-000000000006', 1, null, 'published'),
  ('00000000-0000-4000-8000-000000000944', 'surf:00000000-0000-4000-8000-000000000502', '00000000-0000-4000-8000-000000000005', 2, null, 'published')
on conflict (id) do nothing;

