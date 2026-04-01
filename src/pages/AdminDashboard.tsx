import { useEffect, useState } from 'react';
import { leadService } from '../services/leadService';
import { LeadFilter } from '../components/leads/LeadFilter';
import { LeadTable } from '../components/leads/LeadTable';

export const AdminDashboard = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const carregarLeads = async (f = {}) => {
    setLoading(true);
    try {
      const data = await leadService.listarLeads(f);
      setLeads(data);
    } catch (err) {
      console.error("Erro ao buscar leads", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarLeads(); }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{color: 'white'}}>Painel de Gestão Sniper</h2>
      <LeadFilter onFilter={carregarLeads} />
      {loading ? <p style={{color:'white'}}>Carregando...</p> : <LeadTable leads={leads} onRefresh={carregarLeads} />}
    </div>
  );
};
