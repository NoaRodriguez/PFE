CREATE EXTENSION IF NOT EXISTS vector;

-- 1. CRÉATION DES TABLES

CREATE TABLE IF NOT EXISTS public.profil_utilisateur (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id),
  prenom text,
  poids integer,
  taille integer,
  objectifs text,
  sports text,
  frequence_entrainement text,
  genre text,
  date_naissance date
);

CREATE TABLE IF NOT EXISTS public.seance (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  date_creation timestamp with time zone DEFAULT now(),
  id_utilisateur uuid NOT NULL REFERENCES auth.users(id),
  date timestamp without time zone,
  sport text,
  titre text,
  type text,
  durée integer,
  description text,
  intensité smallint,
  période_journée text
);

CREATE TABLE IF NOT EXISTS public.competition (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  date_creation timestamp with time zone DEFAULT now(),
  id_utilisateur uuid REFERENCES auth.users(id),
  date timestamp without time zone,
  sport text,
  durée integer,
  distance integer,
  intensité integer
);

CREATE TABLE IF NOT EXISTS public.macronutriment (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id),
  date timestamp without time zone NOT NULL,
  proteine real,
  lipide real,
  glucide real
);

CREATE TABLE IF NOT EXISTS public.conseil_jour (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  date_creation timestamp with time zone DEFAULT now(),
  date timestamp without time zone,
  conseil text,
  id_utilisateur uuid REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.conseil_semaine (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  date_creation timestamp with time zone DEFAULT now(),
  conseil text,
  id_utilisateur uuid REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.conseil_seance (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  date_creation timestamp with time zone DEFAULT now(),
  id_seance bigint NOT NULL REFERENCES public.seance(id),
  conseil_avant character varying,
  conseil_pendant character varying,
  conseil_apres character varying
);

CREATE TABLE IF NOT EXISTS public.nutrition (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  content text NOT NULL,
  embedding vector(1536), -- Assurez-vous que l'extension pgvector est activée
  metadata jsonb
);

-- 2. ACTIVATION DE LA SÉCURITÉ (RLS)

ALTER TABLE public.profil_utilisateur ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.macronutriment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conseil_jour ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conseil_semaine ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conseil_seance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition ENABLE ROW LEVEL SECURITY;

-- 3. CRÉATION DES POLITIQUES (POLICIES)

-- Profil Utilisateur : Accès propre uniquement
CREATE POLICY profil_utilisateur_all ON public.profil_utilisateur 
FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Séances : Accès propre uniquement
CREATE POLICY seance_all ON public.seance 
FOR ALL TO authenticated USING (auth.uid() = id_utilisateur) WITH CHECK (auth.uid() = id_utilisateur);

-- Compétitions : Accès propre uniquement
CREATE POLICY competition_all ON public.competition 
FOR ALL TO authenticated USING (auth.uid() = id_utilisateur) WITH CHECK (auth.uid() = id_utilisateur);

-- Macronutriments : Accès propre uniquement
CREATE POLICY macronutriments_all ON public.macronutriment 
FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Conseils Quotidiens : Accès propre uniquement
CREATE POLICY conseil_jour_all ON public.conseil_jour 
FOR ALL TO authenticated USING (auth.uid() = id_utilisateur) WITH CHECK (auth.uid() = id_utilisateur);

-- Conseils Hebdomadaires : Accès propre uniquement
CREATE POLICY conseil_semaine_all ON public.conseil_semaine 
FOR ALL TO authenticated USING (auth.uid() = id_utilisateur) WITH CHECK (auth.uid() = id_utilisateur);

-- Conseils de Séance : Accès basé sur la propriété de la séance liée
CREATE POLICY conseil_seance_all ON public.conseil_seance 
FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM seance WHERE seance.id = conseil_seance.id_seance AND seance.id_utilisateur = auth.uid())) 
WITH CHECK (EXISTS (SELECT 1 FROM seance WHERE seance.id = conseil_seance.id_seance AND seance.id_utilisateur = auth.uid()));

-- Table Nutrition : Lecture pour tous, modification pour le service_role uniquement
CREATE POLICY "Les utilisateurs authentifiés peuvent lire les connaissances" 
ON public.nutrition FOR SELECT TO authenticated USING (true);

CREATE POLICY "Seul le service_role peut modifier la table" 
ON public.nutrition FOR ALL TO service_role USING (true) WITH CHECK (true);