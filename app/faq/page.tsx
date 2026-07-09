"use client";

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChevronDown, Download, Server, PlayCircle, User, ListPlus, HelpCircle } from 'lucide-react';

const faqs = [
  {
    category: 'Descargas y archivos',
    icon: <Download className="w-6 h-6 text-cyan-400" />,
    questions: [
      {
        q: '¿Cómo descargar de PelisEnHD?',
        a: 'Para descargar, dirígete a la página de la película o serie y haz clic en el botón de descarga. Si eres usuario VIP, tendrás acceso directo a los enlaces sin publicidad. Si eres usuario gratuito, es posible que debas pasar por un acortador antes de ver los enlaces.'
      },
      {
        q: 'Mi archivo tiene contraseña, ¿Cuál es la contraseña?',
        a: 'Todos nuestros archivos subidos de forma exclusiva están protegidos. La contraseña universal para descomprimir nuestros archivos es siempre: papumoviemkv.store'
      },
      {
        q: '¿Por qué no hay opción de descarga Torrent?',
        a: 'Actualmente nos enfocamos en ofrecer descargas directas a través de servidores rápidos para garantizar que los archivos no dependan de "seeders" y siempre estén disponibles a la máxima velocidad posible.'
      },
      {
        q: '¿Cómo descomprimir un archivo .rar o .zip?',
        a: 'Recomendamos usar WinRAR en Windows o The Unarchiver en Mac. Solo debes hacer clic derecho sobre el archivo descargado, seleccionar "Extraer aquí" e ingresar nuestra contraseña cuando el programa te la pida.'
      }
    ]
  },
  {
    category: 'Servidores y enlaces',
    icon: <Server className="w-6 h-6 text-purple-400" />,
    questions: [
      {
        q: '¿Por qué algunos enlaces solo están en VIP?',
        a: 'Los enlaces VIP utilizan servidores premium mucho más rápidos (como Google Drive, 1Fichier Premium, etc.) que tienen un coste de mantenimiento elevado. Al adquirir VIP, apoyas a la plataforma y a cambio obtienes acceso a estos servidores de alta velocidad y libres de publicidad.'
      },
      {
        q: '¿Qué servidores de descarga usamos en PelisEnHD?',
        a: 'Dependiendo del plan, usamos servidores gratuitos como Mega, Mediafire o Terabox, y servidores exclusivos VIP como Google Drive o enlaces directos sin límites de cuota.'
      },
      {
        q: 'Mi servidor no está disponible ¿Qué puedo hacer?',
        a: 'Si un enlace está caído o un servidor está en mantenimiento, te pedimos paciencia. Nuestro equipo monitorea constantemente los enlaces y los resube lo más pronto posible. Intenta usar un servidor alternativo mientras tanto.'
      }
    ]
  },
  {
    category: 'Reproducción y contenido',
    icon: <PlayCircle className="w-6 h-6 text-rose-400" />,
    questions: [
      {
        q: '¿Cuál es el mejor reproductor para ver tus peliculas?',
        a: 'Recomendamos encarecidamente utilizar VLC Media Player o MPC-HC (Media Player Classic). Ambos son gratuitos y soportan de forma nativa los archivos MKV y múltiples pistas de audio y subtítulos que incluimos en nuestras películas.'
      },
      {
        q: '¿Por qué no subimos calidad CAM?',
        a: 'En PelisEnHD nuestro compromiso es con la calidad. Las versiones CAM (grabadas del cine con cámara) ofrecen una experiencia de video y audio muy pobre. Preferimos esperar a que salgan versiones WEB-DL, Blu-Ray o al menos HD-Rip para garantizar que disfrutes el contenido como se debe.'
      },
      {
        q: 'Una película ha salido en el cine ¿Cuando estará disponible en PelisEnHD?',
        a: 'Por lo general, las películas llegan a nuestra plataforma entre 45 y 90 días después de su estreno en cines, cuando son lanzadas oficialmente en plataformas de streaming (WEB-DL) o en formato físico.'
      },
      {
        q: '¿Cada cuánto tiempo se actualizan los episodios de las series?',
        a: 'Los episodios de series en emisión se actualizan semanalmente, generalmente pocas horas después de su emisión oficial original, dependiendo del tiempo que tarde en procesarse la traducción o el doblaje.'
      }
    ]
  },
  {
    category: 'Cuenta y perfil',
    icon: <User className="w-6 h-6 text-green-400" />,
    questions: [
      {
        q: '¿Cómo puedo editar mi perfil o cambiar mi avatar?',
        a: 'Actualmente, el sistema de avatares toma la inicial de tu correo o nombre de usuario. Muy pronto habilitaremos un panel de control completo donde podrás subir tu propia foto de perfil y editar tu información.'
      },
      {
        q: 'Olvidé mi contraseña, ¿cómo puedo recuperarla?',
        a: 'En la pantalla de inicio de sesión (/login) pronto encontrarás la opción "Olvidé mi contraseña". Te enviaremos un enlace a tu correo registrado para que puedas crear una nueva. Si tienes problemas urgentes, contacta al soporte.'
      }
    ]
  },
  {
    category: 'Funciones de Listas',
    icon: <ListPlus className="w-6 h-6 text-yellow-400" />,
    questions: [
      {
        q: '¿Qué diferencia hay entre Favoritos y Lista de Seguimiento?',
        a: 'Favoritos (corazón) es para guardar aquellas películas o series que te encantaron y consideras tus preferidas. La Lista de Seguimiento (marcador) es para guardar el contenido que te interesa pero que aún no has visto.'
      },
      {
        q: '¿Cómo marco una película como "Vista" o completada?',
        a: 'En la página de detalles de cada película o serie, encontrarás un botón o icono de "Ojo" o "Visto". Al presionarlo, el contenido se añadirá a tu historial para que lleves un control de lo que ya consumiste.'
      },
      {
        q: '¿Cómo borro contenido de Mis Listas?',
        a: 'Solo debes volver a hacer clic en el mismo botón que usaste para agregarlo (corazón o marcador) estando en la página de la película, o directamente desde tu panel de usuario para removerlo de la lista.'
      }
    ]
  }
];

