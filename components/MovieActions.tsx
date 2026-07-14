'use client';

import React from 'react';
import Link from 'next/link';

export function MovieActions({ movie }: { movie: any }) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: movie.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Enlace copiado al portapapeles');
      }
    } catch (e) {
      console.error('Error compartiendo:', e);
    }
  };

  const tmdbUrl = movie.tmdb_id 
    ? `https://www.themoviedb.org/${movie.category === 'SeriesTV' ? 'tv' : 'movie'}/${movie.tmdb_id}` 
    : `https://www.themoviedb.org/search?query=${encodeURIComponent(movie.title)}`;

  return (
    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-6">
      <button onClick={() => alert('¡Próximamente! Podrás añadir contenido a tu lista.')} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg border border-border bg-surface hover:bg-surface-hover text-text-secondary transition-colors cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg> 
        Añadir a mi lista
      </button>
      
      <button onClick={() => alert('¡Próximamente! Podrás guardar tus favoritos.')} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg border border-border bg-surface hover:bg-surface-hover text-text-secondary transition-colors cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg> 
        Añadir a favoritos
      </button>
      
      <a href={tmdbUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg border border-border bg-surface hover:bg-surface-hover text-text-secondary transition-colors cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
        TMDB
      </a>
      
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg border border-border bg-surface text-text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5c-2.2 0-4 1.8-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        921
      </div>
      
      <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg border border-border bg-surface hover:bg-surface-hover text-text-secondary transition-colors cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
        Compartir
      </button>
      
      <Link href="/dmca" className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg border border-border bg-surface hover:bg-surface-hover text-text-secondary transition-colors cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
        Legal
      </Link>
    </div>
  );
}
