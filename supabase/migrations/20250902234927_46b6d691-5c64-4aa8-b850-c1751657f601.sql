-- Create storage bucket for stage applications documents
INSERT INTO storage.buckets (id, name, public) VALUES ('stage-documents', 'stage-documents', false);

-- Create applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stage_id TEXT NOT NULL,
  nom TEXT NOT NULL,
  prenoms TEXT NOT NULL,
  sexe TEXT NOT NULL CHECK (sexe IN ('masculin', 'feminin')),
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  ecole TEXT NOT NULL,
  universite TEXT,
  filiere TEXT NOT NULL,
  annee_etude TEXT NOT NULL,
  temps_stage TEXT NOT NULL,
  date_debut DATE NOT NULL,
  lettre_demande_url TEXT,
  lettre_motivation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create policies for applications (public can insert, no one can select/update/delete for privacy)
CREATE POLICY "Anyone can submit applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (true);

-- Create storage policies for stage documents
CREATE POLICY "Anyone can upload stage documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'stage-documents');

CREATE POLICY "No one can view stage documents publicly" 
ON storage.objects 
FOR SELECT 
USING (false);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();