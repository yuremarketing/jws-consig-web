import React, { useState } from 'react';
import api from '../api/axios';
import { Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      
      alert('🚀 LOGIN SUCESSO! Bem-vindo, ' + response.data.role);
      // Por enquanto fica na mesma página até criarmos o Dashboard
    } catch (err: any) {
      setError('Credenciais inválidas ou Servidor Offline');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full space-y-8 bg-slate-900 p-10 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-blue-500 tracking-tight">CONSIG-SNIPER</h2>
          <p className="mt-2 text-sm text-slate-400">Acesse sua central de leads</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm text-center border border-red-500/20 font-medium">{error}</div>}
          
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white outline-none transition-all"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white outline-none transition-all"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-900/20 active:scale-95"
          >
            ENTRAR NO SISTEMA
          </button>
        </form>
      </div>
    </div>
  );
}
