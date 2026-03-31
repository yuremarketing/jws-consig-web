import { useEffect, useState, useCallback } from 'react';
import { LeadUpload } from '../components/leads/LeadUpload';
import { LeadFilter } from '../components/leads/LeadFilter';
import { LeadTable } from '../components/leads/LeadTable';
import { leadService } from '../services/leadService';

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');

  // Função para buscar os dados do Java (CU-07)
  const carregarLeads = useCallback(async (filtros = {}) => {
    setLoading(true);
    try {
      // Por enquanto chamamos o listarTodos, depois passamos os filtros na URL
    if (!leadService || typeof leadService.listarTodos !== "function") { console.log("Aguardando Service..."); return; }
      const data = await leadService.listarTodos();
      setLeads(data.content || data);
    } catch (err) {
      console.error("Erro ao carregar leads:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega ao abrir a página
  useEffect(() => {
    carregarLeads();
  }, [carregarLeads]);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ borderBottom: '2px solid #333', marginBottom: '20px', paddingBottom: '10px' }}>
        <h1 style={{ margin: 0 }}>🎯 Painel de Gestão Sniper</h1>
        <p style={{ color: '#666' }}>Bem-vindo, Administrador. Aqui você controla a entrada e distribuição de leads.</p>
      </header>

      {mensagem && (
        <div style={{ padding: '10px', background: '#d1ecf1', color: '#0c5460', borderRadius: '4px', marginBottom: '15px' }}>
          {mensagem}
        </div>
      )}

      {/* PEÇA 1: Importação de CSV (CU-09) */}
      <LeadUpload onSuccess={(msg) => { setMensagem(msg); carregarLeads(); }} />

      {/* PEÇA 2: Filtros de Busca */}
      <LeadFilter onFilter={(filtros) => carregarLeads(filtros)} />

      {/* PEÇA 3: Tabela e Atribuição (CU-07 & CU-10) */}
      {loading ? (
        <p>Carregando leads da central...</p>
      ) : (
        <LeadTable leads={leads} onRefresh={carregarLeads} />
      )}
    </div>
  );
}
