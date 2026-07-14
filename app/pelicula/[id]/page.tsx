import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdBanner } from '@/components/AdBanner';
import { MovieCard } from '@/components/MovieCard';
import { CommentsSection } from '@/components/CommentsSection';
import { MovieActions } from '@/components/MovieActions';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { data: movie } = await supabaseAdmin.from('movies').select('title, original_title, description, cover_url, backdrop_url, release_year, genres, category, rating, audio_languages').eq('id', id).single();
  if (!movie) return { title: 'No encontrado' };

  const type = movie.category === 'SeriesTV' ? 'Serie TV' : movie.category === 'Anime' ? 'Anime' : 'Película';
  const langs = (movie.audio_languages || []).join(', ');
  const genres = (movie.genres || []).slice(0, 3).join(', ');
  
  // Rich title optimized for searches like "descargar Obsesión 2025"
  const title = `${movie.title}${movie.release_year ? ` (${movie.release_year})` : ''} - Descargar ${type} HD | PAPUMOVIE`;
  
  // Description includes quality signals and keywords
  const baseDesc = movie.description?.slice(0, 120) || '';
  const description = baseDesc
    ? `${baseDesc}... Descargar ${movie.title} en HD${langs ? ` con audio en ${langs}` : ''}.`
    : `Descargar ${movie.title}${movie.release_year ? ` (${movie.release_year})` : ''} en HD${langs ? ` - Audio: ${langs}` : ''}${genres ? ` - Género: ${genres}` : ''}. Descarga gratis en PAPUMOVIE.`;

  const image = movie.backdrop_url || movie.cover_url;
  const keywords = [
    `descargar ${movie.title}`,
    `${movie.title} ${movie.release_year || ''}`,
    `${movie.title} latino`,
    `${movie.title} hd`,
    `${movie.title} 1080p`,
    movie.original_title ? `${movie.original_title}` : '',
    ...(movie.genres || []),
    `${type} ${movie.release_year || ''}`,
  ].filter(Boolean);

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'video.movie',
      url: `https://papumoviemkv.store/pelicula/${id}`,
      images: image ? [{ url: image, width: 1280, height: 720, alt: movie.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: `https://papumoviemkv.store/pelicula/${id}`,
    },
  };
}

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  let isVip = false;
  if (session?.user) {
    const { data: profile } = await supabase.from('profiles').select('role, vip_until').eq('id', session.user.id).single();
    
    // Check if VIP is expired
    const isVipExpired = profile?.role === 'vip' && profile?.vip_until && new Date(profile.vip_until) < new Date();
    
    isVip = (!isVipExpired && profile?.role === 'vip') || profile?.role === 'admin';
  }

  const { data: movie, error } = await supabase.from('movies').select('*').eq('id', id).single();
  if (error || !movie) notFound();

  const { data: cast } = await supabase.from('cast_members').select('*').eq('movie_id', id).order('order_index', { ascending: true });
  const { data: screenshots } = await supabase.from('screenshots').select('image_url').eq('movie_id', id);

  const director = cast?.find(c => c.role.toLowerCase() === 'director' || c.role.toLowerCase() === 'directing');
  const actors = cast?.filter(c => c.role.toLowerCase() !== 'director' && c.role.toLowerCase() !== 'directing') || [];

  const { data: relatedMovies } = await supabase
    .from('movies')
    .select('*')
    .eq('category', movie.category)
    .neq('id', movie.id)
    .order('created_at', { ascending: false })
    .limit(8);

  const { data: comments } = await supabase
    .from('comments')
    .select('*, profiles(username, role, avatar_url, name_color)')
    .eq('movie_id', id)
    .order('created_at', { ascending: false });

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': movie.category === 'SeriesTV' ? 'TVSeries' : 'Movie',
              'name': movie.title,
              'alternateName': movie.original_title || undefined,
              'description': movie.description || undefined,
              'image': movie.backdrop_url || movie.cover_url || undefined,
              'datePublished': movie.release_year ? `${movie.release_year}-01-01` : undefined,
              'genre': movie.genres || [],
              ...(movie.rating ? {
                'aggregateRating': {
                  '@type': 'AggregateRating',
                  'ratingValue': movie.rating,
                  'bestRating': 10,
                  'worstRating': 1,
                  'ratingCount': 100,
                },
              } : {}),
              ...(director ? {
                'director': { '@type': 'Person', 'name': director.name },
              } : {}),
              ...(actors.length > 0 ? {
                'actor': actors.slice(0, 5).map(a => ({ '@type': 'Person', 'name': a.name })),
              } : {}),
              'url': `https://papumoviemkv.store/pelicula/${id}`,
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://papumoviemkv.store' },
                { '@type': 'ListItem', 'position': 2, 'name': movie.category === 'SeriesTV' ? 'Series' : 'Películas', 'item': movie.category === 'SeriesTV' ? 'https://papumoviemkv.store/series' : 'https://papumoviemkv.store/peliculas' },
                { '@type': 'ListItem', 'position': 3, 'name': movie.title, 'item': `https://papumoviemkv.store/pelicula/${id}` },
              ],
            },
          ]),
        }}
      />
      <Header />
      <div className="flex flex-col sm:block overflow-x-hidden w-full text-text-primary bg-background">
      
      {/* Breadcrumb (Order 0) */}
      <div className="order-0">
        <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-4 pt-3 pb-3">
          <ol className="flex items-center gap-1 text-xs text-text-secondary">
            <li><Link href="/" className="hover:text-text-primary transition-colors">Inicio</Link></li>
            <li><svg xmlns="http://www.w3.org/2000/svg" className="size-3 text-text-secondary/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg></li>
            <li><span className="hover:text-text-primary transition-colors cursor-pointer">Películas</span></li>
            <li><svg xmlns="http://www.w3.org/2000/svg" className="size-3 text-text-secondary/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg></li>
            <li className="text-text-primary truncate max-w-50 sm:max-w-none">{movie.title}</li>
          </ol>
        </nav>
      </div>

      {/* Hero Section (Order 1) */}
      <div className="order-1">
        <div className="relative overflow-hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 h-80 overflow-hidden">
            {movie.backdrop_url && (
              <img src={movie.backdrop_url} alt={movie.title} className="object-cover opacity-20 size-full" />
            )}
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-background"></div>
          </div>
          
          <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 text-center md:text-left">
              {/* Poster */}
              <div className="relative w-48 md:w-56 shrink-0 aspect-2/3 rounded-lg overflow-hidden bg-surface-hover shadow-lg border border-border">
                {movie.cover_url && (
                  <img src={movie.cover_url} alt={movie.title} className="object-cover size-full absolute inset-0" />
                )}
                {movie.rating && (
                  <div className="z-10 flex items-center gap-1 rounded-md bg-black/80 backdrop-blur-md ring-1 ring-white/10 shadow-lg px-2 py-1 absolute top-2 left-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="text-white fill-white size-3" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span className="font-bold text-white tabular-nums text-xs leading-none">{movie.rating.toFixed(1)}</span>
                    <span className="text-[9px] text-white/70 font-bold uppercase">TMDB</span>
                  </div>
                )}
              </div>

              {/* Data */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary leading-tight">
                  {movie.title} {movie.format && (movie.format.startsWith('[') ? movie.format : `[${movie.format}]`)} <span className="text-text-secondary font-normal ml-2 opacity-60">({movie.release_year})</span>
                </h2>
                
                {movie.original_title && (
                  <p className="text-sm text-text-secondary mt-1">Título original: {movie.original_title}</p>
                )}

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
                  <span className="px-1.5 py-0.5 text-[10px] uppercase tracking-wider border border-teal-500/30 rounded bg-teal-300/10 text-teal-400 font-bold">Película</span>
                  {movie.rating && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium bg-surface text-accent border border-border">
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-4 fill-current" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      <span className="font-bold text-[15px] leading-none">{movie.rating.toFixed(1)}</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider ml-0.5">TMDB</span>
                    </div>
                  )}
                </div>

                {movie.genres && (
                  <div className="flex flex-wrap justify-center md:justify-start gap-1.5 mt-3">
                    {movie.genres.map((g: string) => (
                      <span key={g} className="px-2 py-0.5 rounded-md bg-surface-hover text-xs text-text-secondary border border-border">
                        {g}
                      </span>
                    ))}
                  </div>
                )}

                <div className="hidden sm:flex flex-wrap items-center gap-1.5 mt-4 justify-center md:justify-start">
                  <span className="text-[10px] uppercase tracking-wider text-text-secondary/60 font-medium mr-1">Formato y calidad:</span>
                  {movie.resolution && <span className="px-3 py-0.5 text-[10px] font-bold uppercase rounded-full text-white bg-[#06b6d4]">{movie.resolution}</span>}
                  {movie.format && <span className="px-3 py-0.5 text-[10px] font-bold uppercase rounded-full text-white bg-[#f43f5e]">{movie.format}</span>}
                </div>

                <div className="hidden sm:flex flex-wrap items-center gap-1.5 mt-2 justify-center md:justify-start">
                  <span className="text-[10px] uppercase tracking-wider text-text-secondary/60 font-medium mr-1">Idiomas:</span>
                  {/* Deduplicar: solo mostrar cada idioma una vez, ignorar codec */}
                  {Array.from<string>(new Set(
                    (movie.audio_languages || [])
                      .filter((l: string) => l.trim())
                      .map((lang: string) => lang.split(/\s+(AC3|AAC|DTS|FLAC|MP3)/i)[0].trim())
                  )).map((langName: string) => {
                    const ll = langName.toLowerCase();
                    return (
                      <span key={langName} className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold uppercase rounded-md text-text-secondary bg-surface border border-border">
                        {ll.includes('latino') ? (
                          <img className="w-3.5 h-auto block" src="https://pelisenhd.org/wp-content/themes/revomovies/assets/img/idiomas/latino.svg" alt="Latino" />
                        ) : ll.includes('castellano') ? (
                          <img className="w-3.5 h-auto block" src="https://pelisenhd.org/wp-content/themes/revomovies/assets/img/idiomas/castellano.svg" alt="Castellano" />
                        ) : ll.includes('ingl') ? (
                          <img className="w-3.5 h-auto block" src="https://pelisenhd.org/wp-content/themes/revomovies/assets/img/idiomas/ingles.svg" alt="Inglés" />
                        ) : ll.includes('japon') ? (
                          <img className="w-3.5 h-auto block" src="https://pelisenhd.org/wp-content/themes/revomovies/assets/img/idiomas/japones.svg" alt="Japonés" />
                        ) : ll.includes('corean') ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className="w-4 h-auto block" aria-label="Coreano">
                            <rect width="900" height="600" fill="white"/>
                            <g transform="translate(450,300)">
                              <circle r="120" fill="#c60c30"/>
                              <path d="M 0,-120 A 60,60,0,0,1,0,0 A 60,60,0,0,0,0,120 A 120,120,0,0,1,0,-120Z" fill="#003478"/>
                            </g>
                            <g stroke="black" strokeWidth="16" transform="translate(450,300)">
                              <line x1="-220" y1="-166" x2="-152" y2="-56" transform="rotate(-56.3)"/>
                              <line x1="-220" y1="-140" x2="-152" y2="-30" transform="rotate(-56.3)"/>
                              <line x1="-220" y1="-114" x2="-152" y2="-4" transform="rotate(-56.3)"/>
                            </g>
                          </svg>
                        ) : ll.includes('franc') ? (
                          <span className="text-sm leading-none">🇫🇷</span>
                        ) : ll.includes('portugu') ? (
                          <span className="text-sm leading-none">🇧🇷</span>
                        ) : ll.includes('aleman') || ll.includes('alemán') ? (
                          <span className="text-sm leading-none">🇩🇪</span>
                        ) : (
                          <span className="text-sm leading-none">🌍</span>
                        )}
                        {langName}
                      </span>
                    );
                  })}
                </div>

                <div className="hidden sm:block mt-6">
                  <p className="text-[13px] text-text-secondary leading-relaxed line-clamp-3 sm:line-clamp-6">{movie.description}</p>
                </div>

                <MovieActions movie={movie} />

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ANUNCIO (Order 2) */}
      <div className="order-2 mt-2">
        <div className="max-w-6xl mx-auto px-4 mb-6 lg:mb-8">
          <div className="flex items-center justify-center">
            {!isVip ? (
              <AdBanner />
            ) : (
              <div className="w-full max-w-[728px] h-[90px] bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center justify-center overflow-hidden relative group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent animate-[shimmer_3s_infinite] group-hover:via-yellow-500/20 transition-all duration-500"></div>
                
                <div className="z-10 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-2 text-yellow-500 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
                    <span className="text-sm uppercase tracking-[0.2em] font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 drop-shadow-sm">Membresía Premium</span>
                  </div>
                  <p className="text-yellow-500/70 text-[11px] font-medium tracking-wide">Disfrutando de una experiencia sin publicidad</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Info (Order 3) */}
      <div className="order-3">
        {/* Información general box */}
        <div className="max-w-6xl mx-auto px-4 mb-4 lg:mb-6 order-1">
          <div className="bg-surface border border-border rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12H3"/><path d="M16 6H3"/><path d="M12 18H3"/><path d="m16 12 5 3-5 3v-6Z"/></svg>
              <h2 className="text-xs uppercase tracking-widest text-text-secondary font-medium font-mono">Información general</h2>
            </div>
            <div className="text-text-secondary leading-relaxed text-[13px] md:text-sm">
              <p className="mb-4">{movie.description}</p>
              
              <details className="border border-border rounded-xl bg-background overflow-hidden mt-6 group" open>
                <summary className="flex items-center justify-between px-4 py-3 bg-surface border-b border-border cursor-pointer list-none [&::-webkit-details-marker]:hidden outline-none">
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-text-secondary uppercase tracking-widest">
                    <span className="text-accent text-sm leading-none">{'{ }'}</span> INFORMACIÓN GENERAL LATINO
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-text-secondary/50 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </summary>
                
                <div className="p-4 md:p-5 text-xs font-mono text-gray-300 space-y-1.5 bg-background">
                  <div><span className="text-accent font-semibold">Titulo Original:</span> {movie.original_title || movie.title}</div>
                  <div><span className="text-accent font-semibold">Resolución:</span> {movie.resolution}</div>
                  <div><span className="text-accent font-semibold">Formato:</span> {movie.format}</div>
                  <div>
                    {movie.audio_languages && movie.audio_languages.length > 0 ? (
                      movie.audio_languages.filter((l: string) => l.trim()).map((lang: string, idx: number) => (
                        <span key={lang}>
                          {idx > 0 && <span className="text-white/30 mx-1">|</span>}
                          <span className="text-accent font-semibold">Audio #{idx + 1}:</span> {lang}
                        </span>
                      ))
                    ) : (
                      <><span className="text-accent font-semibold">Audio #1:</span> Latino AC3 5.1</>
                    )}
                  </div>
                  <div><span className="text-accent font-semibold">Subtítulos:</span> {movie.subtitles?.join(', ') || 'Español, Inglés'}</div>
                  <div><span className="text-accent font-semibold">Duración:</span> {movie.duration_minutes} Min.</div>
                  <div><span className="text-accent font-semibold">Tamaño del Archivo:</span> {movie.file_size}</div>
                  <div><span className="text-accent font-semibold">Contraseña:</span> {movie.password || 'papumoviemkv.store'}</div>
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Enlaces de Descarga */}
        <div className="max-w-6xl mx-auto px-4 mb-4 lg:mb-6">
          <div className="bg-surface border border-border rounded-xl p-4 overflow-hidden">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-text-secondary font-medium font-mono">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Enlaces de Descarga
              </div>
            </div>

            <div id="rm-links-list" className="flex flex-col gap-2.5">
              
              {/* Enlace VIP */}
              <div className="group flex flex-col sm:flex-row items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-warning/10 via-warning/5 to-transparent border-warning/30 shadow-lg shadow-warning/10 z-10 mb-1 hover:bg-surface-hover transition-all duration-300 border">
                <div className="flex items-center gap-3 w-full sm:w-1/4">
                  <div className="size-10 rounded-lg bg-surface flex items-center justify-center border border-accent/10 group-hover:scale-105 transition-transform shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-warning drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 8-10 10L2 11z"/><path d="M11 3 8 11h8l-3-8"/><path d="M2 11h20"/></svg>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-warning truncate leading-none mb-1">Enlaces VIP</span>
                    <span className="text-[9px] uppercase font-mono text-text-secondary/60 tracking-wider">Descarga</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 flex-grow">
                  <span className="px-2 py-0.5 rounded border border-warning/40 bg-warning/10 text-warning text-[10px] font-bold uppercase">PREMIUM</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase border bg-violet-500/10 text-violet-400 border-violet-500/20">LAT/CAS</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border bg-indigo-500/10 text-indigo-400 border-indigo-500/20 uppercase">VIP</span>
                </div>

                <div className="w-full sm:w-auto mt-2 sm:mt-0">
                  {isVip ? (
                    <Link href={`/links/${movie.id}?type=vip`} target="_blank" className="w-full">
                      <button className="flex items-center justify-center gap-2 px-6 py-2 rounded bg-warning text-black hover:bg-amber-400/90 transition-all text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-warning/20 active:scale-95 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                        ENLACES VIP
                      </button>
                    </Link>
                  ) : (
                    <Link href="/membresia-vip" className="w-full">
                      <button className="flex items-center justify-center gap-2 px-6 py-2 rounded bg-surface border border-border text-text-secondary hover:bg-surface-hover transition-all text-[11px] font-bold uppercase tracking-widest active:scale-95 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        BLOQUEADO
                      </button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Enlace Free */}
              <div className="group flex flex-col sm:flex-row items-center gap-3 p-3 rounded-lg bg-surface-hover/50 border-white/5 hover:bg-surface-hover transition-all duration-300 border">
                <div className="flex items-center gap-3 w-full sm:w-1/4">
                  <div className="size-10 rounded-lg bg-surface flex items-center justify-center border border-accent/10 group-hover:scale-105 transition-transform shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8"/><path d="m16 6-4 4-4-4"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 18h.01"/><path d="M10 18h.01"/></svg>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-text-primary truncate leading-none mb-1">Enlaces Públicos</span>
                    <span className="text-[9px] uppercase font-mono text-text-secondary/60 tracking-wider">Descarga</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 flex-grow">
                  <span className="px-2 py-0.5 rounded border border-accent/20 bg-accent/5 text-accent text-[10px] font-bold uppercase">4K UHD</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase border bg-violet-500/10 text-violet-400 border-violet-500/20">LAT/CAS</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border bg-indigo-500/10 text-indigo-400 border-indigo-500/20 uppercase">FREE</span>
                </div>

                <div className="w-full sm:w-auto mt-2 sm:mt-0">
                  <Link href={`/links/${movie.id}?type=free`} target="_blank" className="w-full">
                    <button className="flex items-center justify-center gap-2 px-6 py-2 rounded bg-accent/10 hover:bg-accent text-accent hover:text-white border border-accent/20 transition-all text-[11px] font-bold uppercase tracking-widest active:scale-95 w-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                      ENLACES FREE
                    </button>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Cast Section (Order 4) */}
      <div className="order-4">
        <div className="max-w-6xl mx-auto px-4 mb-4 lg:mb-6">
          <div className="bg-surface border border-border rounded-xl p-4">
            {director && (
              <p className="text-sm mb-3">
                <span className="text-text-secondary">Director: </span>
                <span className="text-text-primary text-sm font-medium hover:text-accent transition-colors">{director.name}</span>
              </p>
            )}
            
            <h2 className="hidden sm:flex items-center gap-1 text-xs uppercase tracking-widest text-text-secondary font-medium font-mono mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="m22 9.75-1.5.8 0.3 1.7-1.3-1-1.3 1 0.3-1.7-1.5-.8h1.7l0.8-1.5 0.8 1.5h1.7z"/></svg>
              Reparto
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-2">
              {actors.map(actor => (
                <div key={actor.id} className="flex items-center gap-2 p-1.5 rounded-lg bg-surface-hover/50 hover:bg-surface-hover transition-colors">
                  {actor.photo_url ? (
                    <img alt={actor.name} className="rounded-full object-cover size-9 shrink-0" src={actor.photo_url} />
                  ) : (
                    <div className="rounded-full bg-surface size-9 border border-border flex items-center justify-center text-xs">A</div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{actor.name}</p>
                    <p className="text-[10px] text-text-secondary truncate">{actor.character_name || actor.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trailer & Capturas */}
        <div className="max-w-6xl mx-auto px-4 mb-4 lg:mb-6">
          <div className="bg-surface border border-border rounded-xl p-4">
            <h2 className="hidden sm:flex items-center gap-1 text-xs uppercase tracking-widest text-text-secondary font-medium font-mono mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              Trailer y capturas
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-3 sm:mt-0 px-0.5">
              {movie.trailer_url && (
                <div className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer col-span-2 row-span-2 shadow-sm border border-border">
                  <img src={movie.backdrop_url || movie.cover_url} className="object-cover size-full" alt="Trailer" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 ring-1 ring-white/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-white fill-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                      <span className="text-white text-sm font-medium">Tráiler</span>
                    </div>
                  </div>
                </div>
              )}
              {screenshots?.map((s: any, idx: number) => (
                <div key={idx} className="group relative aspect-video rounded-lg overflow-hidden bg-surface-hover border border-border hover:border-rose-500/50 hover:ring-2 hover:ring-rose-500/25 transition-all duration-300 cursor-pointer">
                  <img src={s.image_url} alt={`Captura ${idx+1}`} className="object-cover size-full group-hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <CommentsSection movieId={movie.id} session={session} comments={comments || []} />

        {/* Related Movies */}
        {relatedMovies && relatedMovies.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 mb-8 lg:mb-12 mt-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              También te puede interesar
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {relatedMovies.slice(0, 6).map((movie: any) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
      <Footer />
    </>
  );
}
