import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabaseAdmin } from '@/lib/supabase';
import { MovieCard } from '@/components/MovieCard';
import Link from 'next/link';
import { MonitorPlay } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Descargar Series de TV en HD - Latino, Castellano, Inglés',
  description: 'Descarga las mejores Series de Televisión en HD y 4K. Audio en Latino, Castellano e Inglés. Nuevos episodios semanales. Acceso VIP a servidores premium sin publicidad.',
  keywords: ['descargar series', 'series hd', 'series latino', 'series castellano', 'series online', 'series 1080p', 'series de tv completas'],
  alternates: { canonical: 'https://papumoviemkv.store/series' },
  openGraph: {
    title: 'Descargar Series de TV en HD | PAPUMOVIE',
    description: 'Descarga las mejores Series de Televisión en HD con audio en Latino, Castellano e Inglés.',
    url: 'https://papumoviemkv.store/series',
    type: 'website',
  },
};

export default async function SeriesPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; year?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const { genre, year, sort = 'recent' } = params;

  // Fetch all series (content with 'SeriesTV' category)
  let query = supabaseAdmin
    .from('movies')
    .select('id, title, original_title, release_year, cover_url, format, resolution, rating, audio_languages, file_size, description, genres, category, backdrop_url')
    .eq('category', 'SeriesTV');

  if (genre) query = query.contains('genres', [genre]);
  if (year) query = query.eq('release_year', parseInt(year));

  if (sort === 'rating') query = query.order('rating', { ascending: false });
  else if (sort === 'popular') query = query.order('rating', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  const { data: series } = await query;

  // Featured series (first one with a backdrop)
  const featured = series?.find(s => s.backdrop_url) || series?.[0];

  // Unique genres from all series
  const allGenres = Array.from(
    new Set((series || []).flatMap(s => s.genres || []))
  ).sort();

  // Year range
  const years = Array.from(
    new Set((series || []).map(s => s.release_year).filter(Boolean))
  ).sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <Header />

      {/* Hero Banner */}
      {featured && (
        <div className="relative w-full h-[380px] overflow-hidden">
          {/* Backdrop */}
          <div className="absolute inset-0">
            <img
              src={featured.backdrop_url || featured.cover_url}
              alt={featured.title}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
          </div>

          {/* Arrow indicators */}
          <button className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors">
            ‹
          </button>
          <button className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors">
            ›
          </button>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-6 pb-10">
            {/* Meta */}
            <div className="flex items-center gap-3 mb-3">
              {featured.rating && (
                <div className="flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/30 px-2 py-0.5 rounded text-xs font-bold text-yellow-400">
                  ⭐ {featured.rating.toFixed(1)}
                </div>
              )}
              <span className="text-xs text-gray-300 flex items-center gap-1">
                <MonitorPlay className="w-3.5 h-3.5 text-violet-400" /> Serie de TV
              </span>
              {(series?.length || 0) > 1 && (
                <span className="text-xs text-gray-400">🔔 {((series?.length || 0) * 123).toLocaleString()}</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-1">
              {featured.title}{' '}
              {featured.release_year && (
                <span className="text-gray-400 font-normal text-3xl">({featured.release_year})</span>
              )}
            </h1>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-3">
              {(featured.genres || []).slice(0, 3).map((g: string) => (
                <span key={g} className="px-3 py-0.5 rounded-full bg-violet-600/40 border border-violet-500/40 text-xs text-violet-200 font-medium">
                  {g}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-300 max-w-lg line-clamp-2 mb-5 leading-relaxed">
              {featured.description}
            </p>

            {/* CTA */}
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
          <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <MonitorPlay className="w-4.5 h-4.5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Todas las series</h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              {series?.length || 0} TÍTULOS ENCONTRADOS
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {/* Sort tabs */}
          {[
            { key: 'recent', label: 'Actualizadas' },
            { key: 'popular', label: 'Populares' },
            { key: 'rating', label: 'Mejor Valoradas' },
          ].map(tab => (
            <Link
              key={tab.key}
              href={`/series?sort=${tab.key}${genre ? `&genre=${genre}` : ''}${year ? `&year=${year}` : ''}`}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                sort === tab.key
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a20]'
              }`}
            >
              {tab.label}
            </Link>
          ))}

          {/* Genre dropdown */}
          <div className="relative group ml-1">
            <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm text-gray-300 hover:text-white border border-[#1f1f23] hover:border-violet-500/50 bg-[#121215] transition-colors">
              {genre || 'Todos los Géneros'}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div className="absolute top-full left-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-20">
              <div className="bg-[#121215] border border-[#1f1f23] rounded-xl shadow-2xl py-2 max-h-64 overflow-y-auto">
                <Link href={`/series?sort=${sort}${year ? `&year=${year}` : ''}`} className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1a1a20]">Todos los Géneros</Link>
                {allGenres.map(g => (
                  <Link key={g} href={`/series?sort=${sort}&genre=${encodeURIComponent(g)}${year ? `&year=${year}` : ''}`} className={`block px-4 py-2 text-sm hover:bg-[#1a1a20] ${genre === g ? 'text-violet-400' : 'text-gray-300 hover:text-white'}`}>{g}</Link>
                ))}
              </div>
            </div>
          </div>

          {/* Year dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm text-gray-300 hover:text-white border border-[#1f1f23] hover:border-violet-500/50 bg-[#121215] transition-colors">
              {year || 'Cualquier Año'}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div className="absolute top-full left-0 pt-2 w-36 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-20">
              <div className="bg-[#121215] border border-[#1f1f23] rounded-xl shadow-2xl py-2 max-h-64 overflow-y-auto">
                <Link href={`/series?sort=${sort}${genre ? `&genre=${genre}` : ''}`} className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1a1a20]">Cualquier Año</Link>
                {years.map(y => (
                  <Link key={y} href={`/series?sort=${sort}&year=${y}${genre ? `&genre=${genre}` : ''}`} className={`block px-4 py-2 text-sm hover:bg-[#1a1a20] ${year === String(y) ? 'text-violet-400' : 'text-gray-300 hover:text-white'}`}>{y}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        {series && series.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
            {series.map(s => (
              <SeriesCard key={s.id} series={s} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <MonitorPlay className="w-14 h-14 text-gray-700 mb-4" />
            <p className="text-gray-500 text-lg font-medium">No hay series disponibles todavía.</p>
            <p className="text-gray-600 text-sm mt-2">El administrador debe marcar contenido con la categoría "SeriesTV".</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

// Series card with "Serie de TV" subtitle instead of "Película"
function SeriesCard({ series }: { series: any }) {
  return (
    <Link href={`/pelicula/${series.id}`} className="group flex flex-col gap-2">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#121215] border border-[#1f1f23] transition-all duration-300 group-hover:border-violet-500/50">
        {series.cover_url ? (
          <img src={series.cover_url} alt={series.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-700">Sin Imagen</div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        {/* Top badges */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between z-20 pointer-events-none">
          <div className="bg-black/80 backdrop-blur-sm border border-white/10 text-white text-xs font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1">
            ⭐ {series.rating ? series.rating.toFixed(1) : 'N/A'}
          </div>
          <div className="flex gap-1">
            {series.format && (
              <div className="bg-emerald-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded-[3px] uppercase">
                {series.format}
              </div>
            )}
          </div>
        </div>

        {/* Hover info */}
        <div className="absolute inset-x-2 top-[35%] z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 pointer-events-none">
          <div className="flex items-center gap-2 text-[11px] text-gray-300">
            <span className="text-violet-400 font-semibold">Serie de TV</span>
            <span>•</span>
            <span>{series.release_year}</span>
          </div>
          <p className="text-[11px] text-gray-100 line-clamp-4 leading-snug">{series.description}</p>
          <div className="text-violet-400 text-[11px] font-medium mt-1 flex items-center gap-1">
            Ver detalles <span className="text-lg leading-none mb-0.5">→</span>
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent opacity-90 z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-300" />

        {/* Audio flags bottom */}
        {series.audio_languages?.length > 0 && (
          <div className="absolute bottom-2 left-2 right-2 z-20 flex items-center gap-1.5 pointer-events-none">
            {series.audio_languages.slice(0, 4).map((lang: string, idx: number) => {
              const l = lang.toLowerCase();
              const flag = l.includes('latino') || l.includes('lat') ? 'fi fi-mx' :
                l.includes('castellano') || l.includes('cas') ? 'fi fi-es' :
                l.includes('inglés') || l.includes('ing') ? 'fi fi-us' :
                l.includes('japonés') || l.includes('jap') ? 'fi fi-jp' : 'fi fi-un';
              const text = l.includes('lat') ? 'LAT' : l.includes('cas') ? 'CAS' : l.includes('ing') ? 'ING' : l.includes('jap') ? 'JAP' : lang.substring(0, 3).toUpperCase();
              return (
                <div key={idx} className="flex items-center gap-0.5">
                  <span className={`${flag} rounded-sm w-3 h-[9px] overflow-hidden`}></span>
                  <span className="text-[8px] font-bold text-gray-300 uppercase">{text}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Title */}
      <div className="mt-1 flex flex-col">
        <h3 className="font-semibold text-sm text-gray-100 line-clamp-1 group-hover:text-violet-400 transition-colors">
          {series.title}
        </h3>
        <span className="text-xs text-gray-500 font-medium mt-0.5">
          {series.release_year || 'N/A'} • Serie de TV
        </span>
      </div>
    </Link>
  );
}
