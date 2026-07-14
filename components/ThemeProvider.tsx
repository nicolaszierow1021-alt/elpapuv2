'use client';

import React, { useEffect } from 'react';
import { useAuth } from './AuthProvider';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();

  useEffect(() => {
    const root = document.body;
    // Remove all previous theme classes
    root.classList.remove('theme-neon', 'theme-oled', 'theme-blood');
    
    if (profile?.theme && profile.theme !== 'default') {
      root.classList.add(`theme-${profile.theme}`);
    }
  }, [profile?.theme]);

  return <>{children}</>;
}
