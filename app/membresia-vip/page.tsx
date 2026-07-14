import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function MembresiaVipPage() {
  const telegramAdminUrl = "https://t.me/elpapujosh";

  const handleTelegramLink = (planName: string, price: string) => {
    const message = `Hola! Vengo de Papumovie. Me interesa adquirir el plan ${planName} por ${price} pagando mediante Binance Pay.`;
    return `${telegramAdminUrl}?text=${encodeURIComponent(message)}`;
  };

  const checkIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  );

  const checkIconOrange = (
    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-orange-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  );

  const xIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-gray-700 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  );

  return (
    <div className="min-h-screen bg-background text-white flex flex-col font-sans">
      <Header />
      
      <div className="flex-1 w-full flex flex-col items-center pt-16 pb-24 px-4">
        {/* Acceso instantáneo pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border mb-8">
          <div className="size-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
          <span className="text-sm font-medium text-gray-300">Acceso Instantáneo</span>
        </div>

        {/* Hero Text */}
        <h1 className="text-4xl md:text-5xl lg:text-[64px] font-bold text-center leading-[1.1] tracking-tight mb-6 max-w-4xl">
          Suscripción VIP, <br className="hidden md:block"/>
          <span className="text-gray-400">sin complicaciones.</span>
        </h1>
        
        <p className="text-center text-gray-400 max-w-2xl text-lg md:text-xl mb-6">
          Elige el plan que mejor se adapte a ti. Disfruta de todo nuestro contenido sin límites ni publicidad.
        </p>

        {/* Binance Pay badge */}
        <div className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 mb-16 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          <span className="font-bold text-sm tracking-wide">PAGOS 100% SEGUROS A TRAVÉS DE BINANCE PAY</span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1200px] w-full">
          
          {/* Plan 1 Mes */}
          <div className="flex flex-col p-8 rounded-3xl bg-[#111114] border border-border hover:border-gray-600 transition-colors">
            <h3 className="text-lg font-medium text-white mb-2">PHD VIP 1 Mes</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-bold tracking-tight">$13</span>
              <span className="text-gray-500 font-medium">/1 mes</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Películas en 1080p y 4K-UHD</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Descargas en 1 Link</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Sin Publicidad (Ni PopUps)</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Soporte por Telegram y correo</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Servidores Premium</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Temas Web Exclusivos</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Color de Nombre Único</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Prioridad a pedidos (1 por mes)</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-700">{xIcon} Acceso a MEGA</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-700">{xIcon} Soporte para Series</li>
            </ul>

            <a href={handleTelegramLink("PHD VIP 1 Mes", "$13")} target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-2xl border border-[#2e2e32] bg-[#1a1a1f] hover:bg-[#25252b] text-white font-bold text-center transition-colors shadow-sm">
              Elegir Plan
            </a>
          </div>

          {/* Plan 3 Meses (POPULAR) */}
          <div className="flex flex-col p-8 rounded-3xl bg-[#111114] border border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.1)] relative transform lg:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[11px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 fill-current" viewBox="0 0 24 24" stroke="none"><path d="M12 2c-.5 0-1 .4-1 1v4c-2.2.5-4 2.5-4 4.8v3.5L5 17v1h14v-1l-2-1.7v-3.5c0-2.3-1.8-4.3-4-4.8V3c0-.6-.5-1-1-1zM10 19h4c0 1.1-.9 2-2 2s-2-.9-2-2z"/></svg>
              POPULAR
            </div>
            
            <h3 className="text-lg font-medium text-orange-500 mb-2 mt-2">PHD VIP 3 Meses</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-bold tracking-tight">$36</span>
              <span className="text-gray-500 font-medium">/3 meses</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Películas en 1080p y 4K-UHD</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Descargas en 1 Link</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Sin Publicidad (Ni PopUps)</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Soporte por Telegram y correo</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Servidores Premium</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Temas Web Exclusivos</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Color de Nombre Único</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Prioridad a pedidos (1 por mes)</li>
              <li className="flex items-center gap-3 text-[15px] text-orange-500">{checkIconOrange} Acceso a MEGA</li>
              <li className="flex items-center gap-3 text-[15px] text-orange-500">{checkIconOrange} Soporte para Series (1 por mes)</li>
            </ul>

            <a href={handleTelegramLink("PHD VIP 3 Meses", "$36")} target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-2xl bg-white hover:bg-gray-100 text-black font-bold text-center transition-colors shadow-lg active:scale-95">
              Elegir Plan
            </a>
          </div>

          {/* Plan 6 Meses */}
          <div className="flex flex-col p-8 rounded-3xl bg-[#111114] border border-border hover:border-gray-600 transition-colors">
            <h3 className="text-lg font-medium text-white mb-2">PHD VIP 6 Meses</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-bold tracking-tight">$69</span>
              <span className="text-gray-500 font-medium">/6 meses</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Películas en 1080p y 4K-UHD</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Descargas en 1 Link</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Sin Publicidad (Ni PopUps)</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Soporte prioritario 24/7</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Servidores Premium</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Temas Web Exclusivos</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Color de Nombre Único</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Prioridad a pedidos (1 por mes)</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Acceso a MEGA</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Soporte para Series (1 por mes)</li>
            </ul>

            <a href={handleTelegramLink("PHD VIP 6 Meses", "$69")} target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-2xl border border-[#2e2e32] bg-[#1a1a1f] hover:bg-[#25252b] text-white font-bold text-center transition-colors shadow-sm">
              Elegir Plan
            </a>
          </div>

          {/* Plan 12 Meses */}
          <div className="flex flex-col p-8 rounded-3xl bg-[#111114] border border-border hover:border-gray-600 transition-colors">
            <h3 className="text-lg font-medium text-white mb-2">PHD VIP 12 Meses</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-bold tracking-tight">$134</span>
              <span className="text-gray-500 font-medium">/1 año</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Películas en 1080p y 4K-UHD</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Descargas en 1 Link</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Sin Publicidad (Ni PopUps)</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Soporte prioritario 24/7</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Servidores Premium</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Temas Web Exclusivos</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Color de Nombre Único</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Prioridad a pedidos (1 por mes)</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Acceso a MEGA</li>
              <li className="flex items-center gap-3 text-[15px] text-gray-300">{checkIcon} Soporte para Series (1 por mes)</li>
            </ul>

            <a href={handleTelegramLink("PHD VIP 12 Meses", "$134")} target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-2xl border border-[#2e2e32] bg-[#1a1a1f] hover:bg-[#25252b] text-white font-bold text-center transition-colors shadow-sm">
              Elegir Plan
            </a>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
