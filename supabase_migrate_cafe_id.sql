-- Fix recommendations.cafe_id column type to UUID
-- (Supabase creates cafés.id as UUID, so cafe_id must match)
-- Run this in Supabase → SQL Editor

-- Drop and recreate as UUID (safe since all existing cafe_ids are NULL)
ALTER TABLE recommendations DROP COLUMN IF EXISTS cafe_id;
ALTER TABLE recommendations ADD COLUMN cafe_id UUID REFERENCES "cafés"(id);
