import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { FeedPost, FeedComment } from '@/lib/supabase/types';

export async function fetchCommunityPosts(): Promise<FeedPost[]> {
  const supabase = getSupabaseBrowserClient();

  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Erreur Supabase community_posts:', error.message);
      return [];
    }

    return (data as FeedPost[]) || [];
  } catch (err) {
    console.warn('Erreur réseau community_posts:', err);
    return [];
  }
}

export async function createCommunityPost(post: {
  author_name: string;
  category: string;
  title?: string;
  content: string;
  image_url?: string | null;
  user_id?: string;
}): Promise<FeedPost | null> {
  const supabase = getSupabaseBrowserClient();

  try {
    const { data, error } = await supabase
      .from('community_posts')
      .insert([post])
      .select()
      .single();

    if (error) {
      console.error('Erreur création post:', error);
      return null;
    }

    return { ...data, comments: [] } as FeedPost;
  } catch (err) {
    console.error('Erreur inattendue création post:', err);
    return null;
  }
}

export async function addCommentToPost(
  postId: string,
  content: string,
  authorName: string,
  userId?: string
): Promise<FeedComment | null> {
  const supabase = getSupabaseBrowserClient();

  try {
    const { data, error } = await supabase
      .from('community_comments')
      .insert([
        {
          post_id: postId,
          content,
          author_name: authorName,
          user_id: userId || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Erreur commentaire:', error);
      return null;
    }

    return data as FeedComment;
  } catch {
    return null;
  }
}
