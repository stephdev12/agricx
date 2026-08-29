-- ==============================================================================
-- AGRICX 237 - SCHÉMA DE BASE DE DONNÉES SUPABASE (PostgreSQL + pgvector)
-- ==============================================================================

-- 1. ACTIVATION DES EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector"; -- Extension Vectorielle pour RAG

-- ==============================================================================
-- 2. PROFILS UTILISATEURS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  region TEXT DEFAULT 'Centre',
  city TEXT DEFAULT 'Yaoundé',
  domains TEXT[] DEFAULT ARRAY['Pisciculture']::TEXT[],
  experience_level TEXT DEFAULT 'Débutant' CHECK (experience_level IN ('Débutant', 'Intermédiaire', 'Expert')),
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Profils
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profils lecture publique"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Profils modification utilisateur"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Profils insertion utilisateur"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

-- Trigger pour création automatique de profil lors de l'inscription Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, whatsapp, region, city)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Agri-Producteur'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'whatsapp', ''),
    COALESCE(NEW.raw_user_meta_data->>'region', 'Centre'),
    COALESCE(NEW.raw_user_meta_data->>'city', 'Yaoundé')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    updated_at = NOW();
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ==============================================================================
-- 3. FOURNISSEURS D'INTRANTS & PRODUITS (ANNUAIRE GÉOLOCALISÉ)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  business_name TEXT NOT NULL,
  owner_name TEXT,
  category TEXT NOT NULL, -- Aliments & Provendes, Alevins & Géniteurs, Poussins & Accouvage, etc.
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  region TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  landmark TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  verified BOOLEAN DEFAULT true,
  rating NUMERIC(3, 2) DEFAULT 4.8,
  review_count INT DEFAULT 12,
  payment_methods TEXT[] DEFAULT ARRAY['Orange Money', 'MTN MoMo', 'Espèces']::TEXT[],
  delivery_regions TEXT[] DEFAULT ARRAY['Centre', 'Littoral', 'Ouest']::TEXT[],
  min_order_fcfa INT DEFAULT 10000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.supplier_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price_fcfa INT NOT NULL,
  unit TEXT NOT NULL, -- sac 50kg, unité, litre, kg
  description TEXT,
  in_stock BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Suppliers lecture publique" ON public.suppliers FOR SELECT USING (true);
CREATE POLICY "Suppliers modification authentifié" ON public.suppliers FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Products lecture publique" ON public.supplier_products FOR SELECT USING (true);
CREATE POLICY "Products modification authentifié" ON public.supplier_products FOR ALL USING (auth.role() = 'authenticated');


-- ==============================================================================
-- 4. FICHES TECHNIQUES & GUIDES AGRICOLES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.technical_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT 'Expert Agricx',
  author_title TEXT DEFAULT 'Ingénieur Agronome / Zootechnicien',
  category TEXT NOT NULL, -- Pisciculture, Aviculture, Héliciculture, Maraîchage, Porciculture
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY['Guide 237']::TEXT[],
  upvotes INT DEFAULT 0,
  region TEXT DEFAULT 'Cameroun (National)',
  date_published TEXT DEFAULT '2026',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.technical_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Articles lecture publique" ON public.technical_articles FOR SELECT USING (true);
CREATE POLICY "Articles écriture authentifié" ON public.technical_articles FOR ALL USING (auth.role() = 'authenticated');


