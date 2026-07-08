"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function saveMovie(data: any) {
  try {
    // 1. Insert movie
    const { data: movie, error: movieError } = await supabaseAdmin
      .from('movies')
      .insert({
        tmdb_id: data.tmdb_id,
        title: data.title,
        original_title: data.original_title,
        release_year: data.release_year,
        resolution: data.resolution,
        format: data.format,
        audio_languages: data.audio_languages,
        subtitles: data.subtitles,
        duration_minutes: data.duration_minutes,
        file_size: data.file_size,
        password: data.password,
        rating: data.rating,
        description: data.description,
        cover_url: data.cover_url,
        backdrop_url: data.backdrop_url,
        trailer_url: data.trailer_url,
        genres: data.genres,
        links_vip: data.links_vip,
        links_free: data.links_free,
        collection_id: data.collection_id,
        collection_name: data.collection_name,
        collection_poster_url: data.collection_poster_url,
      })
      .select()
      .single();

    if (movieError) throw movieError;

    // 2. Insert cast members
    if (data.cast && data.cast.length > 0) {
      const castData = data.cast.map((c: any) => ({
        movie_id: movie.id,
        name: c.name,
        character_name: c.character_name,
        photo_url: c.photo_url,
        role: c.role,
        order_index: c.order_index,
      }));
      
      const { error: castError } = await supabaseAdmin.from('cast_members').insert(castData);
      if (castError) console.error("Error inserting cast:", castError);
    }

    // 3. Insert screenshots
    if (data.screenshots && data.screenshots.length > 0) {
      const screenshotData = data.screenshots.map((url: string) => ({
        movie_id: movie.id,
        image_url: url
      }));
      
      const { error: screenshotError } = await supabaseAdmin.from('screenshots').insert(screenshotData);
      if (screenshotError) console.error("Error inserting screenshots:", screenshotError);
    }

    revalidatePath('/admin');
    revalidatePath('/');
    
    return { success: true, movieId: movie.id };
  } catch (error: any) {
    console.error("Failed to save movie:", error);
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
}

export async function deleteMovie(id: string) {
  try {
    const { error } = await supabaseAdmin.from('movies').delete().eq('id', id);
    if (error) throw error;
    
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete movie:", error);
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
}

export async function updateMovie(id: string, data: any) {
  try {
    const { error } = await supabaseAdmin
      .from('movies')
      .update({
        title: data.title,
        original_title: data.original_title,
        release_year: data.release_year,
        resolution: data.resolution,
        format: data.format,
        audio_languages: data.audio_languages,
        subtitles: data.subtitles,
        duration_minutes: data.duration_minutes,
        file_size: data.file_size,
        password: data.password,
        rating: data.rating,
        description: data.description,
        cover_url: data.cover_url,
        backdrop_url: data.backdrop_url,
        trailer_url: data.trailer_url,
        genres: data.genres,
        links_vip: data.links_vip,
        links_free: data.links_free,
        collection_id: data.collection_id,
        collection_name: data.collection_name,
        collection_poster_url: data.collection_poster_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath(`/pelicula/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update movie:", error);
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
}

export async function getMovieById(id: string) {
  try {
    const { data: movie, error } = await supabaseAdmin
      .from('movies')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return { success: true, movie };
  } catch (error: any) {
    console.error("Failed to fetch movie:", error);
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
}
