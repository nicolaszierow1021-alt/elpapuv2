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
                    <option value="BLURAY">BLURAY</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-wider text-gray-400 uppercase">Tamaño</label>
                  <input name="file_size" value={formData.file_size || ''} onChange={handleChange} className="w-full bg-black/40 border border-[#1f1f23] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none" />
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
                  <input value={formData.audio_languages?.join(', ') || ''} onChange={(e) => handleArrayChange(e, 'audio_languages')} className="w-full bg-black/40 border border-[#1f1f23] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none" />
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
                <div className="space-y-2 relative">
                  <label className="text-xs font-bold tracking-wider text-yellow-500 uppercase flex items-center gap-2">Enlace VIP <Crown className="w-3 h-3" /></label>
                  <input 
                    value={formData.links_vip?.[0]?.url || ''} 
                    onChange={(e) => setFormData({...formData, links_vip: [{ url: e.target.value, server: 'VIP' }]})} 
                    placeholder="https://servidor-vip.com/..."
                    className="w-full bg-yellow-500/5 border border-yellow-500/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 rounded-lg px-4 py-3 text-white transition-all outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-wider text-cyan-400 uppercase">Enlace Público (Free)</label>
                  <input 
                    value={formData.links_free?.[0]?.url || ''} 
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
