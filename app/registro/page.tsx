'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { UserPlus, Mail, Lock, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { signup } from './actions'

export default function RegistroPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await signup(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        <div className="absolute inset-0 bg-purple-500/10 blur-[80px] rounded-full" />
        
        <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-8 relative shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-surface border border-border rounded-2xl flex items-center justify-center shadow-inner">
              <UserPlus className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <h1 className="text-2xl font-black text-center text-white mb-2">Crea tu cuenta</h1>
          <p className="text-gray-400 text-center text-sm mb-8">Únete a la mejor plataforma de streaming</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wider text-gray-500 uppercase">Nombre de Usuario</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  name="username"
                  required
                  placeholder="Tu alias"
                  className="w-full bg-background border border-border focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 rounded-lg pl-10 pr-4 py-3 text-white transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold tracking-wider text-gray-500 uppercase">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="correo@ejemplo.com"
                  className="w-full bg-background border border-border focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 rounded-lg pl-10 pr-4 py-3 text-white transition-all outline-none"
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
                  className="w-full bg-background border border-border focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 rounded-lg pl-10 pr-4 py-3 text-white transition-all outline-none"
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
              className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold py-3 mt-4 shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all"
            >
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-400">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-purple-500 hover:text-purple-400 font-bold transition-colors">
              Inicia sesión aquí
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
