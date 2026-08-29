import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { RagKnowledgeDocument, RagKnowledgeChunk, RagSearchResult } from '@/lib/supabase/types';

export interface IngestChunkInput {
  content: string;
  category: string;
  embedding?: number[];
  chunk_index?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchRagDocuments(): Promise<RagKnowledgeDocument[]> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('rag_knowledge_documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as RagKnowledgeDocument[];
  } catch {
    return [];
  }
}

export async function fetchRagChunks(documentId?: string): Promise<RagKnowledgeChunk[]> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return [];

  try {
    let query = supabase.from('rag_knowledge_chunks').select('*').order('created_at', { ascending: false });
    if (documentId) {
      query = query.eq('document_id', documentId);
    }
    const { data, error } = await query;
    if (error || !data) return [];
    return data as RagKnowledgeChunk[];
  } catch {
    return [];
  }
}

export async function deleteRagDocument(documentId: string): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('rag_knowledge_documents').delete().eq('id', documentId);
    return !error;
  } catch {
    return false;
  }
}

export async function queryRagContext(
  query: string,
  category?: string,
  queryEmbedding?: number[]
): Promise<RagSearchResult[]> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return getFallbackRagChunks(query, category);
  }

  try {
    // If vector embedding is provided, use pgvector cosine search RPC
    if (queryEmbedding && queryEmbedding.length > 0) {
      const { data, error } = await supabase.rpc('match_rag_chunks', {
        query_embedding: queryEmbedding,
        match_threshold: 0.55,
        match_count: 4,
        filter_category: category || null,
      });

      if (!error && data && data.length > 0) {
        return data as RagSearchResult[];
      }
    }

    // Fallback to text matching on RAG knowledge chunks
    let queryBuilder = supabase
      .from('rag_knowledge_chunks')
      .select('id, document_id, content, category, metadata')
      .limit(4);

    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }

    const { data: chunks, error: chunksError } = await queryBuilder;

    if (!chunksError && chunks && chunks.length > 0) {
      const lowerQ = query.toLowerCase();
      const scored = chunks.map((c) => {
        const lowerC = c.content.toLowerCase();
        let matchScore = 0.5;
        const words = lowerQ.split(/\s+/).filter((w) => w.length > 3);
        words.forEach((w) => {
          if (lowerC.includes(w)) matchScore += 0.15;
        });
        return {
          id: c.id,
          document_id: c.document_id,
          content: c.content,
          category: c.category,
          similarity: Math.min(matchScore, 0.95),
          metadata: c.metadata,
        };
      });

      return scored.sort((a, b) => b.similarity - a.similarity).slice(0, 3);
    }

    return getFallbackRagChunks(query, category);
  } catch (err) {
    console.warn('Erreur RAG search:', err);
    return getFallbackRagChunks(query, category);
  }
}

// Ingest new knowledge document and vector chunks
export async function ingestRagDocument(
  title: string,
  category: string,
  source: string,
  chunks: IngestChunkInput[]
): Promise<{ success: boolean; documentId?: string; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return { success: false, error: 'Supabase non connecté' };

  try {
    const { data: doc, error: docError } = await supabase
      .from('rag_knowledge_documents')
      .insert([
        {
          title,
          category,
          source,
        },
      ])
      .select('id')
      .single();

    if (docError || !doc) {
      return { success: false, error: docError?.message };
    }

    const chunkRows = chunks.map((c, i) => ({
      document_id: doc.id,
      content: c.content,
      category: c.category || category,
      embedding: c.embedding || null,
      chunk_index: c.chunk_index ?? i + 1,
      metadata: c.metadata || {},
    }));

    const { error: chunksError } = await supabase
      .from('rag_knowledge_chunks')
      .insert(chunkRows);

    if (chunksError) {
      return { success: false, error: chunksError.message };
    }

    return { success: true, documentId: doc.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur ingestion';
    return { success: false, error: msg };
  }
}

function getFallbackRagChunks(query: string, category?: string): RagSearchResult[] {
  const lower = query.toLowerCase();

  const FALLBACK_CORPUS: RagSearchResult[] = [
    {
      id: 'fb-pisciculture-1',
      category: 'Pisciculture',
      similarity: 0.92,
      content:
        "Branchies pâles et apathie chez le silure Clarias : Manque d'oxygène dissous (<3mg/L) ou pic de nitrites. Protocole d'urgence : Changement d'eau de 50%, arrêt du nourrissage 24h, bain de sel non iodé à 1.5 kg/m3 d'eau, aération mécanique.",
    },
    {
      id: 'fb-aviculture-1',
      category: 'Aviculture',
      similarity: 0.89,
      content:
        "Coccidiose du poulet de chair : fientes hémorragiques, prostration. Traitement curatif : Amprolium 20% ou Toltrazuril dans l'eau de boisson pendant 3 à 5 jours. Remplacement de la litière humide par des copeaux secs désinfectés.",
    },
    {
      id: 'fb-provende-1',
      category: 'Aviculture',
      similarity: 0.88,
      content:
        "Formulation provende démarrage poulet 21% PB (100 kg) : Maïs jaune moulu (55 kg), Tourteau de soja 46% (26 kg), Farine de poisson locale 60% (8 kg), Son de blé fin (6 kg), CMV 5% (4 kg), Huile de palme (1 kg).",
    },
    {
      id: 'fb-maraichage-1',
      category: 'Maraîchage',
      similarity: 0.85,
      content:
        "Tomates & Mildiou en zone pluvieuse : Taches brunes nécrotiques. Traitement préventif : Bouillie bordelaise ou Mancozèbe. Traitement curatif : Fongicide systémique (Méfénoxam) + taille des feuilles basses touchées.",
    },
  ];

  if (category) {
    return FALLBACK_CORPUS.filter((c) => c.category.toLowerCase() === category.toLowerCase());
  }

  if (lower.includes('silure') || lower.includes('poisson') || lower.includes('alevin') || lower.includes('eau')) {
    return [FALLBACK_CORPUS[0]];
  }
  if (lower.includes('poulet') || lower.includes('poussin') || lower.includes('fiente') || lower.includes('coccidiose')) {
    return [FALLBACK_CORPUS[1]];
  }
  if (lower.includes('provende') || lower.includes('formule') || lower.includes('soja') || lower.includes('aliment')) {
    return [FALLBACK_CORPUS[2]];
  }

  return FALLBACK_CORPUS.slice(0, 2);
}
