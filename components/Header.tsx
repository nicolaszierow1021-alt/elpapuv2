"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, ChevronDown, MonitorPlay, LogIn, Crown, Globe, Compass, Flame, Library, HelpCircle, LogOut, Settings } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (data) setProfile(data);
      }
    };
    
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#1f1f23]">
      <div className="relative max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-white uppercase flex items-center">
              PAPU<span className="text-cyan-500">MOVIE</span>
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-3xl mx-auto relative group">
            <Search className="absolute top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-rose-500/60 transition-colors left-4 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar..."
              className="w-full bg-[#16161a] border border-[#1f1f23] rounded-full text-white placeholder:text-gray-500 outline-none transition-all duration-200 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/25 hover:border-[#1f1f23]/80 hover:bg-[#1a1a20] h-11 pl-11 pr-10 text-base md:text-sm"
            />
            <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex items-center gap-1 right-4">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-gray-500 bg-[#0a0a0a] border border-[#1f1f23] rounded">/</kbd>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1 ml-auto">
            
            <Link href="/membresia-vip" className={`flex items-center px-2.5 py-1.5 text-sm rounded-md transition-colors ${pathname === '/membresia-vip' ? 'bg-[#00d0d0]/10 text-[#00d0d0] shadow-sm' : 'text-gray-400 hover:text-white hover:bg-[#16161a]'}`}>
              <Crown className="w-4 h-4 shrink-0 text-yellow-300 animate-pulse" />
              <span className="ml-1.5 text-yellow-300/90 font-medium whitespace-nowrap">Membresía VIP</span>
            </Link>

            <Link href="/peliculas" className={`flex items-center px-2.5 py-1.5 text-sm rounded-md transition-colors ${pathname === '/peliculas' ? 'bg-[#00d0d0]/10 text-[#00d0d0] shadow-sm' : 'text-gray-400 hover:text-white hover:bg-[#16161a]'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 shrink-0 ${pathname === '/peliculas' ? 'text-[#00d0d0]' : 'text-[#00d0d0]/70'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
              <span className="ml-1.5 whitespace-nowrap">Películas</span>
            </Link>

            <Link href="/series" className={`flex items-center px-2.5 py-1.5 text-sm rounded-md transition-colors ${pathname === '/series' ? 'bg-[#00d0d0]/10 text-[#00d0d0] shadow-sm' : 'text-gray-400 hover:text-white hover:bg-[#16161a]'}`}>
              <MonitorPlay className="w-4 h-4 shrink-0 text-violet-500" />
              <span className="ml-1.5 whitespace-nowrap">Series de TV</span>
            </Link>

            <div className="relative group">
              <button className="flex items-center px-3 py-1.5 text-sm rounded-md transition-colors text-gray-400 hover:text-white hover:bg-[#16161a] cursor-pointer text-left">
                <Compass className="w-4 h-4 shrink-0 text-amber-500" />
                <span className="ml-1.5 whitespace-nowrap">Descubrir</span>
                <ChevronDown className="ml-1 w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              <div className="absolute top-full right-0 pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-[#121215] border border-[#1f1f23] rounded-lg shadow-xl overflow-hidden py-2 flex flex-col">
                  <Link href="/populares" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1a1a20] transition-colors">
                    <Flame className="w-4 h-4 text-orange-500" /> Populares
                  </Link>
                  <Link href="/colecciones" className="flex items-center gap-2 px-4 py-2 text-sm text-[#00d0d0] bg-[#1a1a20] transition-colors">
                    <Library className="w-4 h-4 text-[#00d0d0]" /> Colecciones
                  </Link>
                  <div className="h-px bg-[#1f1f23] my-1 mx-2"></div>
                  <Link href="/faq" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1a1a20] transition-colors">
                    <HelpCircle className="w-4 h-4 text-red-400" /> Centro de Ayuda (FAQ)
                  </Link>
                </div>
              </div>
            </div>

            <button className="flex items-center px-3 py-1.5 text-sm rounded-md transition-colors text-gray-400 hover:text-white hover:bg-[#16161a] cursor-pointer text-left">
              <Globe className="w-4 h-4 shrink-0 text-blue-300" />
              <span className="ml-1.5 whitespace-nowrap">Idiomas</span>
              <ChevronDown className="ml-1 w-3 h-3 transition-transform duration-300" />
            </button>
            
            {user ? (
              <div className="relative group md:ml-1">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-full border border-[#1f1f23] bg-[#121215] hover:bg-[#16161a] transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white uppercase overflow-hidden">
                    {profile?.avatar_url ? (
                      <Image src={profile.avatar_url} alt="Avatar" width={24} height={24} className="object-cover" />
                    ) : (
                      profile?.username?.charAt(0) || user.email?.charAt(0)
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-200 max-w-[100px] truncate hidden lg:block">
                    {profile?.username || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400 group-hover:rotate-180 transition-transform duration-300 mr-1" />
                </button>
                
                <div className={`absolute top-full right-0 pt-2 w-48 transition-all duration-200 ${isUserMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'}`}>
                  <div className="bg-[#121215] border border-[#1f1f23] rounded-lg shadow-xl overflow-hidden py-2 flex flex-col">
                    <div className="px-4 py-2 border-b border-[#1f1f23] mb-1">
                      <p className="text-xs text-gray-400">Conectado como</p>
                      <p className="text-sm font-bold text-white truncate">{profile?.username || user.email}</p>
                    </div>
                    {profile?.role === 'admin' && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-cyan-400 hover:text-cyan-300 hover:bg-[#1a1a20] transition-colors">
                        <Settings className="w-4 h-4" /> Panel Admin
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-[#1a1a20] transition-colors text-left w-full">
                      <LogOut className="w-4 h-4" /> Cerrar sesión
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md md:ml-1 bg-[#00d0d0] text-black hover:bg-[#00d0d0]/90 transition-colors cursor-pointer justify-start">
                <LogIn className="w-3.5 h-3.5" /> Entrar
              </Link>
            )}
          </nav>

          {/* Mobile Toggles */}
          <div className="flex md:hidden items-center gap-1 ml-auto">
            <button className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-[#00d0d0] hover:text-[#00d0d0]/80 transition-colors cursor-pointer">
              <LogIn className="w-5 h-5" />
            </button>
            <button 
              className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1f1f23] bg-[#16161a] p-4 flex flex-col gap-2 animate-in slide-in-from-top-2">
           <Link href="/membresia-vip" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-yellow-300 bg-[#1a1a20] transition-colors">
              <Crown className="w-5 h-5 animate-pulse" />
              <span className="font-medium">Membresía VIP</span>
            </Link>
            <Link href="/peliculas" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-white hover:bg-[#1a1a20] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 text-[#00d0d0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
              <span>Películas</span>
            </Link>
            <Link href="/series" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-300 hover:text-white hover:bg-[#1a1a20] transition-colors">
              <MonitorPlay className="w-5 h-5 text-violet-500" />
              <span>Series de TV</span>
            </Link>
        </div>
      )}
    </header>
  );
}