-- ==============================================================================
-- 5. SIMULATIONS FINANCIÈRES & ÉCHÉANCIERS PROJETS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  project_title TEXT NOT NULL,
  region TEXT NOT NULL,
  city TEXT NOT NULL,
  feasibility_score INT DEFAULT 85,
  feasibility_status TEXT DEFAULT 'Excellente Viabilité',
  executive_summary TEXT,
  total_budget_requested_fcfa INT NOT NULL,
  total_capex_fcfa INT NOT NULL,
  total_opex_fcfa INT NOT NULL,
  total_investment_fcfa INT NOT NULL,
  reserve_fund_fcfa INT NOT NULL,
  estimated_turnover_fcfa INT NOT NULL,
  net_profit_fcfa INT NOT NULL,
  roi_percentage INT NOT NULL,
  production_cycle_months INT NOT NULL,
  key_recommendations TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.simulation_breakdowns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  simulation_id UUID NOT NULL REFERENCES public.simulations(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('CAPEX', 'OPEX')),
  unit_cost_fcfa INT NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL,
  total_fcfa INT NOT NULL,
  notes TEXT
);

ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_breakdowns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Simulations utilisateur" ON public.simulations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Simulations anonyme lecture/insert" ON public.simulations FOR ALL USING (true);

CREATE POLICY "Simulation breakdowns accès" ON public.simulation_breakdowns FOR ALL USING (true);


-- ==============================================================================
-- 6. COMMUNAUTÉ & FLUX DE DISCUSSION
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_title TEXT DEFAULT 'Agri-Producteur',
  category TEXT NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_role TEXT DEFAULT 'Membre',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts lecture publique" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Posts insertion" ON public.community_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Posts mise à jour" ON public.community_posts FOR UPDATE USING (true);

CREATE POLICY "Comments lecture publique" ON public.community_comments FOR SELECT USING (true);
CREATE POLICY "Comments insertion" ON public.community_comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Likes accès" ON public.community_likes FOR ALL USING (true);


-- ==============================================================================
-- 7. CONVERSATIONS DU CONSEILLER IA
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Nouvelle discussion',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'bot', 'system')),
  text TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Conversations accès" ON public.chat_conversations FOR ALL USING (true);
CREATE POLICY "Messages accès" ON public.chat_messages FOR ALL USING (true);


-- ==============================================================================
-- 8. INFRASTRUCTURE RAG VECTORIELLE (pgvector)
-- ==============================================================================

-- Documents maîtres ingérés (Manuels techniques, documents MINEPIA/MINADER, thèses, fiches vétérinaires)
CREATE TABLE IF NOT EXISTS public.rag_knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- Pisciculture, Aviculture, Héliciculture, Maraîchage, Pathologies, Nutrition
  source TEXT,
  author TEXT,
  file_url TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Segments de texte (chunks) avec vecteur d'embedding 1536 dimensions
CREATE TABLE IF NOT EXISTS public.rag_knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES public.rag_knowledge_documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(1536), -- Compatible OpenAI ada-002 / text-embedding-3 / Gemini vector
  chunk_index INT DEFAULT 0,
  category TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index vectoriel HNSW pour recherche cosinus ultra-rapide (< 5ms)
CREATE INDEX IF NOT EXISTS rag_chunks_embedding_hnsw_idx
  ON public.rag_knowledge_chunks
  USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS rag_chunks_category_idx
  ON public.rag_knowledge_chunks (category);

ALTER TABLE public.rag_knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_knowledge_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "RAG documents lecture publique" ON public.rag_knowledge_documents FOR SELECT USING (true);
CREATE POLICY "RAG chunks lecture publique" ON public.rag_knowledge_chunks FOR SELECT USING (true);
CREATE POLICY "RAG modification admin" ON public.rag_knowledge_documents FOR ALL USING (true);
CREATE POLICY "RAG chunks modification admin" ON public.rag_knowledge_chunks FOR ALL USING (true);


-- ==============================================================================
-- 9. FONCTION SQL DE RECHERCHE VECTORIELLE RAG (RPC)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.match_rag_chunks (
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.60,
  match_count int DEFAULT 5,
  filter_category text DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  content TEXT,
  category TEXT,
  similarity FLOAT,
  metadata JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.document_id,
    c.content,
    c.category,
    1 - (c.embedding <=> query_embedding) AS similarity,
    c.metadata
  FROM public.rag_knowledge_chunks c
  WHERE
    (c.embedding IS NOT NULL)
    AND (filter_category IS NULL OR c.category = filter_category)
    AND (1 - (c.embedding <=> query_embedding) >= match_threshold)
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
