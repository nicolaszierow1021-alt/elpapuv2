import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full gap-6">
      <div className="relative flex items-center justify-center w-20 h-20">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-accent border-r-accent animate-spin" style={{ animationDuration: '1.2s' }}></div>
        
        {/* Inner rotating ring (reverse) */}
        <div className="absolute inset-2 rounded-full border-[3px] border-transparent border-b-accent-hover border-l-accent-hover opacity-80 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        
        {/* Center glowing core */}
        <div className="w-8 h-8 bg-accent rounded-full animate-pulse shadow-[0_0_20px_var(--color-accent)]"></div>
        
        {/* Background ambient glow */}
        <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full animate-pulse"></div>
      </div>
      
      {/* Loading text with premium spacing and fade effect */}
      <div className="flex flex-col items-center gap-1">
        <h3 className="text-accent text-sm font-black tracking-[0.3em] uppercase animate-pulse">
          Cargando
        </h3>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>
    </div>
  );
}
