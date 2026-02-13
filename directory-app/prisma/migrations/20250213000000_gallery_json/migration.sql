-- Convert gallery from String[] to JSONB step by step
-- Step 1: Add new JSONB column
ALTER TABLE businesses ADD COLUMN gallery_new JSONB DEFAULT '[]'::JSONB;

-- Step 2: Copy data (convert string array to json array format)
UPDATE businesses SET gallery_new = '[]'::JSONB WHERE gallery IS NULL;
UPDATE businesses SET gallery_new = to_jsonb(gallery) WHERE gallery IS NOT NULL;

-- Step 3: Drop old column
ALTER TABLE businesses DROP COLUMN gallery;

-- Step 4: Rename new column
ALTER TABLE businesses RENAME COLUMN gallery_new TO gallery;

-- Step 5: Set not null
ALTER TABLE businesses ALTER COLUMN gallery SET NOT NULL;
