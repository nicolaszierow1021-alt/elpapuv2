"use client";

import React, { useState, useEffect } from 'react';
import { Crown, Loader2, CheckCircle2, AlertCircle, UserMinus, Calendar, Clock, RefreshCw, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { grantVipRole, revokeVipRole, getVipUsers } from './actions';

export function VipManager() {
  const [email, setEmail] = useState('');
  const [duration, setDuration] = useState('1'); // Months
  const [status, setStatus] = useState<'idle' | 'granting' | 'revoking' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  const [vipUsers, setVipUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const fetchVipUsers = async () => {
    setLoadingUsers(true);
    const users = await getVipUsers();
    setVipUsers(users);
    setLoadingUsers(false);
  };

  useEffect(() => {
    fetchVipUsers();
  }, []);

  const handleAction = async (action: 'grant' | 'revoke', targetEmail: string = email) => {
    if (!targetEmail) return;

    setStatus(action === 'grant' ? 'granting' : 'revoking');
    setMessage('');

    const durationMonths = action === 'grant' ? parseInt(duration) : undefined;
    
    const result = action === 'grant' 
      ? await grantVipRole(targetEmail, durationMonths) 
      : await revokeVipRole(targetEmail);

    if (result.success) {
      setStatus('success');
      setMessage(result.message || 'Operación exitosa');
      if (targetEmail === email) setEmail('');
      // Refresh the VIP users list
      fetchVipUsers();
    } else {
      setStatus('error');
      setMessage(result.error || 'Ocurrió un error');
    }
    
    setTimeout(() => {
      setStatus((prev) => (prev === 'success' || prev === 'error' ? 'idle' : prev));
    }, 5000);
  };

  const handleGrantVip = (e: React.FormEvent) => {
    e.preventDefault();
    handleAction('grant');
  };

  const getDaysRemaining = (vipUntil: string | null, role: string) => {
    if (role === 'admin') return 'Admin';
    if (!vipUntil) return 'Permanente';
    const endDate = new Date(vipUntil);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    if (diffTime <= 0) return 'Expirado';
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays}d`;
  };

  return (
    <div className="bg-background border border-border rounded-2xl relative overflow-hidden group shadow-xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[50px] rounded-full pointer-events-none transition-colors duration-500" />
      
      <div className="p-5 border-b border-border flex items-center justify-between relative z-10 bg-[#0d0d12]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gradient-to-tr from-yellow-600 to-yellow-400 rounded-md shadow-[0_0_15px_rgba(234,179,8,0.2)]">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Gestión VIP</h2>
          </div>
        </div>
        <button onClick={fetchVipUsers} className="p-1.5 hover:bg-surface-hover rounded-md transition-colors text-gray-400 hover:text-white" title="Actualizar lista">
          <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin text-accent-hover' : ''}`} />
        </button>
      </div>

      <div className="p-5">
        <form onSubmit={handleGrantVip} className="flex flex-col gap-3 relative z-10 mb-6">
          <div>
            <label htmlFor="email" className="block text-gray-400 mb-1.5 text-[10px] font-bold uppercase tracking-wider">
              Correo Usuario
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@ejemplo.com"
              className="w-full bg-surface border border-border focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 rounded-lg px-3 py-2 text-sm text-white transition-all outline-none"
              required
              disabled={status === 'granting' || status === 'revoking'}
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1.5 text-[10px] font-bold uppercase tracking-wider">
              Tiempo (Meses)
            </label>
            <div className="relative">
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-surface border border-border focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 rounded-lg px-3 py-2 text-sm text-white transition-all outline-none appearance-none"
                disabled={status === 'granting' || status === 'revoking'}
              >
                <option value="1">1 Mes</option>
                <option value="3">3 Meses</option>
                <option value="6">6 Meses</option>
                <option value="12">1 Año</option>
                <option value="0">Permanente</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-1">
            <Button 
              type="button" 
              onClick={() => handleAction('grant')}
              disabled={status === 'granting' || status === 'revoking' || !email}
              className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold border-none text-xs h-9"
            >
              {status === 'granting' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Otorgar'}
            </Button>
            <Button 
              type="button" 
              onClick={() => handleAction('revoke')}
              disabled={status === 'granting' || status === 'revoking' || !email}
              variant="outline"
              className="px-3 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50 h-9"
              title="Revocar"
            >
              {status === 'revoking' ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserMinus className="w-4 h-4" />}
            </Button>
          </div>

          {status === 'success' && (
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-400/10 p-2 rounded-lg mt-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <p>{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-2 text-[11px] text-red-400 bg-red-400/10 p-2 rounded-lg mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <p>{message}</p>
            </div>
          )}
        </form>

        {/* VIP Users Minimal List */}
        <div className="relative z-10 border-t border-border pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Activos Recientes</h3>
            <span className="text-[10px] bg-surface-hover px-1.5 py-0.5 rounded text-gray-300 font-mono">{vipUsers.length}</span>
          </div>
          
          {loadingUsers ? (
            <div className="flex justify-center p-4">
              <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
            </div>
          ) : vipUsers.length === 0 ? (
            <div className="text-center p-4 bg-surface border border-border rounded-lg text-gray-500 text-xs">
              Sin usuarios VIP.
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1 stylish-scrollbar">
              {vipUsers.map((u) => {
                const remaining = getDaysRemaining(u.vip_until, u.role);
                const isAdmin = u.role === 'admin';
                
                return (
                  <div key={u.id} className="flex items-center justify-between p-2.5 bg-surface hover:bg-surface border border-border rounded-lg transition-colors group">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isAdmin ? 'bg-accent/20 text-accent-hover' : 'bg-yellow-500/20 text-yellow-500'}`}>
                        {isAdmin ? <Activity className="w-3 h-3" /> : <Crown className="w-3 h-3" />}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-gray-200 truncate">{u.username || u.email.split('@')[0]}</p>
                        <p className="text-[9px] text-gray-500 truncate">{u.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isAdmin ? 'text-accent-hover' : remaining === 'Expirado' ? 'text-red-400 bg-red-400/10' : 'text-emerald-400 bg-emerald-400/10'
                      }`}>
                        {remaining}
                      </span>
                      {!isAdmin && (
                        <button 
                          onClick={() => {
                            if(window.confirm(`¿Seguro que quieres quitar el VIP a ${u.email}?`)) {
                              handleAction('revoke', u.email);
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-all"
                          title="Revocar"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
