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
  const [searchUrl, setSearchUrl] = useState('');
  const [searchMode, setSearchMode] = useState<'name' | 'url'>('name');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const searchTMDB = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSearch(true);
    
    try {
      if (searchMode === 'name') {
        if (!searchQuery) return;
        const res = await fetch(`/api/tmdb?action=search&query=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults(data.results || []);
      } else {
        if (!searchUrl) return;
        // Parse TMDB URL to get ID and TYPE
        // Example: https://www.themoviedb.org/tv/125988-silo or https://www.themoviedb.org/movie/12345
        const urlObj = new URL(searchUrl);
        const pathParts = urlObj.pathname.split('/'); // ['', 'tv', '125988-silo']
        if (pathParts.length >= 3 && (pathParts[1] === 'movie' || pathParts[1] === 'tv')) {
          const type = pathParts[1];
          const id = parseInt(pathParts[2].split('-')[0], 10);
          if (id) {
            await selectMovie(id, type);
          } else {
            alert('No se pudo extraer el ID de la URL');
          }
        } else {
          alert('URL no válida. Usa el formato https://www.themoviedb.org/movie/... o /tv/...');
        }
      }
    } catch (error) {
      console.error(error);
      alert('Error searching TMDB');
    } finally {
      setLoadingSearch(false);
    }
  };

  const selectMovie = async (tmdbId: number, type: string) => {
    setLoadingSearch(true);
    try {
      const res = await fetch(`/api/tmdb?action=details&id=${tmdbId}&type=${type}`);
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
        password: 'papumoviemkv.store',
        category: data.media_type === 'tv' ? 'SeriesTV' : 'Película',
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

  const toggleAudioLanguage = (lang: string) => {
    const current = formData.audio_languages || [];
    if (current.includes(lang)) {
      setFormData({ ...formData, audio_languages: current.filter((l: string) => l !== lang) });
    } else {
      setFormData({ ...formData, audio_languages: [...current, lang] });
    }
  };

  const AVAILABLE_LANGUAGES = [
    { name: 'Latino', flag: 'fi-mx' },
    { name: 'Castellano', flag: 'fi-es' },
    { name: 'Inglés', flag: 'fi-us' },
    { name: 'Japonés', flag: 'fi-jp' },
    { name: 'Coreano', flag: 'fi-kr' },
    { name: 'Francés', flag: 'fi-fr' }
  ];

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
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 mb-6 shadow-[0_0_30px_rgba(0,208,208,0.2)]">
                <Search className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Buscar en TMDB</h2>
              <p className="text-gray-400">Obtén todos los metadatos automáticamente desde The Movie Database.</p>
            </div>

            {/* Tabs */}
            <div className="flex bg-[#121215] border border-[#1f1f23] rounded-xl p-1 w-max mx-auto mb-8">
              <button
                onClick={() => setSearchMode('name')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  searchMode === 'name' ? 'bg-cyan-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                Buscar por Nombre
              </button>
              <button
                onClick={() => setSearchMode('url')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  searchMode === 'url' ? 'bg-cyan-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                Buscar por URL
              </button>
            </div>

            <form onSubmit={searchTMDB} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex bg-[#121215] rounded-xl border border-[#1f1f23] overflow-hidden shadow-2xl">
                {searchMode === 'name' ? (
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ej: Silo, Avatar, Avengers..."
                    className="flex-1 bg-transparent px-6 py-4 text-lg text-white outline-none placeholder:text-gray-600"
                  />
                ) : (
                  <input 
                    type="url" 
                    value={searchUrl}
                    onChange={(e) => setSearchUrl(e.target.value)}
                    placeholder="Ej: https://www.themoviedb.org/tv/125988-silo"
                    className="flex-1 bg-transparent px-6 py-4 text-lg text-white outline-none placeholder:text-gray-600"
                  />
                )}
                <button type="submit" disabled={loadingSearch} className="px-8 bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center transition-colors">
                  {loadingSearch ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
            </form>

            {searchResults.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-12 animate-in fade-in">
                {searchResults.map((result) => (
                  <div key={result.id} className="group cursor-pointer" onClick={() => selectMovie(result.id, result.media_type)}>
                    <div className="aspect-[2/3] relative rounded-xl overflow-hidden mb-3 bg-[#121215] border border-[#1f1f23] group-hover:border-cyan-500/50 transition-all duration-300 shadow-lg">
                      {result.poster_path ? (
                        <Image src={`https://image.tmdb.org/t/p/w342${result.poster_path}`} alt={result.title || result.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      )}
                      
                      {/* Badge Película o Serie */}
                      <div className="absolute top-2 left-2 z-20">
                        <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded ${result.media_type === 'tv' ? 'bg-violet-600 text-white' : 'bg-[#00d0d0] text-black'}`}>
                          {result.media_type === 'tv' ? 'Serie TV' : 'Película'}
                        </span>
                      </div>

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm z-30">
                        <span className="bg-cyan-500 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(0,208,208,0.5)]">Seleccionar</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-gray-200 line-clamp-1 group-hover:text-cyan-400 transition-colors">{result.title || result.name}</h3>
                    <p className="text-[11px] text-gray-500">{(result.release_date || result.first_air_date)?.split('-')[0] || 'Desconocido'}</p>
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
                  <div className="space-y-3 lg:col-span-2">
                    <label className="text-xs font-bold tracking-wider text-gray-400 uppercase">Idiomas de Audio</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {AVAILABLE_LANGUAGES.map((lang) => {
                        const isSelected = (formData.audio_languages || []).includes(lang.name);
                        return (
                          <div 
                            key={lang.name}
                            onClick={() => toggleAudioLanguage(lang.name)}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' 
                                : 'bg-[#121215] border-[#1f1f23] text-gray-400 hover:border-gray-500 hover:text-gray-200'
                            }`}
                          >
                            <span className={`fi ${lang.flag} rounded-sm w-4 h-3 overflow-hidden shrink-0`}></span>
                            <span className="text-sm font-medium">{lang.name}</span>
                            {isSelected && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
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
                      <option value="HDCAM">HDCAM</option>
                      <option value="BRRIP">BRRIP</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-wider text-gray-400 uppercase">Tamaño</label>
                    <input name="file_size" value={formData.file_size} onChange={handleChange} className="w-full bg-black/40 border border-[#1f1f23] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-wider text-gray-400 uppercase">Contraseña</label>
                    <input name="password" value={formData.password} onChange={handleChange} className="w-full bg-black/40 border border-[#1f1f23] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-wider text-violet-400 uppercase">Categoría</label>
                    <select name="category" value={formData.category || 'Película'} onChange={handleChange as any} className="w-full bg-black/40 border border-[#1f1f23] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none appearance-none">
                      <option value="Película">Película</option>
                      <option value="SeriesTV">Series TV</option>
                      <option value="Anime">Anime</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-wider text-yellow-500/80 uppercase">Nombre de Colección (Saga)</label>
                    <input name="collection_name" value={formData.collection_name || ''} onChange={handleChange} placeholder="Ej. Avengers Collection" className="w-full bg-black/40 border border-yellow-500/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-wider text-yellow-500/80 uppercase">Póster de Colección (URL)</label>
                    <input name="collection_poster_url" value={formData.collection_poster_url || ''} onChange={handleChange} placeholder="https://..." className="w-full bg-black/40 border border-yellow-500/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none" />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-xs font-bold tracking-wider text-gray-400 uppercase">Pistas de Audio (INFORMACIÓN GENERAL)</label>
                    <p className="text-xs text-gray-500">Cada entrada es un "Audio #N" en la ficha técnica. Ej: <span className="text-cyan-400">Latino AC3 5.1</span></p>
                    <div className="flex flex-col gap-2">
                      {(formData.audio_languages || ['']).map((lang: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-xs font-mono text-gray-500 shrink-0 w-16">Audio #{idx + 1}</span>
                          <div className="flex flex-1 gap-2">
                            <select
                              value={lang.split(/\s+(AC3|AAC|DTS|FLAC|MP3)/i)[0]?.trim() || ''}
                              onChange={(e) => {
                                const codec = lang.match(/\s+(AC3.*|AAC.*|DTS.*|FLAC.*|MP3.*)/i)?.[1] || 'AC3 5.1';
                                const newArr = [...(formData.audio_languages || [])];
                                newArr[idx] = e.target.value ? `${e.target.value} ${codec}` : '';
                                setFormData({ ...formData, audio_languages: newArr });
                              }}
                              className="flex-1 bg-black/40 border border-[#1f1f23] focus:border-cyan-500/50 rounded-lg px-3 py-2 text-white text-sm outline-none appearance-none"
                            >
                              <option value="">Seleccionar idioma</option>
                              <option value="Latino">Latino</option>
                              <option value="Castellano">Castellano</option>
                              <option value="Inglés">Inglés</option>
                              <option value="Japonés">Japonés</option>
                              <option value="Coreano">Coreano</option>
                              <option value="Francés">Francés</option>
                              <option value="Portugués">Portugués</option>
                              <option value="Alemán">Alemán</option>
                              <option value="Italiano">Italiano</option>
                            </select>
                            <select
                              value={lang.match(/\s+(AC3.*|AAC.*|DTS.*|FLAC.*|MP3.*)/i)?.[1] || 'AC3 5.1'}
                              onChange={(e) => {
                                const base = lang.split(/\s+(AC3|AAC|DTS|FLAC|MP3)/i)[0]?.trim() || 'Latino';
                                const newArr = [...(formData.audio_languages || [])];
                                newArr[idx] = `${base} ${e.target.value}`;
                                setFormData({ ...formData, audio_languages: newArr });
                              }}
                              className="w-36 bg-black/40 border border-[#1f1f23] focus:border-cyan-500/50 rounded-lg px-3 py-2 text-white text-sm outline-none appearance-none"
                            >
                              <option value="AC3 5.1">AC3 5.1</option>
                              <option value="AC3 2.0">AC3 2.0</option>
                              <option value="AAC 2.0">AAC 2.0</option>
                              <option value="AAC 5.1">AAC 5.1</option>
                              <option value="DTS 5.1">DTS 5.1</option>
                              <option value="DTS-HD MA 7.1">DTS-HD MA 7.1</option>
                              <option value="TrueHD 7.1">TrueHD 7.1</option>
                              <option value="FLAC 5.1">FLAC 5.1</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => {
                                const newArr = (formData.audio_languages || []).filter((_: string, i: number) => i !== idx);
                                setFormData({ ...formData, audio_languages: newArr.length > 0 ? newArr : [''] });
                              }}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                              title="Eliminar pista"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, audio_languages: [...(formData.audio_languages || []), 'Latino AC3 5.1'] })}
                      className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors mt-1 border border-cyan-500/30 hover:border-cyan-500/60 px-3 py-1.5 rounded-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                      Añadir pista de audio
                    </button>
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
                {/* VIP Links */}
                <div>
                  <label className="text-xs font-bold tracking-wider text-yellow-500 uppercase flex items-center gap-2 mb-3">
                    <Crown className="w-3.5 h-3.5" /> ENLACES VIP
                  </label>
                  <div className="space-y-3">
                    {(formData.links_vip || []).map((link: any, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          value={link.server || ''}
                          onChange={(e) => {
                            const updated = [...(formData.links_vip || [])];
                            updated[idx] = { ...updated[idx], server: e.target.value };
                            setFormData({ ...formData, links_vip: updated });
                          }}
                          placeholder="Servidor (ej: MegaUp)"
                          className="w-28 bg-yellow-500/5 border border-yellow-500/20 focus:border-yellow-500/50 rounded-lg px-3 py-3 text-white transition-all outline-none text-sm"
                        />
                        <input
                          value={link.url || ''}
                          onChange={(e) => {
                            const updated = [...(formData.links_vip || [])];
                            updated[idx] = { ...updated[idx], url: e.target.value };
                            setFormData({ ...formData, links_vip: updated });
                          }}
                          placeholder="https://..."
                          className="flex-1 bg-yellow-500/5 border border-yellow-500/20 focus:border-yellow-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none"
                        />
                        <button
                          onClick={() => {
                            const updated = (formData.links_vip || []).filter((_: any, i: number) => i !== idx);
                            setFormData({ ...formData, links_vip: updated });
                          }}
                          className="px-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors text-lg leading-none"
                        >×</button>
                      </div>
                    ))}
                    <button
                      onClick={() => setFormData({ ...formData, links_vip: [...(formData.links_vip || []), { url: '', server: 'VIP' }] })}
                      className="w-full py-2.5 rounded-lg border border-dashed border-yellow-500/30 text-yellow-500/60 hover:text-yellow-500 hover:border-yellow-500/60 text-sm font-bold transition-colors"
                    >+ Añadir enlace VIP</button>
                  </div>
                </div>

                {/* Free Links */}
                <div>
                  <label className="text-xs font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-2 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    ENLACES PÚBLICOS (FREE)
                  </label>
                  <div className="space-y-3">
                    {(formData.links_free || []).map((link: any, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          value={link.server || ''}
                          onChange={(e) => {
                            const updated = [...(formData.links_free || [])];
                            updated[idx] = { ...updated[idx], server: e.target.value };
                            setFormData({ ...formData, links_free: updated });
                          }}
                          placeholder="Servidor"
                          className="w-28 bg-cyan-500/5 border border-cyan-500/20 focus:border-cyan-500/50 rounded-lg px-3 py-3 text-white transition-all outline-none text-sm"
                        />
                        <input
                          value={link.url || ''}
                          onChange={(e) => {
                            const updated = [...(formData.links_free || [])];
                            updated[idx] = { ...updated[idx], url: e.target.value };
                            setFormData({ ...formData, links_free: updated });
                          }}
                          placeholder="https://..."
                          className="flex-1 bg-cyan-500/5 border border-cyan-500/20 focus:border-cyan-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none"
                        />
                        <button
                          onClick={() => {
                            const updated = (formData.links_free || []).filter((_: any, i: number) => i !== idx);
                            setFormData({ ...formData, links_free: updated });
                          }}
                          className="px-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors text-lg leading-none"
                        >×</button>
                      </div>
                    ))}
                    <button
                      onClick={() => setFormData({ ...formData, links_free: [...(formData.links_free || []), { url: '', server: 'Free' }] })}
                      className="w-full py-2.5 rounded-lg border border-dashed border-cyan-500/30 text-cyan-500/60 hover:text-cyan-500 hover:border-cyan-500/60 text-sm font-bold transition-colors"
                    >+ Añadir enlace Free</button>
                  </div>
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
