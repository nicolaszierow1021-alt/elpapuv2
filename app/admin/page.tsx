export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabaseAdmin } from '@/lib/supabase';
import Image from 'next/image';
import { DeleteMovieButton } from '@/components/DeleteMovieButton';

export default async function AdminDashboard() {
  const { data: movies, error } = await supabaseAdmin
    .from('movies')
    .select('id, title, release_year, cover_url, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Premium Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#121215] to-[#0a0a0f] border-b border-[#1f1f23] pt-12 pb-8 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full pointer-events-none">
          <div className="absolute inset-0 bg-cyan-500/10 blur-[120px] rounded-full" />
        </div>
        
        <div className="relative max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              Panel de Administración
            </h1>
            <p className="text-gray-400 mt-2 font-medium">Gestiona tu catálogo de películas de forma profesional.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 sm:mt-0">
            <Link href="/">
              <Button variant="outline" className="border-[#1f1f23] text-gray-400 hover:text-white hover:bg-[#1f1f23]">
                Volver a Inicio
              </Button>
            </Link>
            <Link href="/admin/add">
              <Button variant="primary" className="shadow-[0_0_20px_rgba(0,208,208,0.3)] hover:shadow-[0_0_30px_rgba(0,208,208,0.5)] transition-all">
                <Plus className="w-5 h-5 mr-2" />
                Añadir Película
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {error ? (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl">
            Error al cargar las películas: {error.message}
          </div>
        ) : movies && movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.map((movie) => (
              <div key={movie.id} className="group relative rounded-xl overflow-hidden bg-[#121215] border border-[#1f1f23] hover:border-cyan-500/50 transition-all duration-300">
                <div className="aspect-[2/3] relative">
                  {movie.cover_url ? (
                    <Image src={movie.cover_url} alt={movie.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center text-gray-700">Sin Imagen</div>
                  )}
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
                    <h3 className="text-white font-bold text-sm line-clamp-1">{movie.title}</h3>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{movie.release_year} • {new Date(movie.created_at).toLocaleDateString()}</p>
                  </div>

                  {/* Actions Overlay (Glassmorphism) */}
                  <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0 z-10">
                    <Link href={`/admin/edit/${movie.id}`}>
                      <button className="bg-black/50 backdrop-blur-md p-2 rounded-lg text-white/70 hover:bg-cyan-500/20 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/50 transition-all shadow-xl" title="Editar">
                        <Edit className="w-4 h-4" />
                      </button>
                    </Link>
                    <DeleteMovieButton id={movie.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#121215] rounded-2xl border border-[#1f1f23]">
            <div className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#1f1f23]">
              <Plus className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Tu catálogo está vacío</h3>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto">Comienza a añadir las mejores películas para que tus usuarios las disfruten.</p>
            <Link href="/admin/add">
              <Button variant="outline" className="border-gray-700 hover:border-cyan-500 hover:text-cyan-400">
                Añadir tu primera película
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
