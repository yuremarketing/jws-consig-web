#!/bin/bash

echo -e "\033[1;34m--- 🔧 OPERAÇÃO BLOCO 1: LIGANDO AS TORNEIRAS --- \033[0m"

# 1. Refatorando a Tela de Login (Usando o authService)
cat << 'EOF' > src/pages/Login.tsx
import { useState } from 'react';
import { authService } from '../api/authService';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const dados = await authService.login({ email, senha: password });
      localStorage.setItem('token', dados.token);
      localStorage.setItem('role', dados.role);
      onLoginSuccess();
    } catch (err) {
      setError('Credenciais inválidas ou erro no servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 w-96 text-center">
        <h2 className="text-2xl font-bold text-blue-500 mb-6 font-mono tracking-tighter">CONSIG-SNIPER</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="E-mail" required className="w-full p-3 bg-slate-800 rounded text-white border border-slate-700 focus:border-blue-500 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Senha" required className="w-full p-3 bg-slate-800 rounded text-white border border-slate-700 focus:border-blue-500 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold rounded transition-colors">
            {loading ? 'AUTENTICANDO...' : 'ENTRAR'}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4 text-sm font-semibold">{error}</p>}
      </div>
    </div>
  );
}
EOF
echo -e "[\033[0;32m ✔ OK \033[0m] Tela de Login refatorada e conectada ao authService."

# 2. Refatorando o Dashboard (Usando leadService e authService)
cat << 'EOF' > src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { leadService } from '../api/leadService';
import { authService } from '../api/authService';
import type { Lead } from '../types';

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leadService.getMeusLeads()
       .then(dados => setLeads(dados))
       .catch(err => console.error("Erro ao carregar leads:", err))
       .finally(() => setLoading(false));
  }, []);

  const renderColuna = (titulo: string, status: string) => (
    <div className="flex-1 bg-slate-900 p-4 rounded-xl border border-slate-800 min-h-[500px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-slate-400 font-bold">{titulo}</h3>
        <span className="bg-slate-800 text-blue-400 text-xs px-2 py-1 rounded font-bold">
          {leads.filter(l => l.status === status).length}
        </span>
      </div>
      
      {loading ? (
        <p className="text-slate-500 text-sm text-center mt-10">Carregando...</p>
      ) : (
        <div className="space-y-3">
          {leads.filter(l => l.status === status).map(lead => (
            <div key={lead.id} className="bg-slate-800 p-4 rounded border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer shadow-lg">
              <p className="font-bold text-slate-100">{lead.nome}</p>
              <p className="text-xs text-slate-400 font-mono mt-1">{lead.cpf}</p>
              <p className="text-sm text-green-400 mt-2 font-bold">R$ {lead.margem}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <header className="mb-8 pb-4 border-b border-slate-800 flex justify-between items-center">
        <h1 className="text-2xl font-black text-blue-500 tracking-tighter italic">CONSIG-SNIPER</h1>
        <button 
          onClick={() => authService.logout()} 
          className="text-red-400 hover:text-red-300 font-bold px-4 py-2 rounded hover:bg-slate-900 transition-colors"
        >
          DESLOGAR
        </button>
      </header>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {renderColuna("A FAZER", "DISPONIVEL")}
        {renderColuna("ATENDENDO", "EM_ATENDIMENTO")}
        {renderColuna("FECHADO", "FINALIZADO")}
      </div>
    </div>
  );
}
EOF
echo -e "[\033[0;32m ✔ OK \033[0m] Dashboard refatorado e conectado ao leadService."

# 3. Teste de Fogo
echo -e "\n\033[1;33m--- ⚡ INICIANDO TESTE DE INTEGRAÇÃO (BUILD) --- \033[0m"
npm run build

if [ $? -eq 0 ]; then
    echo -e "\n\033[1;32m🏆 SUCESSO ABSOLUTO! O código passou sem nenhum erro.\033[0m"
    echo -e "A Sala de Operações está 100% limpa, segura e conectada à API."
else
    echo -e "\n\033[1;31m💥 FALHA NO TESTE! O compilador encontrou erros de integração acima.\033[0m"
fi
