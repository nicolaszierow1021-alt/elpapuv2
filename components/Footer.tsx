import React from 'react';
import Link from 'next/link';
import { Globe, Mail, MessageSquare, Share2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#1f1f23] bg-transparent mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-gray-400">
          <p>© {new Date().getFullYear()} PAPUMOVIE. Todos los derechos reservados.</p>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link href="/colecciones" className="hover:text-white transition-colors">Colecciones</Link>
              <Link href="/dmca" className="hover:text-white transition-colors">DMCA</Link>
              <Link href="/faq" className="hover:text-white transition-colors">Centro de Ayuda (FAQ)</Link>
              <Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link>
            </div>
            <a 
              href="https://t.me/+3IdHSZT-qDIyYmRh" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#0088cc] hover:bg-[#0077b3] text-white rounded-lg font-medium transition-colors shadow-lg shadow-[#0088cc]/20 mt-2 md:mt-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.11.03-1.84 1.18-5.21 3.45-.49.33-.94.5-1.35.49-.45-.01-1.31-.25-1.95-.46-.78-.26-1.4-.4-1.34-.84.03-.23.36-.47.98-.73 3.82-1.66 6.37-2.76 7.64-3.29 3.63-1.51 4.39-1.78 4.88-1.79.11 0 .35.03.48.14.11.09.14.22.15.34.01.12.01.25.01.35z"/>
              </svg>
              Unirse al Canal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
