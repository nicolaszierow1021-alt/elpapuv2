import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ShieldAlert, Info, AlertTriangle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DMCA - Derechos de Autor | PAPUMOVIE',
  description: 'Política de Privacidad y Derechos de Autor (DMCA) de PAPUMOVIE.',
};

export default function DMCAPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f] text-gray-300">
      <Header />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 relative">
        <div className="flex items-center gap-4 mb-10 border-b border-[#1f1f23] pb-8">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Política DMCA</h1>
            <p className="text-gray-400 font-medium mt-1">Digital Millennium Copyright Act</p>
          </div>
        </div>

        <div className="space-y-8 text-[15px] leading-relaxed">
          
          <div className="bg-[#121215] border border-[#1f1f23] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4 text-white">
              <Info className="w-6 h-6 text-[#00d0d0]" />
              <h2 className="text-xl font-bold">Aviso Legal Importante</h2>
            </div>
            <p className="mb-4">
              <strong>PAPUMOVIE</strong> (papumoviemkv.store) no aloja ningún tipo de archivo o contenido multimedia en sus propios servidores o red. 
            </p>
            <p>
              Todo el contenido compartido en nuestro sitio web funciona únicamente como un índice de enlaces de distribución pública proporcionados por terceros, los cuales están alojados en plataformas ajenas a nosotros (como Mega, Mediafire, Google Drive, entre otros). Por lo tanto, PAPUMOVIE no asume responsabilidad alguna por el cumplimiento, los derechos de autor, la legalidad, la decencia, o cualquier otro aspecto del contenido de otros sitios enlazados.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Reclamaciones de Derechos de Autor</h3>
            <p className="mb-4">
              Si consideras que algún enlace publicado en nuestro sitio web infringe tus derechos de autor, te invitamos a ponerte en contacto con nosotros para proceder a su evaluación y retiro inmediato.
            </p>
            <p className="mb-4">
              Por favor, ten en cuenta que debido a que no alojamos los archivos nosotros mismos, no podemos borrar los archivos de los servidores de terceros (hostings). Incluso si eliminamos el enlace de nuestra plataforma, el archivo original seguirá existiendo en el servidor de terceros. Te sugerimos contactar directamente con el sitio de alojamiento para solicitar la eliminación de dicho archivo.
            </p>
          </div>

          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4 text-white">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-bold">¿Cómo presentar una queja DMCA?</h2>
            </div>
            <p className="mb-4 text-red-200/80">
              Para proceder de manera rápida y efectiva con tu solicitud, por favor envíanos la siguiente información:
            </p>
            <ul className="list-disc pl-6 space-y-3 mb-6 text-gray-400">
              <li>El nombre y los detalles de contacto del titular de los derechos de autor o su representante legal.</li>
              <li>La(s) URL(s) exactas de PAPUMOVIE donde se encuentra publicado el enlace a tu material con derechos.</li>
              <li>Prueba o declaración jurada bajo pena de perjurio que confirme que posees los derechos del material reclamado.</li>
              <li>Una declaración de que el uso del material de la forma reclamada no está autorizado por el propietario de los derechos de autor, su agente, o la ley.</li>
            </ul>
            <div className="bg-[#0a0a0f] border border-red-500/20 rounded-xl p-5 mt-6">
              <p className="text-sm text-gray-300 font-medium mb-3">Envía tu solicitud oficial a nuestro medio de contacto:</p>
              <a 
                href="https://t.me/elpapujosh" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-white text-black hover:bg-gray-200 font-bold py-2.5 px-6 rounded-lg transition-colors w-full sm:w-auto"
              >
                Contactar por Telegram
              </a>
              <p className="text-xs text-gray-500 mt-4">
                El procesamiento de tu solicitud y el retiro del contenido puede tomar entre 24 y 48 horas hábiles.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
