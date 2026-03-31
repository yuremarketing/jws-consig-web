import { useState, useEffect, useRef, useCallback } from 'react';
import { leadService } from '../../services/leadService';

interface Lead { id: number; nome: string; cpf: string; status: string; consultorNome?: string; }
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
  const [consultorId, setConsultorId] = useState('');

  // Sensor que detecta quando a última linha da tabela aparece na tela
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: any) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
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

  const handleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleAtribuir = async () => {
    if (selectedIds.length === 0 || !consultorId) return;
    try {
      await leadService.atribuirLeads(selectedIds, Number(consultorId));
      alert("✅ Leads atribuídos com sucesso!");
      setSelectedIds([]);
      onRefresh(); // Volta pro topo depois de atribuir
    } catch (err) { alert("❌ Erro ao atribuir leads."); }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', background: '#e9ecef', padding: '10px', borderRadius: '4px', color: '#333' }}>
        <strong>Ação em massa:</strong>
        <select value={consultorId} onChange={e => setConsultorId(e.target.value)} style={{ padding: '5px' }}>
          <option value="">Selecionar Consultor...</option>
          {consultores.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        <button onClick={handleAtribuir} disabled={selectedIds.length === 0 || !consultorId} style={{ padding: '5px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Atribuir Selecionados ({selectedIds.length})
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #444', color: '#fff' }}>
        <thead>
          <tr style={{ background: '#222', textAlign: 'left' }}>
            <th style={{ padding: '10px', borderBottom: '1px solid #555' }}>Select</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #555' }}>Nome</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #555' }}>CPF</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #555' }}>Status</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #555' }}>Consultor Atual</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => {
            // Se for o último lead da lista, a gente anexa o sensor nele
            const isLast = index === leads.length - 1;
            return (
              <tr key={lead.id} ref={isLast ? lastElementRef : null} style={{ borderBottom: '1px solid #444' }}>
                <td style={{ padding: '10px', textAlign: 'center' }}><input type="checkbox" checked={selectedIds.includes(lead.id)} onChange={() => handleSelect(lead.id)} /></td>
                <td style={{ padding: '10px' }}>{lead.nome}</td>
                <td style={{ padding: '10px' }}>{lead.cpf}</td>
                <td style={{ padding: '10px' }}><span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', background: '#d4edda', color: '#155724', fontWeight: 'bold' }}>{lead.status}</span></td>
                <td style={{ padding: '10px' }}>{lead.consultorNome || 'Disponível'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
