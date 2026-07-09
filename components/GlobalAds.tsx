"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export function GlobalAds() {
  const pathname = usePathname();
  const { user, profile, isLoading } = useAuth();

  useEffect(() => {
    // Si todavía está cargando la sesión inicial (para prevenir inyección temprana antes de saber si es VIP), esperamos.
    if (isLoading) return;

    // Evitar múltiples inyecciones
    if (document.getElementById('adsterra-popunder')) return;

    // No mostrar anuncios en login, registro o páginas protegidas como admin
    if (pathname === '/login' || pathname === '/registro' || pathname?.startsWith('/admin')) {
      return;
    }

    let isVip = false;

    if (profile) {
      const isVipExpired = profile.role === 'vip' && profile.vip_until && new Date(profile.vip_until) < new Date();
      isVip = (!isVipExpired && profile.role === 'vip') || profile.role === 'admin';
    }

    if (!isVip) {
      const script = document.createElement('script');
      script.id = 'adsterra-popunder';
        script.src = 'https://tuxedoarbourannouncement.com/34/7e/82/347e823532a54f0fc9405265225f281e.js';
        script.type = 'text/javascript';
        script.async = true;
        document.body.appendChild(script);
      }
  }, [pathname, profile, isLoading]);

  return null;
}
