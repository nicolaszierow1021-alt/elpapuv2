'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addComment, deleteComment } from '@/app/actions/comments';

interface Profile {
  username?: string;
  role?: string;
  avatar_url?: string;
  name_color?: string;
  vip_until?: string;
}

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: Profile;
}

interface CommentsSectionProps {
  movieId: string;
  comments: Comment[];
  session: any; // User session if logged in
}

export function CommentsSection({ movieId, comments, session }: CommentsSectionProps) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      router.push('/login');
      return;
    }

    if (!content.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const result = await addComment(movieId, session.user.id, content);
    
    if (result?.error) {
      setError(result.error);
    } else {
      setContent('');
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async (commentId: string) => {
    if (confirm('¿Seguro que quieres borrar este comentario?')) {
      await deleteComment(commentId, movieId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mb-4 lg:mb-6 mt-4">
      <details className="border border-border rounded-xl bg-background overflow-hidden group">
        <summary className="flex items-center justify-between px-4 py-3 sm:py-4 bg-surface cursor-pointer list-none [&::-webkit-details-marker]:hidden outline-none hover:bg-surface-hover transition-colors">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-text-secondary font-medium font-mono">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
            Comentarios ({comments.length})
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-text-secondary/50 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </summary>
        
        <div className="p-4 md:p-6 bg-surface border-t border-border">
          
          {/* Formulario de comentarios */}
          <div className="mb-8">
            {!session?.user ? (
              <div className="bg-background border border-border rounded-lg p-4 text-center">
                <p className="text-sm text-text-secondary mb-3">Debes iniciar sesión para poder comentar.</p>
                <button 
                  onClick={() => router.push('/login')}
                  className="px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent text-xs font-bold rounded-lg transition-colors border border-accent/20"
                >
                  Iniciar sesión
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escribe un comentario..."
                  className="w-full bg-background border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-accent/50 resize-none min-h-[80px]"
                  disabled={isSubmitting}
                />
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isSubmitting || !content.trim()}
                    className="px-4 py-2 bg-accent text-white text-xs font-bold rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Enviando...' : 'Comentar'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Lista de comentarios */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-10 text-text-secondary/20 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                <p className="text-text-secondary text-sm">No hay comentarios aún. ¡Sé el primero en comentar!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 bg-background border border-border rounded-lg p-4">
                  <div className="shrink-0 size-8 rounded-full bg-surface border border-border flex items-center justify-center text-xs font-bold uppercase text-accent overflow-hidden">
                    {comment.profiles?.avatar_url ? (
                      <img src={comment.profiles.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      comment.profiles?.username?.charAt(0) || 'U'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span 
                          className="font-bold text-sm truncate"
                          style={{ color: comment.profiles?.name_color || 'var(--text-primary)' }}
                        >
                          {comment.profiles?.username || 'Usuario'}
                        </span>
                        {comment.profiles?.role === 'admin' && (
                          <span className="text-[9px] uppercase tracking-wider bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded font-bold">Admin</span>
                        )}
                        <span className="text-[10px] text-text-secondary">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {session?.user?.id === comment.user_id && (
                        <button 
                          onClick={() => handleDelete(comment.id)}
                          className="text-text-secondary hover:text-red-500 transition-colors p-1"
                          title="Borrar comentario"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      )}
                    </div>
                    {/* Al usar texto plano y white-space pre-wrap evitamos XSS y respetamos los saltos de línea */}
                    <p className="text-sm text-text-secondary whitespace-pre-wrap break-words">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
        </div>
      </details>
    </div>
  );
}
