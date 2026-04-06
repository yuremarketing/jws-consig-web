import { useState, useEffect } from 'react';
import { leadService } from '../services/leadService';

const ConsultorDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarMeusLeads = async () => {
    setLoading(true);
    try {
      // Aqui vamos precisar de um endpoint no backend que retorne apenas os leads do consultor logado
      // Por enquanto, vamos simular ou usar a lista geral filtrada se o backend permitir
      const data = await leadService.listarMeusLeads();
      setLeads(data.content || []);
    } catch (err) {
      console.error("Erro ao carregar leads do consultor:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarMeusLeads(); }, []);

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h2 style={{ marginBottom: '20px' }}>🎯 Minha Fila de Trabalho</h2>
      
      {loading ? (
        <p>Carregando seus leads...</p>
      ) : (
        <div style={{ background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', background: '#222', color: '#888', borderBottom: '1px solid #333' }}>
                <th style={{ padding: '15px' }}>Nome do Cliente</th>
                <th style={{ padding: '15px' }}>Órgão</th>
                <th style={{ padding: '15px' }}>Margem</th>
                <th style={{ padding: '15px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {leads.length > 0 ? leads.map((lead: any) => (
                <tr key={lead.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '15px' }}>{lead.nome}</td>
                  <td style={{ padding: '15px' }}>{lead.orgao}</td>
                  <td style={{ padding: '15px', color: '#4caf50', fontWeight: 'bold' }}>R$ {lead.margem}</td>
                  <td style={{ padding: '15px' }}>
                    <button style={{ background: '#1b5e20', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
                      WhatsApp
                    </button>
                    <button style={{ background: '#0d47a1', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                      Tabular
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} style={{ padding: '20px', textAlign: 'center' }}>Você ainda não recebeu leads do Admin.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ConsultorDashboard;
