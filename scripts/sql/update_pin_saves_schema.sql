-- Update pin_saves table to allow general saves (without board_id)
-- This allows users to save pins to a general "saved" collection

-- First, drop the existing unique constraint that requires board_id
ALTER TABLE pin_saves DROP CONSTRAINT IF EXISTS pin_saves_pin_id_user_id_board_id_key;

-- Make board_id nullable
ALTER TABLE pin_saves ALTER COLUMN board_id DROP NOT NULL;

-- Add a new unique constraint that allows multiple saves per pin per user
-- but only one per board (or one general save without board)
-- We'll handle this with a partial unique index instead

-- Create a partial unique index for general saves (board_id IS NULL)
CREATE UNIQUE INDEX IF NOT EXISTS pin_saves_general_unique 
ON pin_saves (pin_id, user_id) 
WHERE board_id IS NULL;

-- Create a partial unique index for board-specific saves
CREATE UNIQUE INDEX IF NOT EXISTS pin_saves_board_unique 
ON pin_saves (pin_id, user_id, board_id) 
WHERE board_id IS NOT NULL;

-- Add a check constraint to ensure a pin can only be saved once per user
-- either generally (board_id IS NULL) or to specific boards
-- This will be enforced by the application logic
