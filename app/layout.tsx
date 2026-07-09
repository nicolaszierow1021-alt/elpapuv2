import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://papumoviemkv.store'),
  title: {
    default: 'PAPUMOVIE - Descarga Películas y Series en HD',
    template: '%s | PAPUMOVIE',
  },
  description: 'Descarga Películas y Series en Latino, Castellano, Subtitulado e Inglés. Últimos estrenos en la mejor calidad 4K UHD, 1080p Full HD. Acceso VIP a servidores premium.',
  keywords: ['descargar peliculas', 'descargar series', 'peliculas en hd', 'series en hd', 'peliculas latino', 'series latino', '4k', '1080p', 'web-dl', 'bluray', 'papumovie'],
  authors: [{ name: 'PAPUMOVIE' }],
  creator: 'PAPUMOVIE',
  publisher: 'PAPUMOVIE',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://papumoviemkv.store',
    siteName: 'PAPUMOVIE',
    title: 'PAPUMOVIE - Descarga Películas y Series en HD',
    description: 'Descarga Películas y Series en Latino, Castellano, Subtitulado e Inglés. Últimos estrenos en la mejor calidad 4K UHD, 1080p Full HD.',
    images: [
      {
        url: '/icon.png',
        width: 1200,
        height: 630,
        alt: 'PAPUMOVIE',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PAPUMOVIE - Descarga Películas y Series en HD',
    description: 'Descarga Películas y Series en Latino, Castellano, Subtitulado e Inglés. Últimos estrenos en la mejor calidad 4K UHD, 1080p Full HD.',
    images: ['/icon.png'],
  },
  alternates: {
    canonical: 'https://papumoviemkv.store',
  },
};

import { GlobalAds } from "@/components/GlobalAds";
import { AuthProvider } from "@/components/AuthProvider";
import { createClient } from "@/utils/supabase/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  let profile = null;
  
  if (session?.user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    if (data) profile = data;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://papumoviemkv.store/#website',
        'url': 'https://papumoviemkv.store',
        'name': 'PAPUMOVIE',
        'description': 'Descarga Películas y Series en Latino, Castellano e Inglés en la mejor calidad HD',
        'inLanguage': 'es-ES',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': 'https://papumoviemkv.store/buscar?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://papumoviemkv.store/#organization',
        'name': 'PAPUMOVIE',
        'url': 'https://papumoviemkv.store',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://papumoviemkv.store/icon.png',
          'width': 512,
          'height': 512,
        },
        'sameAs': [],
      },
    ],
  };

  return (
    <html lang="es" className={`${inter.variable} antialiased h-full`}>
      <body className="min-h-full flex flex-col bg-background text-text-primary font-sans">
        <AuthProvider serverSession={session} serverProfile={profile}>
          <GlobalAds />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
