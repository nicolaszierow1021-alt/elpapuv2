import React from 'react';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Library, Film, Users, ChevronDown } from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

export default async function ColeccionesPage() {
  // Fetch all movies that belong to a collection
  const { data: movies, error } = await supabase
    .from('movies')
    .select('id, title, collection_id, collection_name, collection_poster_url')
    .not('collection_id', 'is', null);

  if (error) {
    console.error("Error fetching collections:", error);
  }

  // Group movies by collection_id
  const collectionsMap = new Map();
  
  if (movies) {
    movies.forEach(movie => {
      if (!collectionsMap.has(movie.collection_id)) {
        collectionsMap.set(movie.collection_id, {
          id: movie.collection_id,
          name: movie.collection_name,
          poster_url: movie.collection_poster_url,
          movieCount: 0,
          movies: []
        });
      }
      const col = collectionsMap.get(movie.collection_id);
      col.movieCount += 1;
      col.movies.push(movie);
    });
  }

  const collections = Array.from(collectionsMap.values());

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-[#00d0d0]/20">
            <Library className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Colecciones</h1>
            <p className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">
              {collections.length} COLECCIONES DISPONIBLES
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10 pb-4 border-b border-border overflow-x-auto no-scrollbar">
          <div className="flex gap-2 shrink-0">
            <button className="px-4 py-2 rounded-lg bg-accent/10 text-accent text-xs font-bold border border-[#00d0d0]/20 transition-colors">Más Recientes</button>
            <button className="px-4 py-2 rounded-lg bg-surface text-gray-400 hover:text-white border border-border hover:border-gray-500 text-xs font-bold transition-colors">Más Populares</button>
            <button className="px-4 py-2 rounded-lg bg-surface text-gray-400 hover:text-white border border-border hover:border-gray-500 text-xs font-bold transition-colors">A-Z</button>
            <button className="px-4 py-2 rounded-lg bg-surface text-gray-400 hover:text-white border border-border hover:border-gray-500 text-xs font-bold transition-colors">Más Películas</button>
          </div>
          
          <div className="w-px h-8 bg-border hidden lg:block mx-2"></div>
          
          <div className="flex gap-2 shrink-0">
            <button className="px-4 py-2 rounded-lg bg-accent/10 text-accent text-xs font-bold border border-[#00d0d0]/20 transition-colors">Todos</button>
            <button className="px-4 py-2 rounded-lg bg-surface text-gray-400 hover:text-white border border-border hover:border-gray-500 text-xs font-bold transition-colors">Épicas (10+)</button>
            <button className="px-4 py-2 rounded-lg bg-surface text-gray-400 hover:text-white border border-border hover:border-gray-500 text-xs font-bold transition-colors">Sagas (4-9)</button>
            <button className="px-4 py-2 rounded-lg bg-surface text-gray-400 hover:text-white border border-border hover:border-gray-500 text-xs font-bold transition-colors">Trilogías</button>
            <button className="px-4 py-2 rounded-lg bg-surface text-gray-400 hover:text-white border border-border hover:border-gray-500 text-xs font-bold transition-colors">Duologías</button>
          </div>

          <div className="ml-auto shrink-0 flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface text-gray-400 hover:text-white border border-border hover:border-gray-500 text-xs font-bold transition-colors">
              Todos los géneros <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collections Grid */}
        {collections.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {collections.map((col) => (
              <Link href={`/colecciones/${col.id}`} key={col.id} className="group relative rounded-xl overflow-hidden aspect-[2/3] bg-surface border border-border hover:border-[#00d0d0]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,208,208,0.15)] flex flex-col justify-end">
                {col.poster_url ? (
                  <Image src={col.poster_url} alt={col.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-bold text-center p-4">
                    Sin Imagen de Colección
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative p-4 z-10 w-full">
                  <h3 className="text-white font-bold text-sm md:text-base leading-tight mb-3 group-hover:text-accent transition-colors">{col.name}</h3>
                  <div className="flex items-center text-[10px] sm:text-xs text-gray-300 font-medium bg-black/60 backdrop-blur-md px-2 py-1.5 rounded-lg border border-white/10 w-max">
                    <span className="flex items-center gap-1.5"><Film className="w-3.5 h-3.5 text-gray-400" /> {col.movieCount} Películas</span>
                    <span className="mx-2 text-gray-600">|</span>
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-gray-400" /> {(col.movieCount * 25) + 12}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-gray-500">
            <Library className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">No hay colecciones disponibles aún.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
