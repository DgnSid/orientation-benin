-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.applications;

-- Créer une nouvelle politique pour permettre les insertions publiques
CREATE POLICY "Enable public insert for applications" 
ON public.applications 
FOR INSERT 
TO public
WITH CHECK (true);

-- Créer une politique pour permettre la lecture des applications (pour l'admin)
CREATE POLICY "Enable read for applications" 
ON public.applications 
FOR SELECT 
TO public
USING (true);