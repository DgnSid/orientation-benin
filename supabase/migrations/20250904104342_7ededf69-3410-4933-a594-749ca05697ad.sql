-- Add UPDATE policy for applications table
-- This is needed to update the lettre_demande_url after file upload

CREATE POLICY "Enable public update for applications" 
ON public.applications 
FOR UPDATE 
USING (true)
WITH CHECK (true);