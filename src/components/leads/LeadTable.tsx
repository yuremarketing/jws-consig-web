import { useState, useEffect, useRef, useCallback } from 'react';
import { leadService } from '../../services/leadService';

interface Lead { 
  id: number; 
  nome: string; 
  cpf: string; 
  status: string; 
  orgao?: string; // Adicionando suporte ao órgão
  consultorNome?: string; 
  consultor?: { id: number; nome: string };
}

interface Consultor { id: number; nome: string; }

interface Props {
  leads: Lead[];
  onRefresh: () => void;
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
}

export const LeadTable = ({ leads, onRefresh, onLoadMore, hasMore, loading }: Props) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [consultores, setConsultores] = useState<Consultor[]>([]);
  const [consultorIdGlobal, setConsultorIdGlobal] = useState('');

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: any) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) onLoadMore();
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, onLoadMore]);

  useEffect(() => {
    const buscarConsultores = async () => {
      try {
        const data = await leadService.listarConsultores();
        setConsultores(data);
      } catch (err) { console.error("Erro ao buscar consultores:", err); }
    };
    buscarConsultores();
  }, []);

  // Lógica do Select All
  const isAllSelected = leads?.length > 0 && selectedIds.length === leads?.length;
  
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(((leads || []).map)(l => l.id));
    }
  };

  const handleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleAtribuirEmMassa = async () => {
    if (selectedIds.length === 0 || !consultorIdGlobal) return;
    try {
      await leadService.atribuirLeads(selectedIds, Number(consultorIdGlobal));
      setSelectedIds([]);
      window.location.reload(); 
    } catch (err) { alert("❌ Erro ao atribuir leads."); }
  };

  const handleAtribuicaoIndividual = async (id: number, idConsultorStr: string) => {
     if(!idConsultorStr) return;
     try{
         await leadService.atribuirLeads([id], Number(idConsultorStr));
         window.location.reload();
     }catch(err){ alert("❌ Erro ao atribuir."); }
  };

  const handleTornarDisponivel = async (id: number) => {
      try {
          await leadService.atualizarStatus(id, 'DISPONIVEL');
          window.location.reload();
      } catch(err) { alert("❌ Erro ao atualizar."); }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', background: '#1a1a1a', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
        <strong style={{ color: '#fff' }}>Ação em massa:</strong>
        <select value={consultorIdGlobal} onChange={e => setConsultorIdGlobal(e.target.value)} style={{ padding: '8px', borderRadius: '4px', background: '#000', color: '#fff', border: '1px solid #444' }}>
          <option key="empty" value="">Selecionar Consultor...</option>
          {consultores.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        <button 
          onClick={handleAtribuirEmMassa} 
          disabled={selectedIds.length === 0 || !consultorIdGlobal} 
          style={{ padding: '8px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: selectedIds.length === 0 ? 0.5 : 1, fontWeight: 'bold' }}
        >
          Atribuir Selecionados ({selectedIds.length})
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#111', color: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333' }}>
        <thead>
          <tr style={{ background: '#222', textAlign: 'left' }}>
            <th style={{ padding: '12px', borderBottom: '1px solid #444', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                checked={isAllSelected} 
                onChange={handleSelectAll}
                style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
              />
              <span style={{ fontSize: '13px' }}>Select</span>
            </th>
            <th style={{ padding: '12px', borderBottom: '1px solid #444' }}>Nome / Órgão</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #444' }}>CPF</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #444', textAlign: 'center' }}>Status</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #444', textAlign: 'center' }}>Ação</th>
          </tr>
        </thead>
        <tbody>
          {((leads || []).map)((lead, index) => {
            const isLast = index === leads?.length - 1;
            const nomeConsultor = lead.consultorNome || lead.consultor?.nome;
            const estaAtribuido = (lead.status === 'ATRIBUIDO' || !!nomeConsultor) && lead.status !== 'DISPONIVEL';
            
            // Oculta códigos numéricos no órgão para manter a limpeza
            const orgaoExibicao = lead.orgao && isNaN(Number(lead.orgao)) ? lead.orgao : '';

            return (
              <tr key={lead.id} ref={isLast ? lastElementRef : null} style={{ borderBottom: '1px solid #222', background: selectedIds.includes(lead.id) ? '#1a1a1a' : 'transparent' }}>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(lead.id)} 
                    onChange={() => handleSelect(lead.id)} 
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 'bold' }}>{lead.nome}</div>
                  <div style={{ fontSize: '11px', color: '#007bff' }}>{orgaoExibicao}</div>
                </td>
                <td style={{ padding: '12px', color: '#888' }}>{lead.cpf}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {!estaAtribuido ? (
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', background: '#1e3a1e', color: '#4ade80' }}>
                      ✅ DISPONÍVEL
                    </span>
                  ) : (
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', background: '#1e293b', color: '#60a5fa' }}>
                      👤 {nomeConsultor}
                    </span>
                  )}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {!estaAtribuido ? (
                     <select onChange={(e) => handleAtribuicaoIndividual(lead.id, e.target.value)} value="" style={{ padding: '6px', borderRadius: '4px', background: '#222', color: '#fff', border: '1px solid #444', fontSize: '12px', cursor: 'pointer' }}>
                        <option key="empty-atrib" value="" disabled>Atribuir...</option>
                        {consultores.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                     </select>
                  ) : (
                     <button onClick={() => handleTornarDisponivel(lead.id)} style={{ padding: '6px 12px', fontSize: '11px', background: '#991b1b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Liberar
                     </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
