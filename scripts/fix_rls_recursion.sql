-- FIX INFINITE RECURSION IN RLS POLICIES
-- The previous policies had circular dependencies, let's fix them

-- 1. Fix boards table policies (remove recursion)
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on boards table
DROP POLICY IF EXISTS "boards_select_owner_or_collaborator" ON public.boards;
DROP POLICY IF EXISTS "boards_insert_owner" ON public.boards;
DROP POLICY IF EXISTS "boards_update_owner" ON public.boards;
DROP POLICY IF EXISTS "boards_delete_owner" ON public.boards;
DROP POLICY IF EXISTS "boards_select_owner" ON public.boards;
DROP POLICY IF EXISTS "boards_select_public" ON public.boards;

-- Create simple, non-recursive policies for boards
CREATE POLICY "boards_select_owner"
  ON public.boards FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "boards_select_public"
  ON public.boards FOR SELECT
  TO authenticated
  USING (is_public = true);

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

-- 2. Fix board_collaborators table policies
ALTER TABLE public.board_collaborators ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on board_collaborators table
DROP POLICY IF EXISTS "board_collaborators_select_owner_or_collaborator" ON public.board_collaborators;
DROP POLICY IF EXISTS "board_collaborators_insert_owner" ON public.board_collaborators;
DROP POLICY IF EXISTS "board_collaborators_delete_owner" ON public.board_collaborators;
DROP POLICY IF EXISTS "board_collaborators_select_owner" ON public.board_collaborators;
DROP POLICY IF EXISTS "board_collaborators_select_self" ON public.board_collaborators;

-- Create simple policies for board_collaborators
CREATE POLICY "board_collaborators_select_owner"
  ON public.board_collaborators FOR SELECT
  TO authenticated
  USING (
    board_id IN (
      SELECT id FROM public.boards WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "board_collaborators_select_self"
  ON public.board_collaborators FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

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

-- 3. Fix board_pins table policies
ALTER TABLE public.board_pins ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on board_pins table
DROP POLICY IF EXISTS "board_pins_select_owner_or_collaborator" ON public.board_pins;
DROP POLICY IF EXISTS "board_pins_insert_owner_or_collaborator" ON public.board_pins;
DROP POLICY IF EXISTS "board_pins_delete_owner_or_collaborator" ON public.board_pins;
DROP POLICY IF EXISTS "board_pins_select_owner" ON public.board_pins;
DROP POLICY IF EXISTS "board_pins_insert_owner" ON public.board_pins;
DROP POLICY IF EXISTS "board_pins_delete_owner" ON public.board_pins;

-- Create simple policies for board_pins
CREATE POLICY "board_pins_select_owner"
  ON public.board_pins FOR SELECT
  TO authenticated
  USING (
    board_id IN (
      SELECT id FROM public.boards WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "board_pins_insert_owner"
  ON public.board_pins FOR INSERT
  TO authenticated
  WITH CHECK (
    board_id IN (
      SELECT id FROM public.boards WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "board_pins_delete_owner"
  ON public.board_pins FOR DELETE
  TO authenticated
  USING (
    board_id IN (
      SELECT id FROM public.boards WHERE owner_id = auth.uid()
    )
  );

-- 4. Keep users table policies simple
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on users table
DROP POLICY IF EXISTS "users_select_authenticated" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "users_insert_own" ON public.users;
DROP POLICY IF EXISTS "users_select_all" ON public.users;

-- Create simple policies for users
CREATE POLICY "users_select_all"
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

-- 5. Keep pins table policies simple
ALTER TABLE public.pins ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on pins table
DROP POLICY IF EXISTS "pins_select_public" ON public.pins;
DROP POLICY IF EXISTS "pins_insert_authenticated" ON public.pins;
DROP POLICY IF EXISTS "pins_update_author" ON public.pins;
DROP POLICY IF EXISTS "pins_delete_author" ON public.pins;
DROP POLICY IF EXISTS "pins_select_all" ON public.pins;

-- Create simple policies for pins
CREATE POLICY "pins_select_all"
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

-- Check the status
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

SELECT 'RLS policies fixed - no more recursion!' as result;
