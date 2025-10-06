-- Simple Storage policies for pin-images bucket
-- Run this after creating the 'pin-images' bucket in Supabase Storage

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for pin images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload pin images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own pin images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own pin images" ON storage.objects;

-- Allow public read access to all images
CREATE POLICY "Public read access for pin images" ON storage.objects
FOR SELECT USING (bucket_id = 'pin-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload pin images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'pin-images' 
    AND auth.role() = 'authenticated'
);

-- Allow users to update their own images
CREATE POLICY "Users can update their own pin images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'pin-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own pin images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'pin-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);
