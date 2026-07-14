'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Film, ChevronRight, Users } from 'lucide-react';
import { Button } from './ui/Button';

interface HeroMovie {
  id: string;
  title: string;
  original_title?: string;
  release_year?: number;
  backdrop_url?: string;
  format?: string;
  resolution?: string;
  rating?: number;
  genres?: string[];
  description?: string;
}

export function Hero({ movies }: { movies: HeroMovie[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!movies || movies.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % movies.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [movies]);

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative w-full h-[450px] md:h-[500px] overflow-hidden group/slider bg-background">
      {movies.map((movie, index) => {
        const isActive = index === currentSlide;
        
        // Mock views for demonstration (deterministic to avoid hydration mismatch)
        const views = ((movie.title.length % 5) + 1.5).toFixed(1) + 'K';
        
        // Parse resolution badge (similar to what we did in MovieCard)
        const rawRes = movie.resolution?.toUpperCase() || '';
        let resText = '1080P';
        let resColor = 'bg-accent text-black';
        
        if (rawRes.includes('4K') || rawRes.includes('UHD')) {
          resText = '4K UHD';
          resColor = 'bg-yellow-500 text-black';
        } else if (rawRes.includes('1080')) {
          resText = '1080P';
        } else if (rawRes.includes('720')) {
          resText = '720P';
        } else if (rawRes) {
          resText = rawRes.split(' ')[0]; // Fallback to first word
        }

        return (
          <div 
            key={movie.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
              {movie.backdrop_url && (
                <Image 
                  src={movie.backdrop_url} 
                  alt={movie.title}
                  fill
                  className="object-cover object-[50%_25%]"
                  priority={index === 0}
                />
              )}
              {/* Overlays for fading into the background color */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:px-12 lg:pb-12 z-20">
              <div className="max-w-7xl mx-auto">
                <div className="max-w-3xl space-y-4">
                  
                  {/* Tags / Metadata */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1 rounded bg-black/60 backdrop-blur-sm px-2 py-0.5">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-white text-[11px] leading-none">{movie.rating ? movie.rating.toFixed(1) : 'N/A'}</span>
                    </div>
                    
                    {movie.resolution && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide leading-none ${resColor}`}>
                        {resText}
                      </span>
                    )}
                    
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] text-gray-400 font-medium">
                      <Film className="w-3 h-3" />
                      Película
                    </span>

                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] text-gray-400 font-medium">
                      <Users className="w-3 h-3" />
                      {views}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-md leading-tight">
                    {movie.title} {movie.format ? (movie.format.startsWith('[') ? movie.format : `[${movie.format}]`) : ''} 
                    <span className="text-gray-500 font-normal ml-2 text-xl md:text-2xl">({movie.release_year || 'N/A'})</span>
                  </h1>

                  {/* Genres */}
                  {movie.genres && movie.genres.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {movie.genres.slice(0, 3).map((genre, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full border border-accent/30 bg-accent/5 text-accent text-[10px] font-semibold tracking-wide">
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-sm text-gray-300 line-clamp-2 md:line-clamp-3 leading-relaxed max-w-2xl">
                    {movie.description || 'No hay sinopsis disponible para esta película.'}
                  </p>

                  {/* Actions */}
                  <div className="pt-3">
                    <Link href={`/pelicula/${movie.id}`}>
                      <button className="flex items-center justify-center gap-2 rounded-full font-bold bg-gradient-to-r from-accent to-accent-hover text-black hover:scale-105 transition-all duration-300 shadow-[0_0_20px_var(--color-accent)] opacity-90 hover:opacity-100 hover:shadow-[0_0_30px_var(--color-accent)] px-7 py-2.5 text-sm w-fit">
                        Ver Detalles
                        <ChevronRight className="w-4 h-4 ml-0.5 stroke-[3]" />
                      </button>
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Indicators (Dots) */}
      {movies.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-accent w-6' : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Ir a la diapositiva ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
