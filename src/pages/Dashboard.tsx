import { useEffect, useState, useCallback } from 'react';
import { LeadUpload } from '../components/leads/LeadUpload';
import { LeadFilter } from '../components/leads/LeadFilter';
import { LeadTable } from '../components/leads/LeadTable';
import { leadService } from '../services/leadService';

export default function Dashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // isAppend diz se devemos juntar com o que já tem na tela (scroll) ou substituir tudo (busca nova)
  const carregarLeads = useCallback(async (filtros = {}, pageNum = 0, isAppend = false) => {
    setLoading(true);
    try {
      if (!leadService || typeof leadService.listarTodos !== "function") return;
      // Pede de 50 em 50, conforme combinado
      const data = await leadService.listarTodos({ ...filtros, page: pageNum.toString(), size: "50" });
      const novosLeads = data.content || data;

      if (isAppend) {
        // Junta os novos leads no final da lista atual, prevenindo IDs duplicados
        setLeads(prev => {
          const existentes = new Set(prev.map(l => l.id));
          const filtrados = novosLeads.filter((l: any) => !existentes.has(l.id));
          return [...prev, ...filtrados];
        });
      } else {
        setLeads(novosLeads);
      }

      setHasMore(!data.last && novosLeads.length > 0); // Se for a última página, hasMore vira false
      setPage(pageNum);
    } catch (err) {
      console.error("Erro ao carregar leads:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarLeads({}, 0, false);
  }, [carregarLeads]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      carregarLeads({}, page + 1, true);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ borderBottom: '2px solid #555', marginBottom: '20px', paddingBottom: '10px' }}>
        <h1 style={{ margin: 0, color: '#fff' }}>🎯 Painel de Gestão Sniper</h1>
        <p style={{ color: '#aaa' }}>Bem-vindo, Administrador. Aqui você controla a entrada e distribuição de leads.</p>
      </header>
      
      {mensagem && <div style={{ padding: '10px', background: '#d1ecf1', color: '#0c5460', borderRadius: '4px', marginBottom: '15px' }}>{mensagem}</div>}
      
      <LeadUpload onSuccess={(msg) => { setMensagem(msg); carregarLeads({}, 0, false); }} />
      <LeadFilter onFilter={(filtros) => carregarLeads(filtros, 0, false)} />

      <LeadTable 
        leads={leads} 
        onRefresh={() => carregarLeads({}, 0, false)} 
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        loading={loading}
      />
      
      {/* Indicador visual de carregamento no final da tabela */}
      {loading && page > 0 && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
          ⏳ Carregando mais leads...
        </div>
      )}
      {!hasMore && leads.length > 0 && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          🏁 Fim da lista. Todos os leads foram carregados.
        </div>
      )}
    </div>
  );
}
