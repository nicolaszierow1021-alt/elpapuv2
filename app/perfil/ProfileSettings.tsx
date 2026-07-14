'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Lock, Crown, Palette, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import Image from 'next/image';

const THEMES = [
  { id: 'default', name: 'Original (Oscuro)', isVip: false, color: '#0a0a0f', accent: '#00cce6' },
  { id: 'neon', name: 'Cyber Neon', isVip: true, color: '#0d001a', accent: '#ff00ff' },
  { id: 'oled', name: 'OLED Puro', isVip: true, color: '#000000', accent: '#ffffff' },
  { id: 'blood', name: 'Terror Blood', isVip: true, color: '#0a0000', accent: '#ff0000' },
  { id: 'cyberpunk', name: 'Cyberpunk', isVip: true, color: '#0f0f00', accent: '#ffff00' },
  { id: 'ocean', name: 'Deep Ocean', isVip: true, color: '#000a14', accent: '#0099ff' },
];

export function ProfileSettings() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  
  const [theme, setTheme] = useState('default');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [nameColor, setNameColor] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Check VIP status
  const isVip = profile?.vip_until ? new Date(profile.vip_until) > new Date() : profile?.role === 'admin';

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    
    if (profile) {
      setTheme(profile.theme || 'default');
      setAvatarUrl(profile.avatar_url || '');
      setBannerUrl(profile.banner_url || '');
      setNameColor(profile.name_color || '');
    }
  }, [user, profile, authLoading, router]);

  // Preview theme instantly
  useEffect(() => {
    const root = document.body;
    root.classList.remove('theme-neon', 'theme-oled', 'theme-blood', 'theme-cyberpunk', 'theme-ocean');
    if (theme && theme !== 'default') {
      root.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setMessage('');
    
    try {
      // Security check: Don't allow non-VIPs to save VIP themes
      let finalTheme = theme;
      let finalColor = nameColor;
      
      const selectedTheme = THEMES.find(t => t.id === theme);
      if (selectedTheme?.isVip && !isVip) {
        finalTheme = 'default';
      }
      if (!isVip && nameColor) {
        finalColor = ''; // Only VIPs can have custom name color
      }

      const { error } = await supabase.from('profiles').update({
        theme: finalTheme,
        avatar_url: avatarUrl,
        banner_url: bannerUrl,
        name_color: finalColor
      }).eq('id', user.id);

      if (error) throw error;
      
      setMessage('¡Perfil actualizado con éxito! (Refresca la página si no ves los cambios)');
      
      // Update local storage cache to reflect changes immediately
      try {
        const cached = localStorage.getItem('auth_profile_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          parsed.profile.theme = finalTheme;
          parsed.profile.avatar_url = avatarUrl;
          parsed.profile.banner_url = bannerUrl;
          parsed.profile.name_color = finalColor;
          localStorage.setItem('auth_profile_cache', JSON.stringify(parsed));
          
      // Force ThemeProvider to update by modifying body class directly for instant preview
          const root = document.body;
          root.classList.remove('theme-neon', 'theme-oled', 'theme-blood', 'theme-cyberpunk', 'theme-ocean');
          if (finalTheme !== 'default') {
            root.classList.add(`theme-${finalTheme}`);
          }
        }
      } catch (e) {}
      
      // Reload the page to refresh AuthContext (Header, etc.)
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error(error);
      setMessage('Error al guardar. Inténtalo de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER SECTION */}
      <div className="relative rounded-2xl overflow-hidden border border-border bg-surface shadow-lg">
        {/* Banner */}
        <div className="h-40 w-full bg-surface-hover relative overflow-hidden group">
          {bannerUrl ? (
            <img src={bannerUrl} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent"></div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">Editar en configuración</span>
          </div>
        </div>
        
        {/* Avatar & Info */}
        <div className="px-6 pb-6 pt-4 relative flex flex-col sm:flex-row gap-4 sm:items-end -mt-16 sm:-mt-12">
          <div className="w-24 h-24 rounded-full border-4 border-surface bg-surface-hover overflow-hidden relative shadow-xl z-10 shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-black text-accent uppercase">
                {profile?.username?.charAt(0) || user.email?.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="flex-1 mb-1">
            <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: isVip && nameColor ? nameColor : 'inherit' }}>
              {profile?.username || 'Usuario'}
              {isVip && <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
            </h1>
            <p className="text-text-secondary text-sm">{user.email}</p>
          </div>
          
          <div className="shrink-0 mb-2">
            {isVip ? (
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                Miembro VIP
              </div>
            ) : (
              <div className="bg-surface-hover border border-border text-text-secondary px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest">
                Plan Básico
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SETTINGS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* APPEARANCE */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-6 shadow-lg">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="p-2 bg-accent/10 rounded-lg text-accent">
              <Palette className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">Apariencia</h2>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-text-secondary uppercase tracking-wider block">Tema de la Web</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEMES.map((t) => {
                const locked = t.isVip && !isVip;
                return (
                  <div 
                    key={t.id}
                    onClick={() => !locked && setTheme(t.id)}
                    className={`relative p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col gap-2 overflow-hidden
                      ${theme === t.id ? 'border-accent bg-accent/5' : 'border-border bg-surface hover:border-text-secondary/50'}
                      ${locked ? 'opacity-50 cursor-not-allowed grayscale' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between z-10">
                      <span className="font-semibold text-sm">{t.name}</span>
                      {locked ? <Lock className="w-4 h-4 text-text-secondary" /> : theme === t.id && <Check className="w-4 h-4 text-accent" />}
                    </div>
                    
                    {/* Preview bubbles */}
                    <div className="flex gap-2 z-10">
                      <div className="w-6 h-6 rounded-full border border-white/10" style={{ background: t.color }}></div>
                      <div className="w-6 h-6 rounded-full" style={{ background: t.accent }}></div>
                    </div>
                    
                    {/* Background decoration */}
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full blur-xl opacity-20" style={{ background: t.accent }}></div>
                  </div>
                );
              })}
            </div>
            {!isVip && <p className="text-xs text-yellow-500 font-medium pt-1">⭐ Los temas exclusivos requieren una membresía VIP.</p>}
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-sm font-bold text-text-secondary uppercase tracking-wider flex justify-between items-center">
              <span>Color de tu Nombre</span>
              {!isVip && <Lock className="w-3.5 h-3.5" />}
            </label>
            <input 
              type="color" 
              value={nameColor || '#ffffff'} 
              onChange={(e) => setNameColor(e.target.value)}
              disabled={!isVip}
              className="w-full h-10 bg-transparent rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
            />
            {!isVip && <p className="text-xs text-text-secondary">Destaca en los comentarios con un color único (Solo VIP).</p>}
          </div>
        </div>

        {/* PROFILE IMAGES */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-6 shadow-lg">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="p-2 bg-accent/10 rounded-lg text-accent">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">Imágenes</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-secondary uppercase tracking-wider block">URL del Avatar</label>
              <input 
                type="text" 
                value={avatarUrl} 
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://ejemplo.com/mifoto.jpg"
                className="w-full bg-surface-hover border border-border focus:border-accent rounded-lg px-4 py-2.5 text-sm outline-none transition-all" 
              />
              <p className="text-xs text-text-secondary">Pega un enlace directo a una imagen cuadrada.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-text-secondary uppercase tracking-wider block">URL del Banner (Fondo)</label>
              <input 
                type="text" 
                value={bannerUrl} 
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://ejemplo.com/mibanner.jpg"
                className="w-full bg-surface-hover border border-border focus:border-accent rounded-lg px-4 py-2.5 text-sm outline-none transition-all" 
              />
              <p className="text-xs text-text-secondary">Pega un enlace a una imagen horizontal ancha.</p>
            </div>
          </div>
          
          <div className="pt-6">
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="w-full bg-accent hover:bg-accent-hover text-black font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(var(--color-accent),0.3)] hover:shadow-[0_0_25px_rgba(var(--color-accent),0.5)] flex justify-center items-center gap-2"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Guardar Cambios'}
            </button>
            {message && (
              <p className="mt-3 text-sm text-center font-medium text-emerald-400 bg-emerald-400/10 py-2 rounded-lg border border-emerald-400/20">{message}</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
