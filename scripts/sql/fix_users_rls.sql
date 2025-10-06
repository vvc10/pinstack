-- Fix missing RLS policies for users table
-- This file adds the missing Row Level Security policies for the users table

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users are public for reading" ON users;
DROP POLICY IF EXISTS "Users can create own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Users are public for reading
CREATE POLICY "Users are public for reading" ON users FOR SELECT USING (true);

-- Users can create their own profile
CREATE POLICY "Users can create own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
