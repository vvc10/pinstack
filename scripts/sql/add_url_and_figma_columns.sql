-- Add URL and Figma code columns to pins table
-- This allows pins to have URL input and Figma file code

-- Check if columns exist before adding them
DO $$ 
BEGIN
    -- Add url column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pins' AND column_name = 'url'
    ) THEN
        ALTER TABLE pins ADD COLUMN url TEXT;
    END IF;

    -- Add figma_code column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pins' AND column_name = 'figma_code'
    ) THEN
        ALTER TABLE pins ADD COLUMN figma_code TEXT;
    END IF;
END $$;
