import React from 'react';
import Link from 'next/link';
import { Globe, Mail, MessageSquare, Share2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#1f1f23] bg-transparent mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-gray-400">
          <p>© {new Date().getFullYear()} PAPUMOVIE. Todos los derechos reservados.</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/colecciones" className="hover:text-white transition-colors">Colecciones</Link>
            <Link href="/dmca" className="hover:text-white transition-colors">DMCA</Link>
            <Link href="/faq" className="hover:text-white transition-colors">Centro de Ayuda (FAQ)</Link>
            <Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
