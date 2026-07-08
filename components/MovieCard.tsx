import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Volume2, Download } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  original_title?: string;
  release_year?: number;
  cover_url?: string;
  format?: string;
  resolution?: string;
  rating?: number;
  audio_languages?: string[];
  file_size?: string;
  description?: string;
}

interface MovieCardProps {
  movie: Movie;
}

const getResolutionBadge = (res?: string) => {
  const r = res?.toUpperCase() || '';
  let color = 'bg-[#00cce6] text-black'; // Default Cyan
  let line1 = '';
  let line2 = '';
  
  if (r.includes('4K') || r.includes('UHD')) {
    color = 'bg-yellow-500 text-black';
  }
  
  if (r.includes('(')) {
    const parts = r.split('(');
    line1 = parts[0].trim();
    line2 = `(${parts.slice(1).join('(').trim()}`;
  } else {
    line1 = r;
  }
  
  return { color, line1, line2 };
};

const getFormatBadge = (fmt?: string) => {
  const f = fmt?.toUpperCase() || '';
  let color = 'bg-[#f03296] text-white'; // Default Pink
  let line1 = '';
  let line2 = '';

  if (f.includes('WEB')) color = 'bg-emerald-500 text-white';
  else if (f.includes('BRRIP')) color = 'bg-blue-600 text-white';

  if (f.includes(' ')) {
    const parts = f.split(' ');
    line1 = parts[0];
    line2 = parts.slice(1).join(' ');
  } else {
    line1 = f;
  }

  return { color, line1, line2 };
};

const getFlagClass = (lang: string) => {
  if (typeof lang !== 'string') return { flag: 'fi fi-un', text: 'UNK' };
  const l = lang.toLowerCase();
  if (l.includes('latino') || l.includes('lat')) return { flag: 'fi fi-mx', text: 'LAT' };
  if (l.includes('castellano') || l.includes('españa') || l.includes('cas')) return { flag: 'fi fi-es', text: 'CAS' };
  if (l.includes('inglés') || l.includes('ingles') || l.includes('ing')) return { flag: 'fi fi-us', text: 'ING' };
  if (l.includes('japonés') || l.includes('japones') || l.includes('jap')) return { flag: 'fi fi-jp', text: 'JAP' };
  return { flag: 'fi fi-un', text: lang.substring(0, 3).toUpperCase() };
};

export function MovieCard({ movie }: MovieCardProps) {
  const audioCodec = 'AC3 5.1';

  return (
    <Link href={`/pelicula/${movie.id}`} className="group flex flex-col gap-2">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#121215] border border-[#1f1f23] transition-all duration-300 group-hover:border-cyan-500/50">
        
        {/* Poster Image */}
        {movie.cover_url ? (
          <Image 
            src={movie.cover_url} 
            alt={movie.title} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-700">Sin Imagen</div>
        )}

        {/* Hover Overlay Background */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        {/* Top Badges (Always visible) */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between z-20 pointer-events-none">
          {/* Rating */}
          <div className="bg-black/80 backdrop-blur-sm border border-white/10 text-white text-xs font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-lg group-hover:bg-transparent group-hover:border-transparent transition-all">
            <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
            {movie.rating ? movie.rating.toFixed(1) : 'N/A'}
          </div>

          {/* Quality & Format */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex gap-1">
              {movie.resolution && (() => {
                const badge = getResolutionBadge(movie.resolution);
                return (
                  <div className={`flex flex-col items-center justify-center rounded-[3px] px-1.5 py-0.5 leading-[1.1] shadow-lg ${badge.color}`}>
                    <span className="text-[7px] font-black tracking-tight whitespace-nowrap">{badge.line1}</span>
                    {badge.line2 && <span className="text-[7px] font-black tracking-tight whitespace-nowrap">{badge.line2}</span>}
                  </div>
                );
              })()}
              {movie.format && (() => {
                const badge = getFormatBadge(movie.format);
                return (
                  <div className={`flex flex-col items-center justify-center rounded-[3px] px-1.5 py-0.5 leading-[1.1] shadow-lg ${badge.color}`}>
                    <span className="text-[7px] font-black tracking-tight whitespace-nowrap">{badge.line1}</span>
                    {badge.line2 && <span className="text-[7px] font-black tracking-tight whitespace-nowrap">{badge.line2}</span>}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Hover Content (Middle) */}
        <div className="absolute inset-x-2 top-[35%] z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 pointer-events-none">
          <div className="flex items-center gap-3 text-[11px] font-medium text-gray-300">
            <div className="flex items-center gap-1 text-orange-400">
              <Star className="w-3 h-3 fill-orange-400" />
              <span>{movie.rating ? movie.rating.toFixed(1) : 'N/A'}</span>
            </div>
            <span>Película</span>
            <span>{movie.release_year || ''}</span>
          </div>
          
          <p className="text-[11px] text-gray-100 line-clamp-4 leading-snug">
            {movie.description || 'Sin sinopsis disponible.'}
          </p>
          
          <div className="text-cyan-400 text-[11px] font-medium mt-1 flex items-center gap-1">
            Ver detalles <span className="text-lg leading-none mb-0.5">→</span>
          </div>
        </div>

        {/* Bottom Overlay Gradient (Always visible, darkens bottom for text) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent opacity-90 z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-300" />

        {/* Bottom Metadata (File Info & Flags) (Always visible) */}
        <div className="absolute bottom-2 left-2 right-2 z-20 flex flex-col gap-1.5 pointer-events-none">
          {/* File Size & Audio */}
          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 flex items-center justify-center opacity-70">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <span>{audioCodec}</span>
            </div>
            <span className="text-gray-600">|</span>
            <div className="flex items-center gap-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 opacity-70"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              <span>{movie.file_size || 'N/A'}</span>
            </div>
          </div>

          {/* Audio Flags */}
          {movie.audio_languages && movie.audio_languages.length > 0 && (
            <div className="flex items-center gap-1.5">
              {movie.audio_languages.map((lang, idx) => {
                const { flag, text } = getFlagClass(lang);
                return (
                  <React.Fragment key={idx}>
                    <div className="flex items-center gap-1">
                      <span className={`${flag} rounded-sm w-3 h-[9px] overflow-hidden drop-shadow-sm`}></span>
                      <span className="text-[8px] font-bold text-gray-300 uppercase tracking-wide">{text}</span>
                    </div>
                    {idx < movie.audio_languages!.length - 1 && (
                      <span className="text-[8px] text-gray-600 font-black">|</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="mt-1 flex flex-col">
        <h3 className="font-semibold text-sm text-gray-100 line-clamp-1 group-hover:text-cyan-400 transition-colors">
          {movie.title} {movie.format ? `[${movie.format}]` : ''}
        </h3>
        <span className="text-xs text-gray-500 font-medium mt-0.5">
          {movie.release_year || 'N/A'} • Película
        </span>
      </div>
    </Link>
  );
}
