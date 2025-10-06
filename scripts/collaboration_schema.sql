-- Create board_collaborators table for managing board access
CREATE TABLE IF NOT EXISTS public.board_collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid REFERENCES public.boards(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  email text NOT NULL, -- Store email for pending invitations
  role text NOT NULL DEFAULT 'viewer', -- 'viewer', 'editor', 'admin'
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'declined'
  invited_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  invited_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(board_id, user_id),
  UNIQUE(board_id, email)
);

-- Enable RLS on board_collaborators table
ALTER TABLE public.board_collaborators ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for board_collaborators
DROP POLICY IF EXISTS "board_collaborators_select_owner_and_collaborators" ON public.board_collaborators;
CREATE POLICY "board_collaborators_select_owner_and_collaborators"
  ON public.board_collaborators FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.boards b 
      WHERE b.id = board_id AND b.owner_id = auth.uid()
    ) OR
    user_id = auth.uid() OR
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "board_collaborators_modify_owner" ON public.board_collaborators;
CREATE POLICY "board_collaborators_modify_owner"
  ON public.board_collaborators FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.boards b 
      WHERE b.id = board_id AND b.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.boards b 
      WHERE b.id = board_id AND b.owner_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_board_collaborators_board_id ON public.board_collaborators(board_id);
CREATE INDEX IF NOT EXISTS idx_board_collaborators_user_id ON public.board_collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_board_collaborators_email ON public.board_collaborators(email);
CREATE INDEX IF NOT EXISTS idx_board_collaborators_status ON public.board_collaborators(status);

-- Add share_token column to boards table for shareable URLs
ALTER TABLE public.boards 
ADD COLUMN IF NOT EXISTS share_token text UNIQUE;

-- Generate share tokens for existing boards
UPDATE public.boards 
SET share_token = gen_random_uuid()::text
WHERE share_token IS NULL;

-- Create index for share_token
CREATE INDEX IF NOT EXISTS idx_boards_share_token ON public.boards(share_token);
