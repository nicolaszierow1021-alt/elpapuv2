import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const query = searchParams.get('query');
  const movieId = searchParams.get('id');

  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'TMDB API key not configured' }, { status: 500 });
  }

  try {
    if (action === 'search' && query) {
      // Búsqueda de películas y series
      const response = await fetch(
        `${BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=es-MX&query=${encodeURIComponent(query)}&page=1`
      );
      const data = await response.json();
      // Filtrar para mostrar solo movies y tv (quitar personas)
      if (data.results) {
        data.results = data.results.filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv');
      }
      return NextResponse.json(data);
    } 
    
    if (action === 'details' && movieId) {
      const type = searchParams.get('type') || 'movie'; // 'movie' o 'tv'
      // Detalles completos de la película o serie incluyendo créditos y videos
      const response = await fetch(
        `${BASE_URL}/${type}/${movieId}?api_key=${TMDB_API_KEY}&language=es-MX&append_to_response=credits,videos,images&include_image_language=en,null,es`
      );
      const data = await response.json();
      
      // Intentar obtener videos en español, si no hay, intentar en inglés
      if (data.videos?.results?.length === 0) {
        const enResponse = await fetch(
          `${BASE_URL}/${type}/${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const enData = await enResponse.json();
        data.videos.results = enData.results;
      }

      // Normalizar datos para TV vs Movie
      if (type === 'tv') {
        data.title = data.name;
        data.original_title = data.original_name;
        data.release_date = data.first_air_date;
        data.runtime = data.episode_run_time?.[0] || 45; // Promedio
        data.media_type = 'tv';
      } else {
        data.media_type = 'movie';
      }
      
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Invalid action or missing parameters' }, { status: 400 });
  } catch (error) {
    console.error('TMDB API error:', error);
    return NextResponse.json({ error: 'Failed to fetch from TMDB' }, { status: 500 });
  }
}
