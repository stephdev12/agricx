import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { ContributorArticle } from '@/lib/supabase/types';

export async function fetchTechnicalArticles(category?: string): Promise<ContributorArticle[]> {
  const supabase = getSupabaseBrowserClient();

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
      console.warn('Erreur Supabase technical_articles:', error.message);
      return [];
    }

    return (data as ContributorArticle[]) || [];
  } catch (err) {
    console.warn('Erreur réseau fiches:', err);
    return [];
  }
}

export async function createTechnicalArticle(
  article: Omit<ContributorArticle, 'id' | 'created_at'>
): Promise<{ success: boolean; data?: ContributorArticle; error?: string }> {
  const supabase = getSupabaseBrowserClient();

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

  try {
    const { error } = await supabase.from('technical_articles').delete().eq('id', articleId);
    return !error;
  } catch {
    return false;
  }
}