function AccordionItem({ q, a, isOpen, onClick }: { q: string, a: string, isOpen: boolean, onClick: () => void }) {
  return (
    <div className="border border-[#1f1f23] rounded-xl overflow-hidden bg-[#121215] mb-3 transition-all duration-300 hover:border-cyan-500/30">
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 text-left bg-transparent outline-none focus:outline-none"
      >
        <span className={`font-semibold pr-8 ${isOpen ? 'text-cyan-400' : 'text-gray-200'}`}>
          {q}
        </span>
        <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-400' : 'text-gray-500'}`} />
      </button>
      <div 
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{ maxHeight: isOpen ? '500px' : '0', opacity: isOpen ? 1 : 0 }}
      >
        <div className="p-5 pt-0 text-gray-400 text-sm leading-relaxed border-t border-[#1f1f23]/50 mt-2">
          {a}
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleAccordion = (categoryId: string, questionIndex: number) => {
    const id = `${categoryId}-${questionIndex}`;
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <Header />

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#121215] to-[#0a0a0f] border-b border-[#1f1f23] pt-16 pb-12 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full pointer-events-none">
          <div className="absolute inset-0 bg-cyan-500/5 blur-[120px] rounded-full" />
        </div>
        
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#16161a] border border-[#1f1f23] mb-6 shadow-xl">
            <HelpCircle className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Centro de Ayuda
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Encuentra respuestas rápidas a tus dudas y saca el máximo provecho a todas las herramientas de la plataforma.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 md:py-20">
        <div className="space-y-16">
          {faqs.map((section, sectionIdx) => (
            <div key={section.category} className="scroll-mt-24" id={`cat-${sectionIdx}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-[#16161a] border border-[#1f1f23] rounded-lg">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-white">{section.category}</h2>
              </div>
              
              <div className="pl-0 sm:pl-14">
                {section.questions.map((faq, faqIdx) => (
                  <AccordionItem 
                    key={faqIdx}
                    q={faq.q}
                    a={faq.a}
                    isOpen={openIndex === `${sectionIdx}-${faqIdx}`}
                    onClick={() => toggleAccordion(String(sectionIdx), faqIdx)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
