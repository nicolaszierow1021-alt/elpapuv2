import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabaseAdmin } from '@/lib/supabase';
import { MovieCard } from '@/components/MovieCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 0;

const LANGUAGE_MAP: Record<string, { label: string; flagClass: string; dbValue: string }> = {
  latino:     { label: 'Latino',     flagClass: 'fi-mx', dbValue: 'Latino' },
  castellano: { label: 'Castellano', flagClass: 'fi-es', dbValue: 'Castellano' },
  ingles:     { label: 'Inglés',     flagClass: 'fi-us', dbValue: 'Inglés' },
  japones:    { label: 'Japonés',    flagClass: 'fi-jp', dbValue: 'Japonés' },
  coreano:    { label: 'Coreano',    flagClass: 'fi-kr', dbValue: 'Coreano' },
  frances:    { label: 'Francés',    flagClass: 'fi-fr', dbValue: 'Francés' },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const langInfo = LANGUAGE_MAP[lang];
  if (!langInfo) return { title: 'Idioma no encontrado' };

  const title = `Películas y Series en ${langInfo.label} HD - Descargar`;
  const description = `Descarga todas las Películas y Series disponibles en audio ${langInfo.label}. La mejor selección de contenido HD en ${langInfo.label} en PAPUMOVIE.`;

  return {
    title,
    description,
    keywords: [`peliculas en ${langInfo.label.toLowerCase()}`, `series en ${langInfo.label.toLowerCase()}`, `audio ${langInfo.label.toLowerCase()}`, `descargar ${langInfo.label.toLowerCase()}`],
    alternates: { canonical: `https://papumoviemkv.store/idioma/${lang}` },
    openGraph: {
      title: `${title} | PAPUMOVIE`,
      description,
      url: `https://papumoviemkv.store/idioma/${lang}`,
      type: 'website',
    },
  };
}


export default async function IdiomaPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ tipo?: string; sort?: string }>;
}) {
  const { lang } = await params;
  const { tipo, sort = 'recent' } = await searchParams;

  const langInfo = LANGUAGE_MAP[lang];
  if (!langInfo) notFound();

  let query = supabaseAdmin
    .from('movies')
    .select('id, title, original_title, release_year, cover_url, format, resolution, rating, audio_languages, file_size, description, genres, category, backdrop_url')
    .contains('audio_languages', [langInfo.dbValue]);

  if (tipo === 'peliculas') query = query.or('category.eq.Película,category.is.null');
  else if (tipo === 'series') query = query.eq('category', 'SeriesTV');
  else if (tipo === 'anime') query = query.eq('category', 'Anime');

  if (sort === 'rating') query = query.order('rating', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  const { data: movies } = await query;
  const count = movies?.length || 0;

  const TIPOS = [
    { key: undefined, label: 'Todo' },
    { key: 'peliculas', label: 'Películas' },
    { key: 'series', label: 'Series' },
    { key: 'anime', label: 'Anime' },
  ];

  const buildUrl = (t?: string, s?: string) => {
    const params = new URLSearchParams();
    if (t) params.set('tipo', t);
    if (s) params.set('sort', s);
    const str = params.toString();
    return `/idioma/${lang}${str ? `?${str}` : ''}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <Header />

      <div className="max-w-7xl mx-auto w-full px-4 py-10 flex-1">
        {/* Page heading */}
        <div className="flex items-center gap-4 mb-8">
          <span className={`fi ${langInfo.flagClass} rounded text-4xl w-10 h-7 overflow-hidden shadow-lg`} />
          <div>
            <h1 className="text-3xl font-black text-white">Idioma {langInfo.label}</h1>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
              {count} TÍTULO{count !== 1 ? 'S' : ''} ENCONTRADO{count !== 1 ? 'S' : ''}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {/* Tipo tabs */}
          {TIPOS.map(t => (
            <Link
              key={t.key ?? 'all'}
              href={buildUrl(t.key, sort)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                tipo === t.key
                  ? 'bg-[#00d0d0] text-black'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a20]'
              }`}
            >
              {t.label}
            </Link>
          ))}

          <div className="w-px h-5 bg-[#1f1f23] mx-1" />

          {/* Sort */}
          {[
            { key: 'recent', label: 'Recientes' },
            { key: 'rating', label: 'Mejor Valoradas' },
          ].map(s => (
            <Link
              key={s.key}
              href={buildUrl(tipo, s.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                sort === s.key
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a20]'
              }`}
            >
              {s.label}
            </Link>
          ))}

          {/* Language switcher */}
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            {Object.entries(LANGUAGE_MAP).map(([code, info]) => (
              <Link
                key={code}
                href={`/idioma/${code}${tipo ? `?tipo=${tipo}` : ''}`}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                  code === lang
                    ? 'bg-[#00d0d0]/10 border-[#00d0d0]/40 text-[#00d0d0]'
                    : 'border-[#1f1f23] text-gray-400 hover:text-white hover:border-[#00d0d0]/30'
                }`}
              >
                <span className={`fi ${info.flagClass} rounded-sm w-3.5 h-2.5 overflow-hidden`} />
                {info.label}
              </Link>
            ))}
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
            <span className={`fi ${langInfo.flagClass} rounded text-5xl w-14 h-10 overflow-hidden mb-6 opacity-30`} />
            <p className="text-gray-500 text-lg font-medium">
              Aún no hay contenido en <span className="text-white">{langInfo.label}</span>.
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Pronto añadiremos más títulos en este idioma.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
