-- Add component_category column to pins table
-- This script safely adds the component_category column if it doesn't exist

DO $$
BEGIN
    -- Check if component_category column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'pins' 
        AND column_name = 'component_category'
    ) THEN
        -- Add the component_category column
        ALTER TABLE pins ADD COLUMN component_category TEXT;
        
        -- Add a comment to describe the column
        COMMENT ON COLUMN pins.component_category IS 'Component category for UI components (e.g., Hero Sections, Cards, etc.)';
        
        RAISE NOTICE 'component_category column added successfully to pins table';
    ELSE
        RAISE NOTICE 'component_category column already exists in pins table';
    END IF;
END $$;
