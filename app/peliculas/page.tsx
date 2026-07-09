import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabaseAdmin } from '@/lib/supabase';
import { MovieCard } from '@/components/MovieCard';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Descargar Películas en HD - Latino, Castellano, Inglés',
  description: 'Descarga las mejores películas en HD, 4K UHD y 1080p. Audio en Latino, Castellano, Inglés y más. Nuevos estrenos y clásicos. Acceso VIP a servidores premium sin publicidad.',
  keywords: ['descargar peliculas', 'peliculas hd', 'peliculas latino', 'peliculas castellano', 'peliculas 1080p', 'peliculas 4k', 'descargar peliculas gratis'],
  alternates: { canonical: 'https://papumoviemkv.store/peliculas' },
  openGraph: {
    title: 'Descargar Películas en HD | PAPUMOVIE',
    description: 'Descarga las mejores películas en HD, 4K UHD y 1080p con audio en Latino, Castellano e Inglés.',
    url: 'https://papumoviemkv.store/peliculas',
    type: 'website',
  },
};

export default async function PeliculasPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; year?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const { genre, year, sort = 'recent' } = params;

  let query = supabaseAdmin
    .from('movies')
    .select('id, title, original_title, release_year, cover_url, format, resolution, rating, audio_languages, file_size, description, genres, category, backdrop_url')
    .or('category.eq.Película,category.is.null');

  if (genre) query = query.contains('genres', [genre]);
  if (year) query = query.eq('release_year', parseInt(year));

  if (sort === 'rating') query = query.order('rating', { ascending: false });
  else if (sort === 'popular') query = query.order('rating', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  const { data: movies } = await query;

  const featured = movies?.find(m => m.backdrop_url) || movies?.[0];

  const allGenres = Array.from(
    new Set((movies || []).flatMap(m => m.genres || []))
  ).sort();

  const years = Array.from(
    new Set((movies || []).map(m => m.release_year).filter(Boolean))
  ).sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <Header />

      {/* Hero Banner */}
      {featured && (
        <div className="relative w-full h-[380px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={featured.backdrop_url || featured.cover_url}
              alt={featured.title}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
          </div>

          <button className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors">
            ‹
          </button>
          <button className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors">
            ›
          </button>

          <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-6 pb-10">
            <div className="flex items-center gap-3 mb-3">
              {featured.rating && (
                <div className="flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/30 px-2 py-0.5 rounded text-xs font-bold text-yellow-400">
                  ⭐ {featured.rating.toFixed(1)}
                </div>
              )}
              <span className="text-xs text-gray-300 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#00d0d0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
                Película
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-1">
              {featured.title}{' '}
              {featured.release_year && (
                <span className="text-gray-400 font-normal text-3xl">({featured.release_year})</span>
              )}
            </h1>

            <div className="flex flex-wrap gap-2 mb-3">
              {(featured.genres || []).slice(0, 3).map((g: string) => (
                <span key={g} className="px-3 py-0.5 rounded-full bg-[#00d0d0]/10 border border-[#00d0d0]/30 text-xs text-[#00d0d0] font-medium">
                  {g}
                </span>
              ))}
            </div>

            <p className="text-sm text-gray-300 max-w-lg line-clamp-2 mb-5 leading-relaxed">
              {featured.description}
            </p>

            <Link
              href={`/pelicula/${featured.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-white text-sm font-semibold transition-all backdrop-blur-sm w-fit"
            >
              Ver Detalles →
            </Link>
          </div>
        </div>
      )}

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto w-full px-4 py-8 flex-1">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-[#00d0d0]/10 border border-[#00d0d0]/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#00d0d0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Todas las películas</h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              {movies?.length || 0} TÍTULOS ENCONTRADOS
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {[
            { key: 'recent', label: 'Actualizadas' },
            { key: 'popular', label: 'Populares' },
            { key: 'rating', label: 'Mejor Valoradas' },
          ].map(tab => (
            <Link
              key={tab.key}
              href={`/peliculas?sort=${tab.key}${genre ? `&genre=${genre}` : ''}${year ? `&year=${year}` : ''}`}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                sort === tab.key
                  ? 'bg-[#00d0d0] text-black'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a20]'
              }`}
            >
              {tab.label}
            </Link>
          ))}

          {/* Genre dropdown */}
          <div className="relative group ml-1">
            <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm text-gray-300 hover:text-white border border-[#1f1f23] hover:border-[#00d0d0]/50 bg-[#121215] transition-colors">
              {genre || 'Todos los Géneros'}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div className="absolute top-full left-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-20">
              <div className="bg-[#121215] border border-[#1f1f23] rounded-xl shadow-2xl py-2 max-h-64 overflow-y-auto">
                <Link href={`/peliculas?sort=${sort}${year ? `&year=${year}` : ''}`} className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1a1a20]">Todos los Géneros</Link>
                {allGenres.map(g => (
                  <Link key={g} href={`/peliculas?sort=${sort}&genre=${encodeURIComponent(g)}${year ? `&year=${year}` : ''}`} className={`block px-4 py-2 text-sm hover:bg-[#1a1a20] ${genre === g ? 'text-[#00d0d0]' : 'text-gray-300 hover:text-white'}`}>{g}</Link>
                ))}
              </div>
            </div>
          </div>

          {/* Year dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm text-gray-300 hover:text-white border border-[#1f1f23] hover:border-[#00d0d0]/50 bg-[#121215] transition-colors">
              {year || 'Cualquier Año'}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div className="absolute top-full left-0 pt-2 w-36 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-20">
              <div className="bg-[#121215] border border-[#1f1f23] rounded-xl shadow-2xl py-2 max-h-64 overflow-y-auto">
                <Link href={`/peliculas?sort=${sort}${genre ? `&genre=${genre}` : ''}`} className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1a1a20]">Cualquier Año</Link>
                {years.map(y => (
                  <Link key={y} href={`/peliculas?sort=${sort}&year=${y}${genre ? `&genre=${genre}` : ''}`} className={`block px-4 py-2 text-sm hover:bg-[#1a1a20] ${year === String(y) ? 'text-[#00d0d0]' : 'text-gray-300 hover:text-white'}`}>{y}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        {movies && movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie as any} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-gray-700 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
            <p className="text-gray-500 text-lg font-medium">No hay películas disponibles todavía.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
