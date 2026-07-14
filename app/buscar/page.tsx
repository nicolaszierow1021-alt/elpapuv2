import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import { Search, Users, Calendar, ChevronDown, PlayCircle, MonitorPlay } from 'lucide-react';

export const revalidate = 0;

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tipo?: string; genre?: string; year?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() || '';
  const tipo = params.tipo || '';
  const genre = params.genre || '';
  const year = params.year || '';

  let results: any[] = [];
  let allGenres: string[] = [];
  let years: number[] = [];

  if (query.length >= 2) {
    // Use the search_movies RPC function which uses unaccent() to match
    // regardless of accents (e.g. "obsesion" matches "Obsesión")
    let dbQuery = supabaseAdmin.rpc('search_movies', { search_term: query }) as any;
    
    const { data: allData } = await dbQuery;
    let filtered: any[] = allData || [];
    
    if (tipo === 'peliculas') filtered = filtered.filter((m: any) => !m.category || m.category === 'Película');
    else if (tipo === 'series') filtered = filtered.filter((m: any) => m.category === 'SeriesTV');
    if (year) filtered = filtered.filter((m: any) => String(m.release_year) === year);
    if (genre) filtered = filtered.filter((m: any) => (m.genres || []).includes(genre));

    results = filtered;
    
    // Extract genres and years from all results (before filter)
    const base = allData || [];
    const baseTipo = tipo === 'peliculas' ? base.filter((m: any) => !m.category || m.category === 'Película')
                   : tipo === 'series' ? base.filter((m: any) => m.category === 'SeriesTV')
                   : base;
    allGenres = Array.from(new Set(baseTipo.flatMap((m: any) => m.genres || []))).sort() as string[];
    years = Array.from(new Set(baseTipo.map((m: any) => m.release_year).filter(Boolean))).sort((a: any, b: any) => b - a) as number[];
  }

  const buildUrl = (updates: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    if (query) p.set('q', query);
    const newParams = { tipo, genre, year, ...updates };
    if (newParams.tipo) p.set('tipo', newParams.tipo);
    if (newParams.genre) p.set('genre', newParams.genre);
    if (newParams.year) p.set('year', newParams.year);
    return `/buscar?${p.toString()}`;
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <Header />

      <div className="max-w-7xl mx-auto w-full px-4 py-8 flex-1 flex flex-col">
        
        {!query && (
           <form action="/buscar" method="get" className="max-w-2xl mx-auto my-12 w-full">
            <div className="relative flex bg-surface rounded-2xl border border-border overflow-hidden shadow-xl focus-within:border-[#00d0d0]/50 focus-within:ring-2 focus-within:ring-[#00d0d0]/20 transition-all">
              <Search className="absolute top-1/2 -translate-y-1/2 left-5 w-5 h-5 text-gray-500" />
              <input
                type="text"
                name="q"
                placeholder="Escribe el nombre de la película o serie..."
                autoFocus
                className="flex-1 bg-transparent pl-13 pr-4 py-4 text-white placeholder:text-gray-600 outline-none text-base"
              />
              <button type="submit" className="px-8 py-4 bg-accent hover:bg-accent/90 text-black font-bold transition-colors">
                Buscar
              </button>
            </div>
          </form>
        )}

        {query && (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-border pb-6">
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                  <Search className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-white mb-0.5 flex flex-wrap gap-2">
                    Resultados para: <span className="font-normal text-gray-300">"{query}"</span>
                  </h1>
                  <p className="text-sm font-medium text-gray-500">
                    {results.length} coincidencia{results.length !== 1 ? 's' : ''} de búsqueda
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex bg-surface border border-border p-1 rounded-lg gap-1">
                  <Link href={buildUrl({ tipo: undefined })} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${!tipo ? 'bg-rose-500/20 text-rose-400' : 'text-gray-400 hover:text-white'}`}>Todo</Link>
                  <Link href={buildUrl({ tipo: 'peliculas' })} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${tipo === 'peliculas' ? 'bg-rose-500/20 text-rose-400' : 'text-gray-400 hover:text-white'}`}>Películas</Link>
                  <Link href={buildUrl({ tipo: 'series' })} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${tipo === 'series' ? 'bg-rose-500/20 text-rose-400' : 'text-gray-400 hover:text-white'}`}>Series</Link>
                </div>

                <div className="relative group z-30">
                  <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:border-gray-700 transition-colors">
                    {genre || 'Todos los Géneros'}
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                  </button>
                  <div className="absolute top-full right-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                    <div className="bg-surface border border-border rounded-lg shadow-xl py-2 max-h-64 overflow-y-auto">
                      <Link href={buildUrl({ genre: undefined })} className="block px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-surface-hover">Todos los Géneros</Link>
                      {allGenres.map(g => (
                        <Link key={g} href={buildUrl({ genre: g })} className={`block px-4 py-2 text-xs hover:bg-surface-hover ${genre === g ? 'text-accent' : 'text-gray-300 hover:text-white'}`}>{g}</Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative group z-30">
                  <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:border-gray-700 transition-colors">
                    {year || 'Cualquier Año'}
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                  </button>
                  <div className="absolute top-full right-0 pt-2 w-36 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                    <div className="bg-surface border border-border rounded-lg shadow-xl py-2 max-h-64 overflow-y-auto">
                      <Link href={buildUrl({ year: undefined })} className="block px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-surface-hover">Cualquier Año</Link>
                      {years.map(y => (
                        <Link key={y} href={buildUrl({ year: String(y) })} className={`block px-4 py-2 text-xs hover:bg-surface-hover ${year === String(y) ? 'text-accent' : 'text-gray-300 hover:text-white'}`}>{y}</Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 max-w-5xl w-full">
              {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Search className="w-12 h-12 text-gray-800 mb-4" />
                  <p className="text-gray-400 text-lg font-bold mb-2">Sin resultados con esos filtros</p>
                </div>
              ) : (
                results.map(movie => {
                  const isSeries = movie.category === 'SeriesTV';
                  
                  return (
                    <Link key={movie.id} href={`/pelicula/${movie.id}`} className="group flex flex-col sm:flex-row bg-[#101014] border border-border rounded-lg overflow-hidden hover:border-[#00d0d0]/40 transition-all">
                      
                      {/* Image - Smaller */}
                      <div className="relative w-full sm:w-[90px] shrink-0 aspect-[2/3] sm:aspect-auto sm:h-[135px]">
                        {movie.cover_url ? (
                          <img src={movie.cover_url} alt={movie.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-surface-hover flex items-center justify-center">
                            <Search className="w-6 h-6 text-gray-700" />
                          </div>
                        )}
                        
                        {movie.rating && (
                          <div className="absolute top-1.5 left-1.5 bg-black/80 backdrop-blur-sm border border-white/10 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-md">
                            <span className="text-yellow-400">★</span> {movie.rating.toFixed(1)}
                          </div>
                        )}
                      </div>

                      {/* Content - Reduced padding */}
                      <div className="flex-1 p-3.5 flex flex-col relative justify-center">
                        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                          {movie.resolution && (
                            <span className="bg-accent text-black text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                              {movie.resolution.split(' ')[0]}
                            </span>
                          )}
                          {movie.format && (
                            <span className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                              {movie.format.split(' ')[0]}
                            </span>
                          )}
                        </div>

                        <div className="pr-20 mb-2">
                          <h2 className="text-base font-bold text-white group-hover:text-accent transition-colors leading-tight mb-0.5">
                            {movie.title} {movie.format && !movie.title.includes(movie.format) ? `[${movie.format}]` : ''} {movie.release_year && !movie.title.includes(String(movie.release_year)) ? movie.release_year : ''}
                          </h2>
                          {movie.original_title && movie.original_title !== movie.title && (
                            <p className="text-[11px] text-gray-500 font-medium">{movie.original_title}</p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-2.5">
                          <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                            {isSeries ? <MonitorPlay className="w-3 h-3" /> : <PlayCircle className="w-3 h-3" />}
                            {isSeries ? 'SERIE' : 'PELÍCULA'}
                          </div>
                          
                          {movie.release_year && (
                            <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                              <Calendar className="w-3 h-3" />
                              {movie.release_year}
                            </div>
                          )}

                          <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                            <Users className="w-3 h-3" />
                            {Math.floor(Math.random() * 5 + 1)}K
                          </div>

                          {movie.genres && movie.genres.length > 0 && (
                            <div className="flex items-center gap-1 ml-auto sm:ml-0">
                              {movie.genres.slice(0, 2).map((g: string) => (
                                <span key={g} className="text-[9px] text-gray-400 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-full">
                                  {g}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-1 sm:line-clamp-2 mt-auto font-medium italic">
                          "{movie.description || 'Sin sinopsis disponible.'}"
                        </p>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
