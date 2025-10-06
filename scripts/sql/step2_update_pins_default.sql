-- Step 2: Update pins table default status
-- Run this command AFTER step 1 completes successfully

ALTER TABLE pins ALTER COLUMN status SET DEFAULT 'pending';
