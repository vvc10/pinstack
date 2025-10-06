-- Update boards table to include is_public column
ALTER TABLE public.boards 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT TRUE;

-- Update existing boards to be public by default
UPDATE public.boards 
SET is_public = TRUE 
WHERE is_public IS NULL;
