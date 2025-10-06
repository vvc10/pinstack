-- Check current pin statuses in the database
-- This will help us understand why pins are showing as "not found"

SELECT 
  id,
  title,
  status,
  author_id,
  created_at
FROM pins 
ORDER BY created_at DESC 
LIMIT 10;
