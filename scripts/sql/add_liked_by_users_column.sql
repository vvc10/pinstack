-- Add liked_by_users column to pins table
-- This column will store an array of user IDs who have liked the pin

ALTER TABLE pins 
ADD COLUMN IF NOT EXISTS liked_by_users TEXT[] DEFAULT '{}';

-- Create an index for better performance when querying liked users
CREATE INDEX IF NOT EXISTS idx_pins_liked_by_users ON pins USING GIN (liked_by_users);

-- Update existing pins to have empty array if they don't have the column
UPDATE pins 
SET liked_by_users = '{}' 
WHERE liked_by_users IS NULL;

-- Optional: Migrate existing like_count data to the new format
-- This would require a separate migration script if you have existing like data
-- For now, we'll start fresh with the new system
