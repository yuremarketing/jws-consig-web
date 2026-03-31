import { useState, useEffect } from 'react';
import { leadService } from '../../services/leadService';

interface Lead {
  id: number;
  nome: string;
  cpf: string;
  status: string;
  consultorNome?: string;
}

interface Consultor {
  id: number;
  nome: string;
}

interface Props {
  leads: Lead[];
  onRefresh: () => void;
}

export const LeadTable = ({ leads, onRefresh }: Props) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [consultores, setConsultores] = useState<Consultor[]>([]);
  const [consultorId, setConsultorId] = useState('');

  // BUSCA OS CONSULTORES REAIS DO JAVA
  useEffect(() => {
    const buscarConsultores = async () => {
      try {
        const data = await leadService.listarConsultores();
        setConsultores(data);
      } catch (err) {
        console.error("Erro ao buscar consultores:", err);
      }
    };
    buscarConsultores();
  }, []);

  const handleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAtribuir = async () => {
    if (selectedIds.length === 0 || !consultorId) return;
    try {
      await leadService.atribuirLeads(selectedIds, Number(consultorId));
      alert("✅ Leads atribuídos com sucesso!");
      setSelectedIds([]);
      onRefresh();
    } catch (err) {
      alert("❌ Erro ao atribuir leads.");
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', background: '#e9ecef', padding: '10px', borderRadius: '4px' }}>
        <strong>Ação em massa:</strong>
        
        {/* O DROPDOWN AGORA É DINÂMICO */}
        <select value={consultorId} onChange={e => setConsultorId(e.target.value)} style={{ padding: '5px' }}>
          <option value="">Selecionar Consultor...</option>
          {consultores.map(c => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>

        <button 
          onClick={handleAtribuir} 
          disabled={selectedIds.length === 0 || !consultorId}
          style={{ padding: '5px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Atribuir Selecionados ({selectedIds.length})
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
        <thead>
          <tr style={{ background: '#eee', textAlign: 'left' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Select</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Nome</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>CPF</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Consultor Atual</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <input type="checkbox" checked={selectedIds.includes(lead.id)} onChange={() => handleSelect(lead.id)} />
              </td>
              <td style={{ padding: '10px' }}>{lead.nome}</td>
              <td style={{ padding: '10px' }}>{lead.cpf}</td>
              <td style={{ padding: '10px' }}>
                <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', background: '#d4edda' }}>
                  {lead.status}
                </span>
              </td>
              <td style={{ padding: '10px' }}>{lead.consultorNome || 'Disponível'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
