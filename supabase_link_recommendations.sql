-- Link existing recommendations to cafés via cafe_name match
-- Run in Supabase → SQL Editor

UPDATE recommendations r
SET cafe_id = c.id
FROM "cafés" c
WHERE r.cafe_id IS NULL
  AND (
    LOWER(r.cafe_name) = LOWER(c.name)
    OR LOWER(r.location) = LOWER(c.name)
  );

-- Check result: how many are still unlinked?
SELECT id, name, cafe_name, location, cafe_id
FROM recommendations
WHERE cafe_id IS NULL;
