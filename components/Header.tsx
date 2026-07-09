"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X, ChevronDown, MonitorPlay, LogIn, Crown, Globe, Compass, Flame, Library, HelpCircle, LogOut, Settings } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/components/AuthProvider';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, isLoading } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Keyboard shortcut: press "/" to focus search
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-3xl mx-auto relative group">
            <Search className="absolute top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-rose-500/60 transition-colors left-4 w-4 h-4" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full bg-[#16161a] border border-[#1f1f23] rounded-full text-white placeholder:text-gray-500 outline-none transition-all duration-200 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/25 hover:border-[#1f1f23]/80 hover:bg-[#1a1a20] h-11 pl-11 pr-10 text-base md:text-sm"
            />
            <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex items-center gap-1 right-4">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-gray-500 bg-[#0a0a0a] border border-[#1f1f23] rounded">/</kbd>
            </div>
          </form>

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

            <Link href="/series" className={`flex items-center px-2.5 py-1.5 text-sm rounded-md transition-colors ${pathname === '/series' ? 'bg-violet-500/10 text-violet-400 shadow-sm' : 'text-gray-400 hover:text-white hover:bg-[#16161a]'}`}>
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
                  <Link href="/colecciones" className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${pathname === '/colecciones' ? 'text-[#00d0d0] bg-[#1a1a20]' : 'text-gray-300 hover:text-white hover:bg-[#1a1a20]'}`}>
                    <Library className={`w-4 h-4 ${pathname === '/colecciones' ? 'text-[#00d0d0]' : 'text-gray-400'}`} /> Colecciones
                  </Link>
                  <div className="h-px bg-[#1f1f23] my-1 mx-2"></div>
                  <Link href="/faq" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1a1a20] transition-colors">
                    <HelpCircle className="w-4 h-4 text-red-400" /> Centro de Ayuda (FAQ)
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative group">
              <button className="flex items-center px-3 py-1.5 text-sm rounded-md transition-colors text-gray-400 hover:text-white hover:bg-[#16161a] cursor-pointer text-left">
                <Globe className="w-4 h-4 shrink-0 text-blue-300" />
                <span className="ml-1.5 whitespace-nowrap">Idiomas</span>
                <ChevronDown className="ml-1 w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              <div className="absolute top-full right-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-[#121215] border border-[#1f1f23] rounded-lg shadow-xl overflow-hidden py-2 flex flex-col">
                  {[
                    { name: 'Latino', flag: 'fi-mx', code: 'latino' },
                    { name: 'Castellano', flag: 'fi-es', code: 'castellano' },
                    { name: 'Inglés', flag: 'fi-us', code: 'ingles' },
                    { name: 'Japonés', flag: 'fi-jp', code: 'japones' },
                    { name: 'Coreano', flag: 'fi-kr', code: 'coreano' },
                    { name: 'Francés', flag: 'fi-fr', code: 'frances' }
                  ].map(lang => (
                    <Link key={lang.code} href={`/idioma/${lang.code}`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-[#1a1a20] transition-colors">
                      <span className={`fi ${lang.flag} rounded-sm w-4 h-3 overflow-hidden`}></span>
                      {lang.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            {user ? (
              <div className="relative group md:ml-1">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-full border border-[#1f1f23] bg-[#121215] hover:bg-[#16161a] transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white uppercase overflow-hidden ring-1 ring-white/10 shadow-sm">
                    {profile?.avatar_url ? (
                      <Image src={profile.avatar_url} alt="Avatar" width={24} height={24} className="object-cover" />
                    ) : (
                      profile?.username?.charAt(0) || user.email?.charAt(0)
                    )}
                  </div>
                  <div className="hidden lg:flex flex-col items-start -gap-1">
                    <span className="text-sm font-medium text-gray-200 max-w-[100px] truncate leading-tight">
                      {profile?.username || user.email?.split('@')[0]}
                    </span>
                    {((profile?.role === 'vip' && (!profile.vip_until || new Date(profile.vip_until) > new Date())) || profile?.role === 'admin') && (
                      <span className="text-[9px] font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 flex items-center gap-0.5 mt-0.5">
                        <Crown className="w-2.5 h-2.5 text-yellow-500" />
                        {profile?.role === 'admin' ? 'Admin' : 'Premium'}
                      </span>
                    )}
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400 group-hover:rotate-180 transition-transform duration-300 mr-1 ml-1" />
                </button>
                
                <div className={`absolute top-full right-0 pt-2 w-52 transition-all duration-200 ${isUserMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'}`}>
                  <div className="bg-[#121215] border border-[#1f1f23] rounded-lg shadow-xl overflow-hidden py-2 flex flex-col relative">
                    <div className="px-4 py-3 border-b border-[#1f1f23] mb-1 relative overflow-hidden">
                      {((profile?.role === 'vip' && (!profile.vip_until || new Date(profile.vip_until) > new Date())) || profile?.role === 'admin') && (
                        <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 blur-xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                      )}
                      <p className="text-xs text-gray-400 mb-0.5">Conectado como</p>
                      <p className="text-sm font-bold text-white truncate relative z-10">{profile?.username || user.email}</p>
                      {((profile?.role === 'vip' && (!profile.vip_until || new Date(profile.vip_until) > new Date())) || profile?.role === 'admin') && (
                        <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded-md relative z-10">
                          <Crown className="w-3 h-3 text-yellow-500" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-500">
                            Usuario {profile?.role === 'admin' ? 'Administrador' : 'Premium VIP'}
                          </span>
                        </div>
                      )}
                    </div>
                    {profile?.role === 'admin' && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-cyan-400 hover:text-cyan-300 hover:bg-[#1a1a20] transition-colors">
                        <Settings className="w-4 h-4" /> Panel Admin
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-[#1a1a20] transition-colors text-left w-full mt-1">
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
