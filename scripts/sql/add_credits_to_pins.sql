-- Add credits column to pins table
-- This allows pins to have credit information for attribution

ALTER TABLE pins ADD COLUMN credits TEXT;
