import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import Image from 'next/image';

export const revalidate = 0; // Se actualiza automáticamente en cada petición (o cambia a 60 para cachear por 1 min)

export default async function PopularesPage() {
  // Fetch 7 most recent movies
  const { data: movies } = await supabaseAdmin
    .from('movies')
    .select('id, title, release_year, cover_url, backdrop_url, rating, description, category')
    .or('category.eq.Película,category.is.null')
    .order('created_at', { ascending: false })
    .limit(7);

  // Fetch 7 most recent series
  const { data: series } = await supabaseAdmin
    .from('movies')
    .select('id, title, release_year, cover_url, backdrop_url, rating, description, category')
    .eq('category', 'SeriesTV')
    .order('created_at', { ascending: false })
    .limit(7);

  const renderTop1Card = (item: any, isMovie: boolean) => {
    if (!item) return null;
    const accentColor = isMovie ? 'text-[#00d0d0]' : 'text-violet-500';
    
    return (
      <Link href={`/pelicula/${item.id}`} className="group block relative w-full h-[400px] md:h-[300px] rounded-2xl overflow-hidden bg-[#121215] border border-[#1f1f23] transition-all hover:border-[#333] mb-6">
        {/* Backdrop Image */}
        <div className="absolute inset-0 md:w-[60%]">
          <img 
            src={item.backdrop_url || item.cover_url} 
            alt={item.title} 
            className="w-full h-full object-cover object-top"
          />
          {/* Gradients to fade into the content */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-[#121215]/50 to-transparent md:hidden" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#121215]/80 to-[#121215] hidden md:block" />
        </div>

        {/* Large Number 1 */}
        <div className={`absolute bottom-4 md:bottom-2 left-6 text-9xl md:text-[160px] font-black leading-none ${accentColor} drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] z-20 font-sans tracking-tighter`}>
          1
        </div>

        {/* Content Box */}
        <div className="absolute inset-0 md:left-[50%] p-6 flex flex-col justify-end md:justify-center z-10">
          <div className="flex items-center gap-3 mb-2">
            {item.rating && (
              <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-0.5 rounded text-xs font-bold text-yellow-500">
                ⭐ {item.rating.toFixed(1)}
              </div>
            )}
            <span className="text-xs text-gray-400">{item.release_year}</span>
            <span className="text-xs text-gray-400">{isMovie ? 'Película' : 'Serie'}</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 line-clamp-1 group-hover:text-white/80 transition-colors">
            {item.title}
          </h2>
          
          <p className="text-sm text-gray-400 line-clamp-3 mb-4 leading-relaxed max-w-lg">
            {item.description}
          </p>

          <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            {(Math.random() * (900 - 100) + 100).toFixed(0)} vistas
          </div>
        </div>
      </Link>
    );
  };

  const renderGridCards = (items: any[], isMovie: boolean) => {
    const accentColor = isMovie ? 'text-[#00d0d0]' : 'text-violet-500';
    return items.slice(1, 7).map((item, index) => (
      <Link key={item.id} href={`/pelicula/${item.id}`} className="group flex flex-col gap-2 relative">
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#121215] border border-[#1f1f23] transition-all duration-300 group-hover:border-gray-500/50">
          <img 
            src={item.cover_url} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
          
          {/* Top Badges */}
          <div className="absolute top-2 right-2 z-20 flex flex-col gap-1 items-end">
            {item.rating && (
              <div className="bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-1">
                ⭐ {item.rating.toFixed(1)}
              </div>
            )}
          </div>

          {/* Views bottom right */}
          <div className="absolute bottom-2 right-2 z-20 text-[10px] text-gray-300 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
             <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
             {(Math.random() * (900 - 100) + 100).toFixed(0)}
          </div>

          {/* Large Number inside poster */}
          <div className={`absolute -bottom-4 left-0 text-[100px] font-black leading-none ${accentColor} drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] z-20 font-sans tracking-tighter`}>
            {index + 2}
          </div>
        </div>

        {/* Title below poster */}
        <div className="mt-1">
          <h3 className="font-bold text-[13px] text-gray-200 line-clamp-1 group-hover:text-white transition-colors">
            {item.title}
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {item.release_year} - {isMovie ? 'Película' : 'Serie'}
          </p>
        </div>
      </Link>
    ));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Section: Películas */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">Películas más populares</h1>
          </div>

          {movies && movies.length > 0 && (
            <>
              {renderTop1Card(movies[0], true)}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
                {renderGridCards(movies, true)}
              </div>
            </>
          )}
        </div>

        {/* Section: Series */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-white">Series más populares</h2>
          </div>

          {series && series.length > 0 && (
            <>
              {renderTop1Card(series[0], false)}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
                {renderGridCards(series, false)}
              </div>
            </>
          )}
        </div>
        
      </main>

      <Footer />
    </div>
  );
}
