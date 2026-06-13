-- ============================================================
-- Update photo_url for all 45 spots
-- ============================================================

-- Café Beveren
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/Cathedral-of-Our-Lady-Antwerp-in-Belgium.jpg' WHERE name = 'Cathedral of Our Lady' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Café Beveren');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/de-grote-markt-in-antwerpen.jpg' WHERE name = 'Grote Markt' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Café Beveren');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/vlaeykensgang-straatje-antwerpen.jpg' WHERE name = 'Vlaeykensgang' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Café Beveren');

-- Den Engel
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/Antwerpen_Stadhuis_crop1_2006-05-28.jpg' WHERE name = 'City Hall' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Den Engel');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/1000_F_314811668_7FhcblzoBcLzvb50hw6C3CfSeQ7Omu9j.jpg' WHERE name = 'Brabo Fountain' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Den Engel');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/Cathedral-of-Our-Lady-Antwerp-in-Belgium.jpg' WHERE name = 'Cathedral of Our Lady' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Den Engel');

-- Paters Vaetje
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/Cathedral-of-Our-Lady-Antwerp-in-Belgium.jpg' WHERE name = 'Cathedral of Our Lady' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Paters Vaetje');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/hand-op-de-meir.jpg' WHERE name = 'Hands Monument' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Paters Vaetje');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/Cathedral-of-Our-Lady-Antwerp-in-Belgium.jpg' WHERE name = 'Groenplaats' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Paters Vaetje');

-- Billie's Bier Kafetaria
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/momu5.jpg' WHERE name = 'ModeMuseum (MoMu)' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Billie''s Bier Kafetaria');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/cool-street.jpg' WHERE name = 'Kammenstraat' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Billie''s Bier Kafetaria');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/0c893004-09c6-4110-aac4-02035a174917.avif' WHERE name = 'Plantin-Moretus Museum' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Billie''s Bier Kafetaria');

-- 't Chauffeurke
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/Voorgevel-KMSKA-2-web-1.jpg' WHERE name = 'KMSKA' AND cafe_id = (SELECT id FROM "cafés" WHERE name = '''t Chauffeurke');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/inspire-scheldt-river-belgium.jpg' WHERE name = 'Scheldt Riverbank' AND cafe_id = (SELECT id FROM "cafés" WHERE name = '''t Chauffeurke');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/de-gele-lijnen-rond-het-perk-tonen-aan-dat-er-eigenlijk-niet-geparkeerd-mag-worden-maar-daar-wordt-vooral-s-avonds-weinig-rekening-mee-gehouden.webp' WHERE name = 'Marnixplaats' AND cafe_id = (SELECT id FROM "cafés" WHERE name = '''t Chauffeurke');

-- De Muze
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/Aangepast%20Interieur_x173.31%20OKV2017-021-Carolus%20Borromeuskerk.jpg' WHERE name = 'Carolus Borromeus Church' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'De Muze');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/antwerps-meir-the-prestigious-and-vibrant-main-shopping-street-in-the-city-in-belgium-north-europe-2APKCAG.jpg' WHERE name = 'Meir' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'De Muze');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/Cathedral-of-Our-Lady-Antwerp-in-Belgium.jpg' WHERE name = 'Groenplaats' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'De Muze');

-- Bar Paniek
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/MAS_Antwerpen_2016-05_--1.jpg' WHERE name = 'MAS Museum' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Bar Paniek');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/istockphoto-1441808906-612x612.jpg' WHERE name = 'Port House' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Bar Paniek');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/scheldq.jpg' WHERE name = 'Scheldt Quay' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Bar Paniek');

-- Dogma
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/Cathedral-of-Our-Lady-Antwerp-in-Belgium.jpg' WHERE name = 'Groenplaats' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Dogma');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/antwerpen-rubens-gebaeude-museum.jpeg' WHERE name = 'Rubens House' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Dogma');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/antwerps-meir-the-prestigious-and-vibrant-main-shopping-street-in-the-city-in-belgium-north-europe-2APKCAG.jpg' WHERE name = 'Meir' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Dogma');

-- Café Oud Arsenaal
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/Voorgevel-KMSKA-2-web-1.jpg' WHERE name = 'KMSKA' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Café Oud Arsenaal');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/Botanical-Garden.jpg' WHERE name = 'Botanical Garden' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Café Oud Arsenaal');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/antwerpen-zuid.jpg' WHERE name = '''t Zuid neighbourhood' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Café Oud Arsenaal');

-- Kulminator
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/Botanical-Garden.jpg' WHERE name = 'Botanical Garden' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Kulminator');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/https___www.vai.be_volumes_general_gebouwen_theaterplein-en-omgeving_20110306_JAAR_PROJ14_03.f1589183065.avif' WHERE name = 'Theaterplein' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Kulminator');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/3027-img-desktop-stadsschouwburg-antwerpen2x__ScaleMaxWidthWzQyMF0_CompressedW10.jpg' WHERE name = 'Stadsschouwburg' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Kulminator');

-- Café Zeezicht
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/Dageraadplaats-5.webp' WHERE name = 'Dageraadplaats' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Café Zeezicht');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/cogels-osy-lei.jpg' WHERE name = 'Cogels-Osylei' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Café Zeezicht');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/cogels-osylei.jpg' WHERE name = 'Zurenborg' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Café Zeezicht');

-- BelRoy's
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/Cathedral-of-Our-Lady-Antwerp-in-Belgium.jpg' WHERE name = 'Groenplaats' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'BelRoy''s');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/Cathedral-of-Our-Lady-Antwerp-in-Belgium.jpg' WHERE name = 'Cathedral of Our Lady' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'BelRoy''s');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/antwerps-meir-the-prestigious-and-vibrant-main-shopping-street-in-the-city-in-belgium-north-europe-2APKCAG.jpg' WHERE name = 'Meir' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'BelRoy''s');

-- Vitrin
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/fomu_1627654173.webp' WHERE name = 'FOMU Photo Museum' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Vitrin');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/scheldq.jpg' WHERE name = 'Scheldt Riverbank' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Vitrin');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/Voorgevel-KMSKA-2-web-1.jpg' WHERE name = 'KMSKA' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Vitrin');

-- Bar Noord
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/881406aeef3c29ec3512e76ebf23aeafbea66195ecbe3ac04fc6dfd235173571.jpg' WHERE name = 'Park Spoor Noord' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Bar Noord');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/27IMG_20160503_132654.jpg' WHERE name = 'Skatepark Antwerp' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Bar Noord');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/38d8c30e-12dd-11ea-9b34-8df2c6ad6e7f_web_scale_0.075358_0.075358__.jpg' WHERE name = 'Borgerhout Market' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Bar Noord');

-- Café Pardaf
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/DSC00482.webp' WHERE name = 'Sint-Pauluskerk' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Café Pardaf');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/Falconplein%20Antwerpen%20-%20Hero%20image.jpg' WHERE name = 'Falconplein' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Café Pardaf');
UPDATE spots SET photo_url = 'https://kxbcmhntcgskcbduezpu.supabase.co/storage/v1/object/public/spots/MAS_Antwerpen_2016-05_--1.jpg' WHERE name = 'MAS Museum' AND cafe_id = (SELECT id FROM "cafés" WHERE name = 'Café Pardaf');
