-- Approve all pending pins for testing
-- This will make all pending pins visible to everyone

UPDATE pins 
SET status = 'published' 
WHERE status = 'pending';
