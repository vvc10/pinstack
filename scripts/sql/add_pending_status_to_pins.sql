-- Pin Approval System Migration for Supabase
-- This file contains the complete migration for adding pin approval functionality

-- IMPORTANT: Run these commands in order, one at a time in Supabase SQL Editor:

-- Step 1: Add the new enum value (run this first and wait for it to complete)
ALTER TYPE pin_status ADD VALUE 'pending';

-- Step 2: Update the default status (run this after step 1 completes)
-- This ensures all new pins require admin approval
ALTER TABLE pins ALTER COLUMN status SET DEFAULT 'pending';

-- What this does:
-- - Adds 'pending' status to the pin_status enum
-- - Sets new pins to have 'pending' status by default
-- - Requires admin approval before pins become visible to public
-- - Existing published pins remain unchanged

-- Note: The enum value must be committed before it can be used in the next command
-- This is why we run them separately in Supabase
