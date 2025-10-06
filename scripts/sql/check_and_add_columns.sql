-- Check and add URL and Figma code columns to pins table
-- Run this in your Supabase SQL editor

-- Check current table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'pins' 
ORDER BY ordinal_position;

-- Add url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pins' AND column_name = 'url'
    ) THEN
        ALTER TABLE pins ADD COLUMN url TEXT;
        RAISE NOTICE 'Added url column to pins table';
    ELSE
        RAISE NOTICE 'url column already exists in pins table';
    END IF;
END $$;

-- Add figma_code column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pins' AND column_name = 'figma_code'
    ) THEN
        ALTER TABLE pins ADD COLUMN figma_code TEXT;
        RAISE NOTICE 'Added figma_code column to pins table';
    ELSE
        RAISE NOTICE 'figma_code column already exists in pins table';
    END IF;
END $$;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'pins' 
AND column_name IN ('url', 'figma_code')
ORDER BY column_name;
