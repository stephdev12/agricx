export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  whatsapp: string;
  region: string;
  city: string;
  domains: string[];
  experience_level: 'Débutant' | 'Intermédiaire' | 'Expert';
  bio: string;
  avatar_url?: string | null;
  role?: 'user' | 'supplier' | 'admin';
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  supplier_id?: string;
  name: string;
  category: string;
  price_fcfa: number;
  unit: string;
  description?: string;
  in_stock: boolean;
  image_url?: string | null;
}

export interface Supplier {
  id: string;
  user_id?: string | null;
  business_name: string;
  owner_name?: string;
  category: string;
  phone: string;
  whatsapp: string;
  region: string;
  city: string;
  address?: string;
  landmark?: string;
  latitude?: number | null;
  longitude?: number | null;
  verified?: boolean;
  rating?: number | null;
  review_count?: number;
  payment_methods?: string[];
  delivery_regions?: string[];
  min_order_fcfa?: number;
  products?: Product[];
  distance_km?: number | null;
  is_demo?: boolean;
  created_at?: string;
}

export interface SupplierRequest {
  id: string;
  user_id?: string | null;
  business_name: string;
  owner_name: string;
  category: string;
  phone: string;
  whatsapp: string;
  region: string;
  city: string;
  address?: string;
  cni_number: string;
  cni_photo_url?: string | null;
  business_proof_url?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface FinancialItem {
  item_name: string;
  category: 'CAPEX' | 'OPEX';
  unit_cost_fcfa: number;
  quantity: number;
  total_fcfa: number;
  notes?: string;
}

export interface TimelineStep {
  phase: string;
  period: string;
  title: string;
  description: string;
  checklist: string[];
}

export interface ProjectSimulation {
  id?: string;
  user_id?: string;
  domain: string;
  project_title: string;
  region: string;
  city: string;
  feasibility_score: number;
  feasibility_status: string;
  executive_summary: string;
  total_budget_requested_fcfa: number;
  total_capex_fcfa: number;
  total_opex_fcfa: number;
  total_investment_fcfa: number;
  reserve_fund_fcfa: number;
  estimated_turnover_fcfa: number;
  net_profit_fcfa: number;
  roi_percentage: number;
  production_cycle_months: number;
  financial_breakdown: FinancialItem[];
  timeline: TimelineStep[];
  key_recommendations: string[];
  nearby_suppliers?: Supplier[];
  created_at?: string;
}

export interface ContributorArticle {
  id: string;
  author_id?: string | null;
  author_name: string;
  author_title?: string;
  category: string;
  title: string;
  summary: string;
  content: string;
  tags?: string[];
  upvotes?: number;
  status?: 'verified' | 'approved' | 'pending';
  region?: string;
  date_published?: string;
  is_demo?: boolean;
  created_at?: string;
}

export interface FeedComment {
  id: string;
  post_id?: string;
  user_id?: string | null;
  author_name: string;
  author_role?: string;
  content: string;
  date_published?: string;
  created_at?: string;
}

export interface FeedPost {
  id: string;
  user_id?: string | null;
  author_name: string;
  author_title?: string;
  author_avatar_url?: string | null;
  category: string;
  title?: string;
  content: string;
  image_url?: string | null;
  likes_count: number;
  comments_count: number;
  comments?: FeedComment[];
  shares_count?: number;
  is_liked?: boolean;
  is_bookmarked?: boolean;
  verified?: boolean;
  source_type?: 'expert_guide' | 'community_post' | 'market_alert';
  is_demo?: boolean;
  date_published?: string;
  created_at?: string;
}

export interface ChatMessageAttachment {
  id: string;
  name: string;
  meta: string;
  src?: string;
}

export interface ChatMessage {
  id: string;
  conversation_id?: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  attachments?: ChatMessageAttachment[];
  created_at: string;
}

export interface ChatConversation {
  id: string;
  user_id?: string;
  title: string;
  created_at: string;
  updated_at: string;
}

// ─── RAG & Vector Knowledge Base Types ───
export interface RagKnowledgeDocument {
  id: string;
  title: string;
  category: string;
  source?: string;
  author?: string;
  file_url?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface RagKnowledgeChunk {
  id: string;
  document_id?: string;
  content: string;
  embedding?: number[];
  chunk_index?: number;
  category: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface RagSearchResult {
  id: string;
  document_id?: string;
  content: string;
  category: string;
  similarity: number;
  metadata?: Record<string, unknown>;
}
