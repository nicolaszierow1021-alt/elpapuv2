'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { LogIn, Mail, Lock, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { login } from './actions'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        <div className="absolute inset-0 bg-accent/10 blur-[80px] rounded-full" />
        
        <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-8 relative shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-surface border border-border rounded-2xl flex items-center justify-center shadow-inner">
              <LogIn className="w-8 h-8 text-accent" />
            </div>
          </div>
          
          <h1 className="text-2xl font-black text-center text-white mb-2">Bienvenido de vuelta</h1>
          <p className="text-gray-400 text-center text-sm mb-8">Inicia sesión para continuar a tu cuenta</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wider text-gray-500 uppercase">Email o Usuario</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  name="identifier"
                  required
                  placeholder="tu_usuario o correo@ejemplo.com"
                  className="w-full bg-background border border-border focus:border-accent/50 focus:ring-1 focus:ring-accent/50 rounded-lg pl-10 pr-4 py-3 text-white transition-all outline-none"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wider text-gray-500 uppercase">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="password" 
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-background border border-border focus:border-accent/50 focus:ring-1 focus:ring-accent/50 rounded-lg pl-10 pr-4 py-3 text-white transition-all outline-none"
                />
              </div>
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm px-4 py-3 rounded-lg text-center font-medium">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-accent hover:bg-[#00b0b0] text-black font-bold py-3 mt-4 shadow-[0_0_15px_rgba(0,208,208,0.3)] transition-all"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-400">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-accent hover:text-accent-hover font-bold transition-colors">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm font-medium">
          Volver a Inicio
        </Link>
      </div>
    </div>
  )
}
