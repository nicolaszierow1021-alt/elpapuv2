"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Save, ArrowLeft, Image as ImageIcon, Crown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { saveMovie } from '../actions';
import Image from 'next/image';

export default function AddMoviePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const searchTMDB = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setLoadingSearch(true);
    try {
      const res = await fetch(`/api/tmdb?action=search&query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error(error);
      alert('Error searching TMDB');
    } finally {
      setLoadingSearch(false);
    }
  };

  const selectMovie = async (tmdbId: number) => {
    setLoadingSearch(true);
    try {
      const res = await fetch(`/api/tmdb?action=details&id=${tmdbId}`);
      const data = await res.json();
      
      const trailer = data.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube')?.key;
      
      // Get Director
      const director = data.credits?.crew?.find((c: any) => c.job === 'Director');
      
      // Get Top 10 Actors
      const actors = data.credits?.cast?.slice(0, 10).map((a: any, i: number) => ({
        name: a.name,
        character_name: a.character,
        photo_url: a.profile_path ? `https://image.tmdb.org/t/p/w185${a.profile_path}` : null,
        role: 'Actor',
        order_index: i
      })) || [];

      let cast = [];
      if (director) {
        cast.push({
          name: director.name,
          character_name: null,
          photo_url: director.profile_path ? `https://image.tmdb.org/t/p/w185${director.profile_path}` : null,
          role: 'Director',
          order_index: -1
        });
      }
      cast = [...cast, ...actors];

      const screenshots = data.images?.backdrops?.slice(0, 12).map((img: any) => `https://image.tmdb.org/t/p/w1280${img.file_path}`) || [];

      setFormData({
        tmdb_id: data.id,
        title: data.title,
        original_title: data.original_title,
        release_year: data.release_date ? parseInt(data.release_date.split('-')[0]) : null,
        resolution: '1920x804 (HD 1080p)',
        format: 'MKV BDRIP',
        audio_languages: ['Latino AC3 5.1', 'Castellano AC3 5.1', 'Inglés AC3 5.1'],
        subtitles: ['Español', 'Inglés'],
        duration_minutes: data.runtime,
        file_size: '2.5 GB', // Placeholder
        password: 'www.papumovie.com',
        rating: data.vote_average ? Math.round(data.vote_average * 10) / 10 : 0,
        description: data.overview,
        cover_url: data.poster_path ? `https://image.tmdb.org/t/p/w780${data.poster_path}` : null,
        backdrop_url: data.backdrop_path ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}` : null,
        trailer_url: trailer ? `https://www.youtube.com/embed/${trailer}` : '',
        genres: data.genres?.map((g: any) => g.name) || [],
        cast: cast,
        screenshots: screenshots,
        links_vip: [{ url: '', server: 'VIP Server' }],
        links_free: [{ url: '', server: 'Free Server' }],
        collection_id: data.belongs_to_collection ? data.belongs_to_collection.id : null,
        collection_name: data.belongs_to_collection ? data.belongs_to_collection.name : null,
        collection_poster_url: data.belongs_to_collection && data.belongs_to_collection.poster_path ? `https://image.tmdb.org/t/p/w780${data.belongs_to_collection.poster_path}` : null,
      });

      setSelectedMovie(data);
      setSearchResults([]);
    } catch (error) {
      console.error(error);
      alert('Error fetching details');
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await saveMovie(formData);
    setSaving(false);
    
    if (res.success) {
      router.push('/admin');
    } else {
      alert('Error saving movie: ' + res.error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const arr = e.target.value.split(',').map(s => s.trim());
    setFormData({ ...formData, [field]: arr });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <div className="flex-none bg-[#121215] border-b border-[#1f1f23] px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
        <Link href="/admin">
          <Button variant="ghost" className="px-2 text-gray-400 hover:text-white hover:bg-white/5">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Añadir Nueva Película
        </h1>
      </div>

      <div className="flex-1 max-w-[1400px] mx-auto w-full p-4 sm:p-6 lg:p-8">
        {!selectedMovie ? (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 pt-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 mb-6 shadow-[0_0_30px_rgba(0,208,208,0.2)]">
                <Search className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Buscar en la base de datos</h2>
              <p className="text-gray-400">Introduce el título original o en español para obtener todos los metadatos automáticamente.</p>
            </div>

            <form onSubmit={searchTMDB} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex bg-[#121215] rounded-xl border border-[#1f1f23] overflow-hidden shadow-2xl">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ej: Inception, Avatar, Avengers..."
                  className="flex-1 bg-transparent px-6 py-4 text-lg text-white outline-none placeholder:text-gray-600"
                />
                <button type="submit" disabled={loadingSearch} className="px-8 bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center transition-colors">
                  {loadingSearch ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
            </form>

            {searchResults.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-12 animate-in fade-in">
                {searchResults.map((result) => (
                  <div key={result.id} className="group cursor-pointer" onClick={() => selectMovie(result.id)}>
                    <div className="aspect-[2/3] relative rounded-xl overflow-hidden mb-3 bg-[#121215] border border-[#1f1f23] group-hover:border-cyan-500/50 transition-all duration-300 shadow-lg">
                      {result.poster_path ? (
                        <Image src={`https://image.tmdb.org/t/p/w342${result.poster_path}`} alt={result.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <span className="bg-cyan-500 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(0,208,208,0.5)]">Seleccionar</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-gray-200 line-clamp-1 group-hover:text-cyan-400 transition-colors">{result.title}</h3>
                    <p className="text-[11px] text-gray-500">{result.release_date?.split('-')[0] || 'Desconocido'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-right-8">
            {/* Left Column: Sticky Preview */}
            <div className="lg:w-[320px] shrink-0">
              <div className="sticky top-24 space-y-6">
                <div className="aspect-[2/3] relative rounded-2xl overflow-hidden border border-[#1f1f23] shadow-2xl">
                  {formData.cover_url ? (
                    <Image src={formData.cover_url} alt="Cover Preview" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#121215] flex items-center justify-center text-gray-700">Sin Imagen</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                    <h3 className="text-2xl font-black text-white leading-tight drop-shadow-lg">{formData.title}</h3>
                    <p className="text-cyan-400 font-bold text-sm mt-1">{formData.release_year}</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full border-gray-700 hover:border-gray-500 hover:text-white" onClick={() => setSelectedMovie(null)}>
                  Elegir otra película
                </Button>
              </div>
            </div>

            {/* Right Column: Form Fields */}
            <div className="flex-1 space-y-8">
              <div className="bg-[#121215]/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-[#1f1f23] shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-cyan-500 rounded-full inline-block"></span>
                  Información Técnica
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-wider text-gray-400 uppercase">Título (Editable para formatos)</label>
                    <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-black/40 border border-[#1f1f23] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-wider text-gray-400 uppercase">Título Original</label>
                    <input name="original_title" value={formData.original_title} onChange={handleChange} className="w-full bg-black/40 border border-[#1f1f23] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-wider text-gray-400 uppercase">Resolución</label>
                    <select name="resolution" value={formData.resolution || ''} onChange={handleChange as any} className="w-full bg-black/40 border border-[#1f1f23] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none appearance-none">
                      <option value="">Selecciona una resolución</option>
                      <option value="1920x1080 (HD 1080P)">1920x1080 (HD 1080P)</option>
                      <option value="3840x2160 (4K UHD)">3840x2160 (4K UHD)</option>
                      <option value="1280x720 (HD 720P)">1280x720 (HD 720P)</option>
                      <option value="1080P">1080P</option>
                      <option value="4K UHD">4K UHD</option>
                      <option value="720P">720P</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-wider text-gray-400 uppercase">Formato / Calidad</label>
                    <select name="format" value={formData.format || ''} onChange={handleChange as any} className="w-full bg-black/40 border border-[#1f1f23] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none appearance-none">
                      <option value="">Selecciona un formato</option>
                      <option value="BDRIP">BDRIP</option>
                      <option value="WEB-DL">WEB-DL</option>
                      <option value="BLURAY">BLURAY</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-wider text-gray-400 uppercase">Tamaño</label>
                    <input name="file_size" value={formData.file_size} onChange={handleChange} className="w-full bg-black/40 border border-[#1f1f23] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-wider text-yellow-500/80 uppercase">Nombre de Colección (Saga)</label>
                    <input name="collection_name" value={formData.collection_name || ''} onChange={handleChange} placeholder="Ej. Avengers Collection" className="w-full bg-black/40 border border-yellow-500/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-wider text-yellow-500/80 uppercase">Póster de Colección (URL)</label>
                    <input name="collection_poster_url" value={formData.collection_poster_url || ''} onChange={handleChange} placeholder="https://..." className="w-full bg-black/40 border border-yellow-500/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-wider text-gray-400 uppercase">Idiomas (separados por coma)</label>
                    <input value={formData.audio_languages.join(', ')} onChange={(e) => handleArrayChange(e, 'audio_languages')} className="w-full bg-black/40 border border-[#1f1f23] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold tracking-wider text-gray-400 uppercase">Sinopsis</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full bg-black/40 border border-[#1f1f23] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none resize-none" />
                  </div>
                </div>
              </div>

              <div className="bg-[#121215]/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-[#1f1f23] shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-purple-500 rounded-full inline-block"></span>
                  Enlaces de Descarga
                </h2>
                <div className="space-y-6">
                  <div className="space-y-2 relative">
                    <label className="text-xs font-bold tracking-wider text-yellow-500 uppercase flex items-center gap-2">Enlace VIP <Crown className="w-3 h-3" /></label>
                    <input 
                      value={formData.links_vip[0]?.url || ''} 
                      onChange={(e) => setFormData({...formData, links_vip: [{ url: e.target.value, server: 'VIP' }]})} 
                      placeholder="https://servidor-vip.com/..."
                      className="w-full bg-yellow-500/5 border border-yellow-500/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-wider text-cyan-400 uppercase">Enlace Público (Free)</label>
                    <input 
                      value={formData.links_free[0]?.url || ''} 
                      onChange={(e) => setFormData({...formData, links_free: [{ url: e.target.value, server: 'Free' }]})} 
                      placeholder="https://servidor-gratis.com/..."
                      className="w-full bg-cyan-500/5 border border-cyan-500/20 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 sticky bottom-6 z-10">
                <div className="bg-black/60 backdrop-blur-xl p-3 rounded-2xl border border-white/10 shadow-2xl flex gap-4">
                  <Button variant="primary" size="lg" onClick={handleSave} disabled={saving} className="px-8 shadow-[0_0_20px_rgba(0,208,208,0.3)] hover:shadow-[0_0_30px_rgba(0,208,208,0.5)] transition-all">
                    {saving ? 'Publicando...' : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Publicar Película
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
