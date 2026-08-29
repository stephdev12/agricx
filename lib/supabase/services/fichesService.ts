import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { ContributorArticle } from '@/lib/supabase/types';
import { DEMO_ARTICLES } from '@/lib/data/demoData';

export async function fetchTechnicalArticles(category?: string): Promise<ContributorArticle[]> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    if (category && category !== 'Tous') {
      return DEMO_ARTICLES.filter((a) => a.category === category);
    }
    return DEMO_ARTICLES;
  }

  try {
    let query = supabase
      .from('technical_articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (category && category !== 'Tous') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Note Supabase technical_articles:', error.message);
      if (category && category !== 'Tous') {
        return DEMO_ARTICLES.filter((a) => a.category === category);
      }
      return DEMO_ARTICLES;
    }

    if (data !== null) {
      return data.length > 0
        ? (data as ContributorArticle[])
        : category && category !== 'Tous'
        ? DEMO_ARTICLES.filter((a) => a.category === category)
        : DEMO_ARTICLES;
    }

    return DEMO_ARTICLES;
  } catch (err) {
    console.warn('Erreur fiches:', err);
    return DEMO_ARTICLES;
  }
}

export async function createTechnicalArticle(
  article: Omit<ContributorArticle, 'id' | 'created_at'>
): Promise<{ success: boolean; data?: ContributorArticle; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return { success: false, error: 'Supabase non connecté' };

  try {
    const { data, error } = await supabase
      .from('technical_articles')
      .insert([article])
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as ContributorArticle };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erreur lors de la publication' };
  }
}

export async function deleteTechnicalArticle(articleId: string): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('technical_articles').delete().eq('id', articleId);
    return !error;
  } catch {
    return false;
  }
}
