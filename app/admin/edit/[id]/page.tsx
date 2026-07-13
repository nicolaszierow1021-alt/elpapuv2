"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Crown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { updateMovie, getMovieById } from '../../actions';

export default function EditMoviePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const movieId = unwrappedParams.id;
  const [formData, setFormData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovie() {
      const res = await getMovieById(movieId);
        
      if (!res.success || !res.movie) {
        alert("Error loading movie: " + (res.error || 'No encontrada'));
        router.push('/admin');
        return;
      }
      
      setFormData(res.movie);
      setLoading(false);
    }
    loadMovie();
  }, [movieId, router]);

  const handleSave = async () => {
    setSaving(true);
    const res = await updateMovie(movieId, formData);
    setSaving(false);
    
    if (res.success) {
      router.push('/admin');
    } else {
      alert('Error updating movie: ' + res.error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <div className="flex-none bg-[#121215] border-b border-[#1f1f23] px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
        <Link href="/admin">
          <Button variant="ghost" className="px-2 text-gray-400 hover:text-white hover:bg-white/5">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-500">
          Editar Película
        </h1>
      </div>

      <div className="flex-1 max-w-[1400px] mx-auto w-full p-4 sm:p-6 lg:p-8">
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
                  <input name="title" value={formData.title || ''} onChange={handleChange} className="w-full bg-black/40 border border-[#1f1f23] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-wider text-gray-400 uppercase">Título Original</label>
                  <input name="original_title" value={formData.original_title || ''} onChange={handleChange} className="w-full bg-black/40 border border-[#1f1f23] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none" />
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
                    <option value="[WEB-DL] LIGERA">[WEB-DL] LIGERA</option>
                    <option value="[WEB-DL] PESADA">[WEB-DL] PESADA</option>
                    <option value="[WEB-DL 4K UHD HDR10]">[WEB-DL 4K UHD HDR10]</option>
                    <option value="[WEB-DL 4K UHD SDR]">[WEB-DL 4K UHD SDR]</option>
                    <option value="BLURAY">BLURAY</option>
                    <option value="HDCAM">HDCAM</option>
                    <option value="BRRIP">BRRIP</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-wider text-gray-400 uppercase">Tamaño</label>
                  <input name="file_size" value={formData.file_size || ''} onChange={handleChange} className="w-full bg-black/40 border border-[#1f1f23] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-wider text-gray-400 uppercase">Contraseña</label>
                  <input name="password" value={formData.password || ''} onChange={handleChange} className="w-full bg-black/40 border border-[#1f1f23] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-wider text-violet-400 uppercase">Categoría</label>
                  <select name="category" value={formData.category || 'Película'} onChange={handleChange as any} className="w-full bg-black/40 border border-[#1f1f23] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none appearance-none">
                    <option value="Película">Película</option>
                    <option value="SeriesTV">Series TV</option>
                    <option value="Anime">Anime</option>
                  </select>
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
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-wider text-yellow-500/80 uppercase">Nombre de Colección (Saga)</label>
                  <input name="collection_name" value={formData.collection_name || ''} onChange={handleChange} placeholder="Ej. Avengers Collection" className="w-full bg-black/40 border border-yellow-500/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-wider text-yellow-500/80 uppercase">Póster de Colección (URL)</label>
                  <input name="collection_poster_url" value={formData.collection_poster_url || ''} onChange={handleChange} placeholder="https://..." className="w-full bg-black/40 border border-yellow-500/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold tracking-wider text-gray-400 uppercase">Sinopsis</label>
                  <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={5} className="w-full bg-black/40 border border-[#1f1f23] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none resize-none" />
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
                  {saving ? 'Guardando...' : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
