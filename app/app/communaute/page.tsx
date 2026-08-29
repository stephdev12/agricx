'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  MessageSquare,
  Bookmark,
  Send,
  Plus,
  X,
  Paperclip,
  FileCodeIcon,
  XIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from '@/components/ui/attachment';
import {
  fetchCommunityPosts,
  createCommunityPost,
  addCommentToPost,
} from '@/lib/supabase/services/communityService';
import type { FeedPost, FeedComment } from '@/lib/supabase/types';

interface PostAttachment {
  name: string;
  meta: string;
  src?: string;
}

export default function CommunautePage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Pisciculture');
  const [postAttachments, setPostAttachments] = useState<PostAttachment[]>([]);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function loadFeed() {
      setLoading(true);
      const data = await fetchCommunityPosts();
      setPosts(data);
      setLoading(false);
    }
    loadFeed();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        const isImage = file.type.startsWith('image/');
        const sizeFormatted =
          file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.round(file.size / 1024)} KB`;
        const meta = `${file.type.split('/')[1]?.toUpperCase() || 'FILE'} · ${sizeFormatted}`;

        reader.onload = (event) => {
          setPostAttachments((prev) => [
            ...prev,
            {
              name: file.name,
              meta,
              src: isImage ? (event.target?.result as string) : undefined,
            },
          ]);
        };
        reader.readAsDataURL(file);
      });
      e.target.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setPostAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              is_liked: !p.is_liked,
              likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1,
            }
          : p
      )
    );
  };

  const handleNewPost = async () => {
    if (!newPostContent.trim()) return;

    const created = await createCommunityPost({
      author_name: 'Producteur Agricx',
      category: newPostCategory,
      content: newPostContent,
      image_url: postAttachments[0]?.src || null,
    });

    if (created) {
      setPosts([created, ...posts]);
    }
    setNewPostContent('');
    setPostAttachments([]);
    setShowNewPost(false);
  };

  const handleAddComment = async (postId: string) => {
    const text = commentTexts[postId]?.trim();
    if (!text) return;

    const newComment = await addCommentToPost(postId, text, 'Producteur Agricx');

    if (newComment) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments_count: (p.comments_count || 0) + 1,
                comments: [...(p.comments || []), newComment],
              }
            : p
        )
      );
    }
    setCommentTexts((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Communauté
          </h1>
          <p className="text-sm text-muted-foreground">
            Retours d&apos;expérience, alertes sanitaires et échanges entre producteurs
          </p>
        </div>

        <Button
          variant="emerald"
          size="sm"
          onClick={() => setShowNewPost(!showNewPost)}
          className="gap-1.5 shadow-xs cursor-pointer"
        >
          {showNewPost ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span className="hidden sm:inline">
            {showNewPost ? 'Annuler' : 'Publier'}
          </span>
        </Button>
      </div>

      {/* New Post Form */}
      <AnimatePresence>
        {showNewPost && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <select
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className="h-8 px-2.5 rounded-xl border border-border bg-card text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Pisciculture" className="bg-card text-foreground">Pisciculture</option>
                    <option value="Héliciculture" className="bg-card text-foreground">Héliciculture</option>
                    <option value="Aviculture" className="bg-card text-foreground">Aviculture</option>
                    <option value="Maraîchage" className="bg-card text-foreground">Maraîchage</option>
                    <option value="Porciculture" className="bg-card text-foreground">Porciculture</option>
                    <option value="Conseil Pratique" className="bg-card text-foreground">Conseil Pratique</option>
                  </select>
                </div>

                <Textarea
                  placeholder="Partagez un retour d'expérience, une récolte ou posez une question technique..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={3}
                  className="text-sm"
                />

                {/* Attachments preview */}
                {postAttachments.length > 0 && (
                  <AttachmentGroup className="pt-1">
                    {postAttachments.map((att, i) => (
                      <Attachment key={i} variant="compact" className="bg-muted">
                        <AttachmentMedia src={att.src}>
                          {!att.src && <FileCodeIcon className="w-3.5 h-3.5 text-muted-foreground" />}
                        </AttachmentMedia>
                        <AttachmentContent>
                          <AttachmentTitle>{att.name}</AttachmentTitle>
                          <AttachmentDescription>{att.meta}</AttachmentDescription>
                        </AttachmentContent>
                        <AttachmentActions>
                          <AttachmentAction onClick={() => removeAttachment(i)}>
                            <XIcon className="w-3 h-3" />
                          </AttachmentAction>
                        </AttachmentActions>
                      </Attachment>
                    ))}
                  </AttachmentGroup>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-muted-foreground hover:text-emerald-600 gap-1.5 text-xs"
                  >
                    <Paperclip className="w-4 h-4" />
                    <span>Photo / Fichier</span>
                  </Button>

                  <Button
                    variant="emerald"
                    size="sm"
                    onClick={handleNewPost}
                    disabled={!newPostContent.trim()}
                  >
                    Publier
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feed Posts */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-xs text-muted-foreground">
            Chargement des discussions...
          </div>
        ) : (
          posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
            >
              <Card className="hover:border-border/80 transition-colors">
                <CardContent className="p-5 space-y-3.5">
                  {/* Author Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted text-foreground flex items-center justify-center text-xs font-medium shrink-0">
                        {post.author_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground leading-tight">
                          {post.author_name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {post.category} · {post.created_at}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  {post.title && (
                    <h3 className="text-sm font-semibold text-foreground">{post.title}</h3>
                  )}
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {/* Media Image */}
                  {post.image_url && (
                    <div className="rounded-xl overflow-hidden border border-border max-h-80 bg-muted">
                      <img
                        src={post.image_url}
                        alt="Publication media"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-border">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                          post.is_liked
                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                            : 'text-muted-foreground hover:text-foreground border-transparent hover:bg-muted'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${post.is_liked ? 'fill-red-500' : ''}`} />
                        <span>{post.likes_count}</span>
                      </button>

                      <button
                        onClick={() =>
                          setExpandedComments(
                            expandedComments === post.id ? null : post.id
                          )
                        }
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{post.comments?.length || post.comments_count || 0}</span>
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {expandedComments === post.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.2 }}
                      className="pt-3 border-t border-border space-y-3"
                    >
                      {post.comments && post.comments.length > 0 ? (
                        <div className="space-y-2">
                          {post.comments.map((c: FeedComment) => (
                            <div
                              key={c.id}
                              className="p-2.5 rounded-xl bg-muted/50 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between text-muted-foreground">
                                <span className="font-semibold text-foreground">
                                  {c.author_name}
                                </span>
                                <span className="text-[10px]">{c.created_at}</span>
                              </div>
                              <p className="text-foreground">{c.content}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-2">
                          Aucun commentaire pour le moment.
                        </p>
                      )}

                      {/* Comment Input */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Écrire un commentaire..."
                          value={commentTexts[post.id] || ''}
                          onChange={(e) =>
                            setCommentTexts((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment(post.id);
                          }}
                          className="flex-1 h-8 px-3 rounded-lg border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <Button
                          variant="emerald"
                          size="sm"
                          onClick={() => handleAddComment(post.id)}
                          className="h-8 px-2.5 text-xs"
                        >
                          <Send className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
