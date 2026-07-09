'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface AuthContextType {
  user: any;
  profile: any;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
});

const CACHE_KEY = 'auth_profile_cache';

function getCachedProfile() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { profile, ts } = JSON.parse(raw);
    // Cache válido por 5 minutos
    if (Date.now() - ts < 5 * 60 * 1000) return profile;
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch {
    return null;
  }
}

function setCachedProfile(profile: any) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ profile, ts: Date.now() }));
  } catch {}
}

function clearCachedProfile() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {}
}

export function AuthProvider({ 
  children, 
  serverSession, 
  serverProfile 
}: { 
  children: React.ReactNode, 
  serverSession: any, 
  serverProfile: any 
}) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  // Empezamos en false para no bloquear el render inicial
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Leer caché de localStorage para mostrar datos inmediatamente sin parpadeo
    const cached = getCachedProfile();
    if (cached) {
      setProfile(cached);
    }

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        
        // Si ya teníamos caché, usar eso mientras buscamos el perfil actualizado
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (data) {
          setProfile(data);
          setCachedProfile(data);
        }
      } else {
        setUser(null);
        setProfile(null);
        clearCachedProfile();
      }

      setIsLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        // On auth change, refresh profile
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (data) {
          setProfile(data);
          setCachedProfile(data);
        }
      } else {
        setUser(null);
        setProfile(null);
        clearCachedProfile();
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
