-- Fix storage policies for stage-documents bucket
-- First drop existing policies, then recreate them

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can upload stage documents" ON storage.objects;
DROP POLICY IF EXISTS "No one can view stage documents publicly" ON storage.objects;

-- Create new policies for better access control

-- Allow inserting stage documents 
CREATE POLICY "Allow upload stage documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'stage-documents');

-- Allow reading stage documents (needed for email attachments and admin access)
CREATE POLICY "Allow read stage documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'stage-documents');

-- Allow updating stage documents metadata if needed
CREATE POLICY "Allow update stage documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'stage-documents');

-- Allow deleting stage documents if needed for cleanup
CREATE POLICY "Allow delete stage documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'stage-documents');