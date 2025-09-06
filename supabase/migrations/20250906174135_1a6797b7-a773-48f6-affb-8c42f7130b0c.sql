-- Fix critical security issue: Remove overly permissive RLS policies on applications table
-- This prevents public access to sensitive student personal information

-- Drop the dangerous public read policy that exposes all student data
DROP POLICY IF EXISTS "Enable read for applications" ON public.applications;

-- Drop the public update policy - applicants shouldn't modify submitted applications
DROP POLICY IF EXISTS "Enable public update for applications" ON public.applications;

-- Keep only the insert policy for public application submissions
-- The "Enable public insert for applications" policy will remain to allow submissions

-- Note: This means application data will only be accessible via:
-- 1. Direct database access by administrators
-- 2. Server-side functions with service role keys
-- 3. Future admin-only RLS policies if needed