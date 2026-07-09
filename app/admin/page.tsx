export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { Plus, Edit, Film, Tv, PlaySquare, ArrowLeft, Activity, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabaseAdmin } from '@/lib/supabase';
import Image from 'next/image';
import { DeleteMovieButton } from '@/components/DeleteMovieButton';
import { VipManager } from './VipManager';
import { AdminSearch } from './AdminSearch';

export default async function AdminDashboard({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || '';
  
  let supabaseQuery = supabaseAdmin
    .from('movies')
    .select('id, title, original_title, release_year, cover_url, created_at, category')
    .order('created_at', { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,original_title.ilike.%${query}%`);
  }

  const { data: movies, error } = await supabaseQuery;

  // Calculamos algunas métricas rápidas (en un caso real podrían venir de counts directos a DB)
  const totalPeliculas = movies?.filter(m => m.category === 'Película').length || 0;
  const totalSeries = movies?.filter(m => m.category === 'SeriesTV').length || 0;
  const totalAnime = movies?.filter(m => m.category === 'Anime').length || 0;

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-[#00d0d0]/30">
      {/* Top Navigation Admin */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-[#1f1f23]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center justify-center gap-2 px-3 h-8 rounded-lg bg-[#121215] border border-[#1f1f23] text-gray-400 hover:text-white hover:border-[#00d0d0]/50 transition-all text-xs font-semibold">
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Inicio</span>
            </Link>
            <div className="h-4 w-px bg-[#1f1f23]"></div>
            <div className="flex items-center gap-2 group cursor-default">
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#00d0d0] to-[#0070f3] flex items-center justify-center shadow-[0_0_15px_rgba(0,208,208,0.3)] animate-pulse group-hover:animate-none group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(0,208,208,0.6)] transition-all duration-300">
                <Activity className="w-3.5 h-3.5 text-white animate-bounce" />
              </div>
              <span className="font-black text-white tracking-tight text-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#00d0d0] group-hover:to-[#0070f3] transition-all duration-300">Admin Workspace</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/add">
              <Button className="rounded-md font-bold bg-white !text-black hover:bg-gray-200 h-9 px-4 text-xs shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all border-none">
                <Plus className="w-3.5 h-3.5 mr-1.5 stroke-[3]" />
                Nuevo Contenido
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0a0a0f] border border-[#1f1f23] rounded-xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-cyan-500/10 transition-colors"></div>
            <div className="flex items-center gap-3 mb-3 text-cyan-500">
              <Film className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Películas Totales</h3>
            </div>
            <p className="text-3xl font-black text-white">{totalPeliculas}</p>
          </div>
          
          <div className="bg-[#0a0a0f] border border-[#1f1f23] rounded-xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-violet-500/10 transition-colors"></div>
            <div className="flex items-center gap-3 mb-3 text-violet-500">
              <Tv className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Series de TV</h3>
            </div>
            <p className="text-3xl font-black text-white">{totalSeries}</p>
          </div>

          <div className="bg-[#0a0a0f] border border-[#1f1f23] rounded-xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-orange-500/10 transition-colors"></div>
            <div className="flex items-center gap-3 mb-3 text-orange-500">
              <PlaySquare className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Anime</h3>
            </div>
            <p className="text-3xl font-black text-white">{totalAnime}</p>
          </div>

          <div className="bg-[#0a0a0f] border border-[#1f1f23] rounded-xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-yellow-500/10 transition-colors"></div>
            <div className="flex items-center gap-3 mb-3 text-yellow-500">
              <Users className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Catálogo Global</h3>
            </div>
            <p className="text-3xl font-black text-white">{movies?.length || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Main Content Area */}
          <div className="xl:col-span-3 order-2 xl:order-1">
            <div className="bg-[#0a0a0f] border border-[#1f1f23] rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-5 border-b border-[#1f1f23] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d0d12]">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Gestión de Catálogo
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Administra tus películas y series ({movies?.length || 0} ítems)</p>
                </div>
                <div className="w-full sm:w-auto">
                  <AdminSearch />
                </div>
              </div>

              <div className="p-5 bg-[#0a0a0f]">
                {error ? (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm font-medium">
                    Error al cargar el catálogo: {error.message}
                  </div>
                ) : movies && movies.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {movies.map((movie) => (
                      <div key={movie.id} className="group relative rounded-xl overflow-hidden bg-[#121215] border border-[#1f1f23] hover:border-[#00d0d0]/50 transition-all duration-300">
                        <div className="aspect-[2/3] relative">
                          {movie.cover_url ? (
                            <Image src={movie.cover_url} alt={movie.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                          ) : (
                            <div className="w-full h-full bg-[#1a1a1a] flex flex-col items-center justify-center text-gray-700 p-4 text-center">
                              <Film className="w-8 h-8 mb-2 opacity-50" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Sin Portada</span>
                            </div>
                          )}
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-90 transition-opacity" />
                          
                          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                            {movie.category && (
                              <span className={`inline-flex px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md backdrop-blur-md border shadow-lg ${
                                movie.category === 'SeriesTV' ? 'bg-violet-500/20 text-violet-300 border-violet-500/30' : 
                                movie.category === 'Anime' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
                                'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                              }`}>
                                {movie.category === 'SeriesTV' ? 'Serie' : movie.category}
                              </span>
                            )}
                          </div>
                          
                          <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col justify-end min-h-[40%]">
                            <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 mb-1 group-hover:text-[#00d0d0] transition-colors">{movie.title}</h3>
                            <p className="text-[10px] text-gray-400 font-mono">{movie.release_year}</p>
                          </div>

                          <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 z-10">
                            <Link href={`/admin/edit/${movie.id}`}>
                              <button className="bg-[#121215]/80 backdrop-blur-md p-2 rounded-lg text-white hover:bg-[#00d0d0] hover:text-black border border-[#1f1f23] transition-colors shadow-lg" title="Editar">
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            </Link>
                            <DeleteMovieButton id={movie.id} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-[#0d0d12] rounded-xl border border-dashed border-[#1f1f23]">
                    <div className="w-16 h-16 bg-[#121215] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#1f1f23]">
                      <Film className="w-6 h-6 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Sin resultados</h3>
                    <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">No se encontraron películas que coincidan con tu búsqueda o tu catálogo está vacío.</p>
                    <Link href="/admin/add">
                      <Button className="bg-white !text-black hover:bg-gray-200 text-sm font-bold border-none">
                        Añadir Contenido
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="xl:col-span-1 order-1 xl:order-2 flex flex-col gap-6">
            <VipManager />
            
            <div className="bg-[#0a0a0f] border border-[#1f1f23] rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                Estado del Sistema
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Base de datos</span>
                    <span className="text-emerald-400 font-mono">OK</span>
                  </div>
                  <div className="h-1.5 bg-[#1f1f23] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Almacenamiento</span>
                    <span className="text-cyan-400 font-mono">Activo</span>
                  </div>
                  <div className="h-1.5 bg-[#1f1f23] rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 w-[60%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
