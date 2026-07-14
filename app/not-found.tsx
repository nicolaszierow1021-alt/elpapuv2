import Link from 'next/link';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-surface border border-border rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/20 rounded-full blur-[80px] -z-10"></div>
        
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center border border-accent/20">
            <AlertTriangle className="w-12 h-12 text-accent" />
          </div>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/50 mb-4 tracking-tight">
          404
        </h1>
        
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Página no encontrada
        </h2>
        
        <p className="text-text-secondary mb-8">
          Oops! Parece que te has perdido en el vacío. La página que estás buscando no existe o ha sido movida.
        </p>
        
        <Link 
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent-hover text-black font-bold py-4 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(var(--color-accent),0.3)] hover:shadow-[0_0_25px_rgba(var(--color-accent),0.5)] transform hover:-translate-y-1"
        >
          <Home className="w-5 h-5" />
          <span>Volver al Inicio</span>
        </Link>
      </div>
    </div>
  );
}
