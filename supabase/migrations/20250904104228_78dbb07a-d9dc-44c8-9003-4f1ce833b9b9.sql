-- Fix storage policies for stage-documents bucket
-- Allow reading stage documents for applications and admin purposes

-- Drop the overly restrictive SELECT policy
DROP POLICY "No one can view stage documents publicly" ON storage.objects;

-- Create new policies for better access control

-- Allow inserting stage documents (already exists but recreating for clarity)
CREATE POLICY "Anyone can upload stage documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'stage-documents');

-- Allow reading stage documents by anyone (needed for email attachments and admin access)
-- In production, you might want to restrict this further
CREATE POLICY "Allow reading stage documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'stage-documents');

-- Allow updating stage documents metadata if needed
CREATE POLICY "Allow updating stage documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'stage-documents');