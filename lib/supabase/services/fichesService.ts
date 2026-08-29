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

    if (error || !data || data.length === 0) {
      if (category && category !== 'Tous') {
        return DEMO_ARTICLES.filter((a) => a.category === category);
      }
      return DEMO_ARTICLES;
    }

    return data as ContributorArticle[];
  } catch {
    return DEMO_ARTICLES;
  }
}
