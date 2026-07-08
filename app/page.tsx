import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';
import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { MovieCard } from '@/components/MovieCard';

export const revalidate = 0; // Disable caching to always show latest movies on homepage

export default async function Home() {
  const { data: heroMovies } = await supabaseAdmin
    .from('movies')
    .select('id, title, original_title, release_year, backdrop_url, format, resolution, rating, genres, description')
    .not('backdrop_url', 'is', null)
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: movies } = await supabaseAdmin
    .from('movies')
    .select('id, title, original_title, release_year, cover_url, format, resolution, rating, audio_languages, file_size, description')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <>
      <Header />
      
      <main className="flex-1 flex flex-col">
        <Hero movies={heroMovies || []} />
        
        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 py-12 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-[#1f1f23] pb-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#0a1515] border border-[#00d0d0]/20 flex items-center justify-center text-[#00d0d0]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Películas recién actualizadas
                </h2>
                <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                  Últimas películas recién añadidas o actualizadas
                </p>
              </div>
            </div>
            <Link href="/populares" className="flex items-center gap-2 bg-[#004d40] hover:bg-[#00695c] text-emerald-100 px-4 py-1.5 rounded-full text-xs font-bold transition-colors">
              VER MÁS <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
            {movies && movies.length > 0 ? (
              movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie as any} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500">
                No hay películas todavía. Ve al Panel de Administración para agregar la primera.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
