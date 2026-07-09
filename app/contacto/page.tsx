import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { MessageCircle, Mail, Send, ExternalLink, HelpCircle, ShieldAlert } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto | PAPUMOVIE',
  description: 'Ponte en contacto con el equipo de PAPUMOVIE. Estamos aquí para ayudarte con cualquier problema o sugerencia.',
};

export default function ContactoPage() {
  const telegramAdminUrl = "https://t.me/elpapujosh";

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f] text-white">
      <Header />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 relative">
        {/* Glow Effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-lg h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="text-center mb-12 relative z-10">
          <div className="w-16 h-16 bg-[#00d0d0]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#00d0d0]/20 shadow-[0_0_30px_rgba(0,208,208,0.15)]">
            <MessageCircle className="w-8 h-8 text-[#00d0d0]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Contacto</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            ¿Tienes alguna duda, sugerencia o problema técnico? Estamos aquí para ayudarte. Contáctanos por nuestro canal principal de soporte.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {/* Tarjeta Principal de Telegram */}
          <div className="bg-[#121215] border border-[#1f1f23] hover:border-[#0098ea]/50 rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_40px_rgba(0,152,234,0.15)] group">
            <div className="w-14 h-14 bg-[#0098ea]/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Send className="w-6 h-6 text-[#0098ea] ml-1" />
            </div>
            <h2 className="text-xl font-bold mb-2">Soporte por Telegram</h2>
            <p className="text-gray-400 text-sm mb-8 flex-1">
              Es nuestro medio de contacto oficial. Te responderemos lo más rápido posible. Ideal para problemas VIP, sugerencias y enlaces caídos.
            </p>
            <a 
              href={telegramAdminUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#0098ea] hover:bg-[#0098ea]/90 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-[0_0_20px_rgba(0,152,234,0.3)]"
            >
              Contactar al Administrador <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Opciones Secundarias */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#121215] border border-[#1f1f23] rounded-2xl p-6 flex gap-4">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Dudas Frecuentes</h3>
                <p className="text-sm text-gray-400 mb-3">Revisa si tu pregunta ya está respondida en nuestra sección de ayuda.</p>
                <Link href="/faq" className="text-sm font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1">
                  Ir al Centro de Ayuda <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="bg-[#121215] border border-[#1f1f23] rounded-2xl p-6 flex gap-4">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Reclamaciones de Copyright</h3>
                <p className="text-sm text-gray-400 mb-3">Para asuntos legales y retiros de contenido bajo la ley DMCA.</p>
                <Link href="/dmca" className="text-sm font-semibold text-red-400 hover:text-red-300 flex items-center gap-1">
                  Leer Política DMCA <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
