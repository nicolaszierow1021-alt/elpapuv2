'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addComment(movieId: string, userId: string, content: string) {
  if (!movieId || !userId || !content || !content.trim()) {
    return { error: 'Datos incompletos.' };
  }

  // Sanitización básica: remover tags HTML para asegurar texto plano puro
  const sanitizedContent = content.replace(/<[^>]*>?/gm, '').trim();

  if (!sanitizedContent) {
    return { error: 'El comentario no puede estar vacío.' };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('comments')
    .insert({
      movie_id: movieId,
      user_id: userId,
      content: sanitizedContent
    });

  if (error) {
    console.error('Error adding comment:', error);
    return { error: 'Hubo un error al guardar el comentario.' };
  }

  revalidatePath(`/pelicula/${movieId}`);
  return { success: true };
}

export async function deleteComment(commentId: string, movieId: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return { error: 'No autorizado' };
  }

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', session.user.id);

  if (error) {
    return { error: 'Error al borrar el comentario.' };
  }

  revalidatePath(`/pelicula/${movieId}`);
  return { success: true };
}
