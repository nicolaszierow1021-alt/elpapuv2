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

export function AuthProvider({ 
  children, 
  serverSession, 
  serverProfile 
}: { 
  children: React.ReactNode, 
  serverSession: any, 
  serverProfile: any 
}) {
  const [user, setUser] = useState(serverSession?.user || null);
  const [profile, setProfile] = useState(serverProfile || null);
  // If we have server data, we are not loading. If not, maybe we check, but let's assume server is source of truth.
  const [isLoading, setIsLoading] = useState(!serverSession);
  const supabase = createClient();

  useEffect(() => {
    // If we didn't have server data, we stop loading anyway since we have mounted
    setIsLoading(false);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        // fetch profile only if user changed
        if (!user || user.id !== session.user.id) {
          const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
          if (data) setProfile(data);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, user]);

  return (
    <AuthContext.Provider value={{ user, profile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
