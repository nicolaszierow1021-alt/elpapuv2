"use client";

import { useEffect, useRef } from 'react';

export function AdBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;
    if (bannerRef.current.childNodes.length > 0) return; // Prevent multiple loads in React strict mode

    const conf = document.createElement('script');
    conf.type = 'text/javascript';
    conf.innerHTML = `
      atOptions = {
        'key' : 'cd381120015ff4b4c0785c8376fee9e2',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;
    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://tuxedoarbourannouncement.com/cd381120015ff4b4c0785c8376fee9e2/invoke.js';
    
    bannerRef.current.appendChild(conf);
    bannerRef.current.appendChild(script);
  }, []);

  return (
    <div 
      ref={bannerRef} 
      className="w-full max-w-[728px] h-[90px] mx-auto flex items-center justify-center overflow-hidden" 
    />
  );
}
