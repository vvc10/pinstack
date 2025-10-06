-- Add only the missing RLS policies for users table
-- This is a safe script that only adds policies, no schema changes

-- Check if policies already exist and drop them first
DO $$
BEGIN
    -- Drop existing policies if they exist
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users are public for reading') THEN
        DROP POLICY "Users are public for reading" ON users;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can create own profile') THEN
        DROP POLICY "Users can create own profile" ON users;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update own profile') THEN
        DROP POLICY "Users can update own profile" ON users;
    END IF;
END $$;

-- Create the policies
CREATE POLICY "Users are public for reading" ON users FOR SELECT USING (true);
CREATE POLICY "Users can create own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
