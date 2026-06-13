-- ============================================================
-- AntwerpOnTap — Supabase import script
-- Paste this in: Supabase → SQL Editor → New query → Run
-- ============================================================

-- 1. Add missing columns to the cafés table
-- (IF NOT EXISTS is safe to run multiple times)
ALTER TABLE "cafés"
  ADD COLUMN IF NOT EXISTS type_tags        TEXT[],
  ADD COLUMN IF NOT EXISTS opening_hours    JSONB,
  ADD COLUMN IF NOT EXISTS photo_url        TEXT,
  ADD COLUMN IF NOT EXISTS beer_name        TEXT,
  ADD COLUMN IF NOT EXISTS beer_description TEXT;

-- 2. Create the spots table
CREATE TABLE IF NOT EXISTS spots (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cafe_id       UUID REFERENCES "cafés"(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  address       TEXT,
  walk_minutes  INT,
  tags          TEXT[],
  photo_url     TEXT
);

-- ============================================================
-- 3. Insert cafés
--    Run this only ONCE — it does not check for duplicates.
--    If you need to re-run, delete the rows first.
-- ============================================================
INSERT INTO "cafés" (name, adress, gps_lat, gps_lng, vibe_tags, type_tags, description, opening_hours, beer_name, beer_description)
VALUES
  (
    'Café Beveren',
    'Vlasmarkt 2, 2000 Antwerp',
    51.2202, 4.4029,
    ARRAY['authentic','lively','localFavorite'],
    ARRAY['brownCafe'],
    'Iconic brown café in the historic centre, famous for its Bolleke.',
    '{"mon":"11:00-01:00","tue":"11:00-01:00","wed":"11:00-01:00","thu":"11:00-02:00","fri":"11:00-03:00","sat":"11:00-03:00","sun":"11:00-01:00"}'::jsonb,
    'Bolleke De Koninck',
    'Antwerp amber ale with warm caramel notes. The city''s signature beer.'
  ),
  (
    'Den Engel',
    'Grote Markt 3, 2000 Antwerp',
    51.2212, 4.3997,
    ARRAY['authentic','lively','cozy'],
    ARRAY['brownCafe'],
    'Historic terrace café on the famous Grote Markt square.',
    '{"mon":"10:00-00:00","tue":"10:00-00:00","wed":"10:00-00:00","thu":"10:00-01:00","fri":"10:00-02:00","sat":"10:00-02:00","sun":"10:00-00:00"}'::jsonb,
    'Bolleke De Koninck',
    'Classic Antwerp amber — best enjoyed watching the square come alive.'
  ),
  (
    'Paters Vaetje',
    'Blauwmoezelstraat 1, 2000 Antwerp',
    51.2207, 4.4005,
    ARRAY['hiddenGem','authentic','cozy'],
    ARRAY['brownCafe'],
    'A hidden gem tucked away near the cathedral. Warm and welcoming.',
    '{}'::jsonb,
    'Westmalle Tripel',
    'Smooth Belgian Trappist tripel with a fruity finish.'
  ),
  (
    'Billie''s Bier Kafetaria',
    'Kammenstraat 12, 2000 Antwerp',
    51.2184, 4.4002,
    ARRAY['localFavorite','artsy','chill'],
    ARRAY['craftBeerBar'],
    'Eclectic craft beer bar in the heart of the fashion district.',
    '{}'::jsonb,
    'Rotating Craft Tap',
    'Always something new on tap — local and international craft beers.'
  ),
  (
    '''t Chauffeurke',
    'Sint-Jansvliet 4, 2000 Antwerp',
    51.2074, 4.3989,
    ARRAY['localFavorite','cozy','chill'],
    ARRAY['brownCafe'],
    'Small neighbourhood bar near the Schelde, loved by locals.',
    '{}'::jsonb,
    'De Koninck',
    'Antwerp''s favourite local amber, served straight from the tap.'
  ),
  (
    'De Muze',
    'Melkmarkt 15, 2000 Antwerp',
    51.2166, 4.4009,
    ARRAY['lively','artsy','localFavorite'],
    ARRAY['pub'],
    'Live jazz every week and a great beer selection in the city centre.',
    '{}'::jsonb,
    'Duvel',
    'Golden Belgian strong ale — dangerously drinkable.'
  ),
  (
    'Bar Paniek',
    'Kattendijkdok-Oostkaai 21B, 2000 Antwerp',
    51.2342, 4.4083,
    ARRAY['lively','lateNight','artsy'],
    ARRAY['pub'],
    'Concert venue and bar in the port area. Always something happening.',
    '{}'::jsonb,
    'Jupiler',
    'Easy-drinking Belgian lager — fuel for a long night out.'
  ),
  (
    'Dogma',
    'Wijngaardstraat 5, 2000 Antwerp',
    51.2165, 4.4061,
    ARRAY['authentic','chill','localFavorite'],
    ARRAY['brownCafe'],
    'Traditional Belgian café with a laid-back vibe and loyal regulars.',
    '{}'::jsonb,
    'Liefmans Goudenband',
    'Complex sour brown ale — a true Belgian classic.'
  ),
  (
    'Café Oud Arsenaal',
    'Maria Pijpelincxstraat 4, 2000 Antwerp',
    51.2164, 4.4093,
    ARRAY['hiddenGem','authentic','cozy'],
    ARRAY['brownCafe'],
    'Quiet neighbourhood café tucked into ''t Zuid. A real find.',
    '{}'::jsonb,
    'Tripel Karmeliet',
    'Smooth and fragrant Belgian tripel. Three grains, one great beer.'
  ),
  (
    'Kulminator',
    'Vleminckveld 32, 2000 Antwerp',
    51.2145, 4.4034,
    ARRAY['hiddenGem','authentic','localFavorite'],
    ARRAY['craftBeerBar'],
    'World-famous for its vast collection of rare and vintage Belgian beers.',
    '{}'::jsonb,
    'Vintage Westvleteren',
    'Rare aged abbey ale — a pilgrimage beer for serious enthusiasts.'
  ),
  (
    'Café Zeezicht',
    'Dageraadplaats 7-8, 2018 Antwerp',
    51.2073, 4.4307,
    ARRAY['localFavorite','cozy','chill'],
    ARRAY['brownCafe'],
    'Cosy neighbourhood café on the lively Dageraadplaats in Zurenborg.',
    '{}'::jsonb,
    'Duvel',
    'Golden Belgian strong ale — perfect for a sunny terrace afternoon.'
  ),
  (
    'BelRoy''s',
    'Lijnwaadmarkt 9, 2000 Antwerp',
    51.2167, 4.4022,
    ARRAY['authentic','cozy','localFavorite'],
    ARRAY['brownCafe'],
    'Classic Belgian brown café steps away from the cathedral.',
    '{}'::jsonb,
    'De Koninck',
    'The Antwerp classic, served the way it should be.'
  ),
  (
    'Vitrin',
    'Marnixplaats 14, 2000 Antwerp',
    51.2034, 4.4043,
    ARRAY['lively','artsy','chill'],
    ARRAY['cocktailBar'],
    'Trendy bar on Marnixplaats in ''t Zuid. Great cocktails and good music.',
    '{}'::jsonb,
    'House Cocktail',
    'Creative seasonal cocktails made with local spirits.'
  ),
  (
    'Bar Noord',
    'Viaductdam 1, 2060 Antwerp',
    51.2324, 4.4239,
    ARRAY['lively','localFavorite','artsy'],
    ARRAY['pub'],
    'Hip bar under the viaducts in Borgerhout. Young crowd, great vibe.',
    '{}'::jsonb,
    'Local Draft',
    'Rotating local taps — always something new to discover.'
  ),
  (
    'Café Pardaf',
    'Suikerrui 2, 2000 Antwerp',
    51.2165, 4.3983,
    ARRAY['authentic','cozy','hiddenGem'],
    ARRAY['brownCafe'],
    'Quiet and authentic café just off the Grote Markt. Easy to miss, hard to forget.',
    '{}'::jsonb,
    'Bolleke De Koninck',
    'The Antwerp classic, enjoyed at a slow pace.'
  );

-- ============================================================
-- 4. Insert spots (linked to cafés by name lookup)
--    Each café gets 3 nearby spots.
-- ============================================================
INSERT INTO spots (cafe_id, name, address, walk_minutes, tags)
VALUES
  -- Café Beveren
  ((SELECT id FROM "cafés" WHERE name = 'Café Beveren'), 'Cathedral of Our Lady', 'Handschoenmarkt, 2000 Antwerp', 2, ARRAY['historic','culture']),
  ((SELECT id FROM "cafés" WHERE name = 'Café Beveren'), 'Grote Markt', 'Grote Markt, 2000 Antwerp', 3, ARRAY['historic','culture']),
  ((SELECT id FROM "cafés" WHERE name = 'Café Beveren'), 'Vlaeykensgang', 'Oude Koornmarkt 16, 2000 Antwerp', 4, ARRAY['historic','hidden']),

  -- Den Engel
  ((SELECT id FROM "cafés" WHERE name = 'Den Engel'), 'City Hall', 'Grote Markt 1, 2000 Antwerp', 1, ARRAY['historic','culture']),
  ((SELECT id FROM "cafés" WHERE name = 'Den Engel'), 'Brabo Fountain', 'Grote Markt, 2000 Antwerp', 1, ARRAY['historic','culture']),
  ((SELECT id FROM "cafés" WHERE name = 'Den Engel'), 'Cathedral of Our Lady', 'Handschoenmarkt, 2000 Antwerp', 3, ARRAY['historic','culture']),

  -- Paters Vaetje
  ((SELECT id FROM "cafés" WHERE name = 'Paters Vaetje'), 'Cathedral of Our Lady', 'Handschoenmarkt, 2000 Antwerp', 2, ARRAY['historic','culture']),
  ((SELECT id FROM "cafés" WHERE name = 'Paters Vaetje'), 'Hands Monument', 'Suikerrui, 2000 Antwerp', 3, ARRAY['historic','culture']),
  ((SELECT id FROM "cafés" WHERE name = 'Paters Vaetje'), 'Groenplaats', 'Groenplaats, 2000 Antwerp', 4, ARRAY['historic','culture']),

  -- Billie's Bier Kafetaria
  ((SELECT id FROM "cafés" WHERE name = 'Billie''s Bier Kafetaria'), 'ModeMuseum (MoMu)', 'Nationalestraat 28, 2000 Antwerp', 3, ARRAY['culture','fashion']),
  ((SELECT id FROM "cafés" WHERE name = 'Billie''s Bier Kafetaria'), 'Kammenstraat', 'Kammenstraat, 2000 Antwerp', 1, ARRAY['shopping','fashion']),
  ((SELECT id FROM "cafés" WHERE name = 'Billie''s Bier Kafetaria'), 'Plantin-Moretus Museum', 'Vrijdagmarkt 22, 2000 Antwerp', 4, ARRAY['historic','culture']),

  -- 't Chauffeurke
  ((SELECT id FROM "cafés" WHERE name = '''t Chauffeurke'), 'KMSKA', 'Leopold De Waelplaats 2, 2000 Antwerp', 5, ARRAY['culture','art']),
  ((SELECT id FROM "cafés" WHERE name = '''t Chauffeurke'), 'Scheldt Riverbank', 'Scheldekaaien, 2000 Antwerp', 3, ARRAY['nature','views']),
  ((SELECT id FROM "cafés" WHERE name = '''t Chauffeurke'), 'Marnixplaats', 'Marnixplaats, 2000 Antwerp', 6, ARRAY['lively','neighbourhood']),

  -- De Muze
  ((SELECT id FROM "cafés" WHERE name = 'De Muze'), 'Carolus Borromeus Church', 'Hendrik Conscienceplein 6, 2000 Antwerp', 2, ARRAY['historic','culture']),
  ((SELECT id FROM "cafés" WHERE name = 'De Muze'), 'Meir', 'Meir, 2000 Antwerp', 3, ARRAY['shopping','culture']),
  ((SELECT id FROM "cafés" WHERE name = 'De Muze'), 'Groenplaats', 'Groenplaats, 2000 Antwerp', 4, ARRAY['historic','culture']),

  -- Bar Paniek
  ((SELECT id FROM "cafés" WHERE name = 'Bar Paniek'), 'MAS Museum', 'Hanzestedenplaats 1, 2000 Antwerp', 5, ARRAY['culture','views']),
  ((SELECT id FROM "cafés" WHERE name = 'Bar Paniek'), 'Port House', 'Zaha Hadidplein 1, 2000 Antwerp', 10, ARRAY['architecture','views']),
  ((SELECT id FROM "cafés" WHERE name = 'Bar Paniek'), 'Scheldt Quay', 'Scheldekaaien, 2000 Antwerp', 4, ARRAY['nature','views']),

  -- Dogma
  ((SELECT id FROM "cafés" WHERE name = 'Dogma'), 'Groenplaats', 'Groenplaats, 2000 Antwerp', 3, ARRAY['historic','culture']),
  ((SELECT id FROM "cafés" WHERE name = 'Dogma'), 'Rubens House', 'Wapper 9-11, 2000 Antwerp', 5, ARRAY['historic','culture']),
  ((SELECT id FROM "cafés" WHERE name = 'Dogma'), 'Meir', 'Meir, 2000 Antwerp', 5, ARRAY['shopping','culture']),

  -- Café Oud Arsenaal
  ((SELECT id FROM "cafés" WHERE name = 'Café Oud Arsenaal'), 'KMSKA', 'Leopold De Waelplaats 2, 2000 Antwerp', 3, ARRAY['culture','art']),
  ((SELECT id FROM "cafés" WHERE name = 'Café Oud Arsenaal'), 'Botanical Garden', 'Leopold De Waelstraat 35, 2000 Antwerp', 5, ARRAY['nature','culture']),
  ((SELECT id FROM "cafés" WHERE name = 'Café Oud Arsenaal'), '''t Zuid neighbourhood', 'Waalse Kaai, 2000 Antwerp', 4, ARRAY['neighbourhood','culture']),

  -- Kulminator
  ((SELECT id FROM "cafés" WHERE name = 'Kulminator'), 'Botanical Garden', 'Leopold De Waelstraat 35, 2000 Antwerp', 3, ARRAY['nature','culture']),
  ((SELECT id FROM "cafés" WHERE name = 'Kulminator'), 'Theaterplein', 'Theaterplein, 2000 Antwerp', 4, ARRAY['culture','lively']),
  ((SELECT id FROM "cafés" WHERE name = 'Kulminator'), 'Stadsschouwburg', 'Theaterplein 1, 2000 Antwerp', 5, ARRAY['culture','historic']),

  -- Café Zeezicht
  ((SELECT id FROM "cafés" WHERE name = 'Café Zeezicht'), 'Dageraadplaats', 'Dageraadplaats, 2018 Antwerp', 1, ARRAY['lively','neighbourhood']),
  ((SELECT id FROM "cafés" WHERE name = 'Café Zeezicht'), 'Cogels-Osylei', 'Cogels-Osylei, 2018 Antwerp', 3, ARRAY['historic','architecture']),
  ((SELECT id FROM "cafés" WHERE name = 'Café Zeezicht'), 'Zurenborg', 'Zurenborg, 2018 Antwerp', 4, ARRAY['neighbourhood','architecture']),

  -- BelRoy's
  ((SELECT id FROM "cafés" WHERE name = 'BelRoy''s'), 'Groenplaats', 'Groenplaats, 2000 Antwerp', 2, ARRAY['historic','culture']),
  ((SELECT id FROM "cafés" WHERE name = 'BelRoy''s'), 'Cathedral of Our Lady', 'Handschoenmarkt, 2000 Antwerp', 3, ARRAY['historic','culture']),
  ((SELECT id FROM "cafés" WHERE name = 'BelRoy''s'), 'Meir', 'Meir, 2000 Antwerp', 4, ARRAY['shopping','culture']),

  -- Vitrin
  ((SELECT id FROM "cafés" WHERE name = 'Vitrin'), 'FOMU Photo Museum', 'Waalse Kaai 47, 2000 Antwerp', 3, ARRAY['culture','art']),
  ((SELECT id FROM "cafés" WHERE name = 'Vitrin'), 'Scheldt Riverbank', 'Scheldekaaien, 2000 Antwerp', 4, ARRAY['nature','views']),
  ((SELECT id FROM "cafés" WHERE name = 'Vitrin'), 'KMSKA', 'Leopold De Waelplaats 2, 2000 Antwerp', 5, ARRAY['culture','art']),

  -- Bar Noord
  ((SELECT id FROM "cafés" WHERE name = 'Bar Noord'), 'Park Spoor Noord', 'Boomsesteenweg, 2060 Antwerp', 2, ARRAY['nature','lively']),
  ((SELECT id FROM "cafés" WHERE name = 'Bar Noord'), 'Skatepark Antwerp', 'Viaductdam, 2060 Antwerp', 3, ARRAY['sport','lively']),
  ((SELECT id FROM "cafés" WHERE name = 'Bar Noord'), 'Borgerhout Market', 'Turnhoutsebaan, 2060 Antwerp', 5, ARRAY['neighbourhood','culture']),

  -- Café Pardaf
  ((SELECT id FROM "cafés" WHERE name = 'Café Pardaf'), 'Sint-Pauluskerk', 'Sint-Paulusstraat 22, 2000 Antwerp', 3, ARRAY['historic','culture']),
  ((SELECT id FROM "cafés" WHERE name = 'Café Pardaf'), 'Falconplein', 'Falconplein, 2000 Antwerp', 4, ARRAY['neighbourhood','lively']),
  ((SELECT id FROM "cafés" WHERE name = 'Café Pardaf'), 'MAS Museum', 'Hanzestedenplaats 1, 2000 Antwerp', 5, ARRAY['culture','views']);
