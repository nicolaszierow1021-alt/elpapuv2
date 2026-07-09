import type { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

const BASE_URL = 'https://papumoviemkv.store';

export const revalidate = 3600; // Regenerate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/peliculas`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/series`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/populares`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/membresia-vip`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/colecciones`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    // Language pages
    ...['latino', 'castellano', 'ingles', 'japones', 'coreano', 'frances'].map(lang => ({
      url: `${BASE_URL}/idioma/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];

  // Dynamic movie/series routes from DB
  const { data: movies } = await supabaseAdmin
    .from('movies')
    .select('id, updated_at, cover_url')
    .order('created_at', { ascending: false })
    .limit(49000); // Google allows 50k per sitemap

  const dynamicRoutes: MetadataRoute.Sitemap = (movies || []).map(movie => ({
    url: `${BASE_URL}/pelicula/${movie.id}`,
    lastModified: movie.updated_at ? new Date(movie.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    ...(movie.cover_url ? { images: [movie.cover_url] } : {}),
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
