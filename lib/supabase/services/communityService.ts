import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { FeedPost, FeedComment } from '@/lib/supabase/types';
import { DEMO_FEED_POSTS } from '@/lib/data/demoData';

export async function fetchCommunityPosts(): Promise<FeedPost[]> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return DEMO_FEED_POSTS;
  }

  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*, comments:community_comments(*)')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return DEMO_FEED_POSTS;
    }

    return data as FeedPost[];
  } catch {
    return DEMO_FEED_POSTS;
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

  if (!supabase) {
    // Local mock post
    const localPost: FeedPost = {
      id: `local-${Date.now()}`,
      author_name: post.author_name,
      category: post.category,
      title: post.title,
      content: post.content,
      image_url: post.image_url,
      likes_count: 0,
      comments_count: 0,
      comments: [],
      created_at: 'À l\'instant',
    };
    return localPost;
  }

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

  if (!supabase) {
    return {
      id: `comment-${Date.now()}`,
      post_id: postId,
      author_name: authorName,
      content,
      created_at: 'À l\'instant',
    };
  }

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
