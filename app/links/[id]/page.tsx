import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default async function LinksPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ type?: string }> }) {
  const unwrappedParams = await params;
  const unwrappedSearch = await searchParams;
  const id = unwrappedParams.id;
  const type = unwrappedSearch.type || 'free';
  
  const supabase = await createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  const { data: movie } = await supabase.from('movies').select('*').eq('id', id).single();
  if (!movie) notFound();

  let links: any[] = [];
  
  if (type === 'vip') {
    let isVip = false;
    if (session?.user) {
      const { data: profile } = await supabase.from('profiles').select('role, vip_until').eq('id', session.user.id).single();
      
      const isVipExpired = profile?.role === 'vip' && profile?.vip_until && new Date(profile.vip_until) < new Date();
      isVip = (!isVipExpired && profile?.role === 'vip') || profile?.role === 'admin';
    }
    
    // If not VIP, they cannot see the VIP links, period. Secure from scraping.
    if (!isVip) {
      redirect('/membresia-vip');
    }
    
    links = movie.links_vip || [];
  } else {
    links = movie.links_free || [];
  }

  const linksText = links.map((l: any) => l.url).join('\n');

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <Header />
      <div className="flex-1 max-w-3xl mx-auto w-full p-4 sm:p-6 lg:p-8 pt-12">
         <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-2xl">
           <div className="flex justify-center mb-4">
              <div className={`p-3 rounded-full ${type === 'vip' ? 'bg-warning/10 text-warning' : 'bg-accent/10 text-accent'}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              </div>
           </div>
           
           <h1 className="text-3xl font-black text-center mb-2">Enlaces {type === 'vip' ? 'VIP' : 'Públicos'}</h1>
           <h2 className="text-center text-text-secondary mb-8 text-lg font-medium">{movie.title}</h2>
           
           <div className="mb-6">
             <label className="text-xs font-bold tracking-widest uppercase text-text-secondary mb-2 block flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
               Texto plano (Para JDownloader)
             </label>
             <textarea 
               readOnly 
               value={linksText} 
               rows={Math.max(3, links.length)} 
               className="w-full bg-background border border-border rounded-xl p-4 text-sm font-mono text-gray-300 focus:outline-none focus:border-accent/50 resize-none selection:bg-accent/30"
               placeholder="No hay enlaces para mostrar..."
             />
           </div>
           
           <div className="space-y-3">
             <label className="text-xs font-bold tracking-widest uppercase text-text-secondary mb-2 block flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
               Enlaces directos
             </label>
             {links.map((link: any, i: number) => (
               <div key={i} className="bg-background p-4 rounded-xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-accent/30 transition-colors group">
                 <div className="min-w-0 flex-1">
                   <span className="font-bold text-gray-200 block mb-1">{link.server || `Servidor ${i+1}`}</span>
                   <span className="font-mono text-xs text-text-secondary truncate block w-full">{link.url}</span>
                 </div>
                 <a href={link.url} target="_blank" rel="noopener noreferrer" className={`shrink-0 px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest ${type === 'vip' ? 'bg-warning text-black hover:bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white shadow-[0_0_15px_rgba(0,208,208,0.1)]'} transition-all active:scale-95`}>
                   Abrir Link
                 </a>
               </div>
             ))}
             
             {links.length === 0 && (
               <p className="text-center text-gray-500 py-8 border border-dashed border-border rounded-xl">No hay enlaces disponibles por el momento.</p>
             )}
           </div>
         </div>
      </div>
      <Footer />
    </div>
  );
}
