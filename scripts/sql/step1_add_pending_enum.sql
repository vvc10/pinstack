-- Step 1: Add 'pending' status to pin_status enum
-- Run this command first in Supabase SQL Editor

ALTER TYPE pin_status ADD VALUE 'pending';
