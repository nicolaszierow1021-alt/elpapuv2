"use client";

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { deleteMovie } from '@/app/admin/actions';

export function DeleteMovieButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta película?')) return;
    
    setIsDeleting(true);
    const res = await deleteMovie(id);
    if (!res.success) {
      alert('Error al eliminar: ' + res.error);
      setIsDeleting(false);
    }
    // Si tiene éxito, la acción del servidor hará revalidatePath y actualizará la UI
  };

  return (
    <button 
      className="bg-black/50 backdrop-blur-md p-2 rounded-lg text-white/70 hover:bg-red-500/20 hover:text-red-400 border border-white/10 hover:border-red-500/50 transition-all shadow-xl disabled:opacity-50"
      onClick={handleDelete}
      disabled={isDeleting}
      title="Eliminar película"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
