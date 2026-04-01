import { useState } from 'react';
import { LeadTable } from '../components/leads/LeadTable';
import { LeadFilter } from '../components/leads/LeadFilter';
import { LeadUpload } from '../components/leads/LeadUpload';
import { UserManagement } from '../components/admin/UserManagement';
import { leadService } from '../services/leadService';
import { useEffect } from 'react';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({ orgao: [], margem: '' });
  
  // ESTADO DE NAVEGAÇÃO: 'leads' ou 'users'
  const [activeTab, setActiveTab] = useState('leads');

  const carregarLeads = async (novaPagina = 0, novosFiltros = filtros) => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await leadService.listarTodos({ 
        page: novaPagina, 
        size: 50, 
        ...novosFiltros 
      });
      
      if (novaPagina === 0) {
        setLeads(data.content || data);
      } else {
        setLeads((prev) => [...prev, ...(data.content || data)]);
      }
      
      setHasMore(data.content !== undefined ? !data.last : false);
      setPage(novaPagina);
    } catch (err) {
      console.error("Erro ao carregar leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'leads') carregarLeads(0, filtros);
  }, [activeTab]);

  const handleFiltrar = (novosFiltros: any) => {
    setFiltros(novosFiltros);
    carregarLeads(0, novosFiltros);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* MENU DE NAVEGAÇÃO SNIPER */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '30px', 
        borderBottom: '1px solid #333',
        paddingBottom: '10px' 
      }}>
        <button 
          onClick={() => setActiveTab('leads')}
          style={{
            background: 'none', border: 'none', color: activeTab === 'leads' ? '#007bff' : '#888',
            fontWeight: 'bold', cursor: 'pointer', fontSize: '16px',
            borderBottom: activeTab === 'leads' ? '2px solid #007bff' : 'none',
            padding: '10px'
          }}
        >
          🎯 Gestão de Leads
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          style={{
            background: 'none', border: 'none', color: activeTab === 'users' ? '#007bff' : '#888',
            fontWeight: 'bold', cursor: 'pointer', fontSize: '16px',
            borderBottom: activeTab === 'users' ? '2px solid #007bff' : 'none',
            padding: '10px'
          }}
        >
          👥 Gestão de Equipe
        </button>
      </div>

      {/* RENDERIZAÇÃO CONDICIONAL */}
      {activeTab === 'leads' ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
            <LeadFilter onFilter={handleFiltrar} />
            <LeadUpload onUploadSuccess={() => carregarLeads(0)} />
          </div>
          
          <LeadTable 
            leads={leads} 
            onRefresh={() => carregarLeads(0)} 
            onLoadMore={() => carregarLeads(page + 1)}
            hasMore={hasMore}
            loading={loading}
          />
        </>
      ) : (
        <UserManagement />
      )}
      
    </div>
  );
};

export default Dashboard;
