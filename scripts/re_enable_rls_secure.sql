-- RE-ENABLE RLS WITH PROPER SECURE POLICIES
-- This will restore security while keeping the collaborators feature working

-- 1. Re-enable RLS on users table with proper policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies on users table
DROP POLICY IF EXISTS "users_allow_authenticated_read" ON public.users;
DROP POLICY IF EXISTS "users_allow_own_read" ON public.users;
DROP POLICY IF EXISTS "users_allow_own_update" ON public.users;
DROP POLICY IF EXISTS "users_allow_own_insert" ON public.users;

-- Create secure policies for users table
CREATE POLICY "users_select_authenticated"
  ON public.users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_insert_own"
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 2. Re-enable RLS on boards table
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies on boards table
DROP POLICY IF EXISTS "boards_select_owner_or_public" ON public.boards;
DROP POLICY IF EXISTS "boards_insert_owner" ON public.boards;
DROP POLICY IF EXISTS "boards_update_owner" ON public.boards;
DROP POLICY IF EXISTS "boards_delete_owner" ON public.boards;

-- Create secure policies for boards table
CREATE POLICY "boards_select_owner_or_collaborator"
  ON public.boards FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid() OR 
    id IN (
      SELECT board_id FROM public.board_collaborators 
      WHERE user_id = auth.uid() AND status = 'accepted'
    )
  );

CREATE POLICY "boards_insert_owner"
  ON public.boards FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "boards_update_owner"
  ON public.boards FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "boards_delete_owner"
  ON public.boards FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- 3. Re-enable RLS on board_collaborators table
ALTER TABLE public.board_collaborators ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies on board_collaborators table
DROP POLICY IF EXISTS "board_collaborators_select_owner_or_collaborator" ON public.board_collaborators;
DROP POLICY IF EXISTS "board_collaborators_insert_owner" ON public.board_collaborators;
DROP POLICY IF EXISTS "board_collaborators_delete_owner" ON public.board_collaborators;

-- Create secure policies for board_collaborators table
CREATE POLICY "board_collaborators_select_owner_or_collaborator"
  ON public.board_collaborators FOR SELECT
  TO authenticated
  USING (
    board_id IN (
      SELECT id FROM public.boards WHERE owner_id = auth.uid()
    ) OR
    user_id = auth.uid()
  );

CREATE POLICY "board_collaborators_insert_owner"
  ON public.board_collaborators FOR INSERT
  TO authenticated
  WITH CHECK (
    board_id IN (
      SELECT id FROM public.boards WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "board_collaborators_delete_owner"
  ON public.board_collaborators FOR DELETE
  TO authenticated
  USING (
    board_id IN (
      SELECT id FROM public.boards WHERE owner_id = auth.uid()
    )
  );

-- 4. Re-enable RLS on board_pins table
ALTER TABLE public.board_pins ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies on board_pins table
DROP POLICY IF EXISTS "board_pins_select_owner_or_collaborator" ON public.board_pins;
DROP POLICY IF EXISTS "board_pins_insert_owner_or_collaborator" ON public.board_pins;
DROP POLICY IF EXISTS "board_pins_delete_owner_or_collaborator" ON public.board_pins;

-- Create secure policies for board_pins table
CREATE POLICY "board_pins_select_owner_or_collaborator"
  ON public.board_pins FOR SELECT
  TO authenticated
  USING (
    board_id IN (
      SELECT id FROM public.boards WHERE owner_id = auth.uid()
    ) OR
    board_id IN (
      SELECT board_id FROM public.board_collaborators 
      WHERE user_id = auth.uid() AND status = 'accepted'
    )
  );

CREATE POLICY "board_pins_insert_owner_or_collaborator"
  ON public.board_pins FOR INSERT
  TO authenticated
  WITH CHECK (
    board_id IN (
      SELECT id FROM public.boards WHERE owner_id = auth.uid()
    ) OR
    board_id IN (
      SELECT board_id FROM public.board_collaborators 
      WHERE user_id = auth.uid() AND status = 'accepted'
    )
  );

CREATE POLICY "board_pins_delete_owner_or_collaborator"
  ON public.board_pins FOR DELETE
  TO authenticated
  USING (
    board_id IN (
      SELECT id FROM public.boards WHERE owner_id = auth.uid()
    ) OR
    board_id IN (
      SELECT board_id FROM public.board_collaborators 
      WHERE user_id = auth.uid() AND status = 'accepted'
    )
  );

-- 5. Re-enable RLS on pins table
ALTER TABLE public.pins ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies on pins table
DROP POLICY IF EXISTS "pins_select_public" ON public.pins;
DROP POLICY IF EXISTS "pins_insert_authenticated" ON public.pins;
DROP POLICY IF EXISTS "pins_update_author" ON public.pins;
DROP POLICY IF EXISTS "pins_delete_author" ON public.pins;

-- Create secure policies for pins table
CREATE POLICY "pins_select_public"
  ON public.pins FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "pins_insert_authenticated"
  ON public.pins FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "pins_update_author"
  ON public.pins FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "pins_delete_author"
  ON public.pins FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

-- Check the status of all tables
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity THEN 'RLS ENABLED' 
        ELSE 'RLS DISABLED' 
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'boards', 'board_collaborators', 'board_pins', 'pins')
ORDER BY tablename;

-- Show all policies
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'boards', 'board_collaborators', 'board_pins', 'pins')
ORDER BY tablename, policyname;

SELECT 'RLS re-enabled with secure policies!' as result;
