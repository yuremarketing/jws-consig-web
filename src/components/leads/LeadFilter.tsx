import { useState, useEffect } from 'react';
import { leadService } from '../../services/leadService';

interface Props { onFilter: (filtros: any) => void; }

export const LeadFilter = ({ onFilter }: Props) => {
  const [orgaosDisponiveis, setOrgaosDisponiveis] = useState<string[]>([]);
  const [orgaosSelecionados, setOrgaosSelecionados] = useState<string[]>([]);
  const [margem, setMargem] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const carregarOrgaos = async () => {
      try {
        const lista: string[] = await leadService.listarOrgaos();
        const apenasNomes = lista.filter(o => isNaN(Number(o)));
        setOrgaosDisponiveis(apenasNomes);
      } catch (err) { console.error("Erro ao carregar órgãos:", err); }
    };
    carregarOrgaos();
  }, []);

  const toggleOrgao = (nome: string) => {
    const novos = orgaosSelecionados.includes(nome)
      ? orgaosSelecionados.filter(o => o !== nome)
      : [...orgaosSelecionados, nome];
    setOrgaosSelecionados(novos);
    // 👇 AQUI ESTAVA O ERRO! CORRIGIDO PARA "orgaos" (plural)
    onFilter({ orgaos: novos, margem });
  };

  const handleMargemChange = (val: string) => {
    setMargem(val);
    // 👇 AQUI TAMBÉM! CORRIGIDO PARA "orgaos" (plural)
    onFilter({ orgaos: orgaosSelecionados, margem: val });
  };

  const orgaosFiltrados = orgaosDisponiveis.filter(o => 
    o.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ background: '#1a1a1a', padding: '12px 20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #333', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{ color: '#888', fontSize: '13px', fontWeight: 'bold' }}>Filtros:</span>
        
        {orgaosSelecionados.map(o => (
          <div key={o} style={{ background: '#007bff', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {o}
            <span onClick={() => toggleOrgao(o)} style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>×</span>
          </div>
        ))}

        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ background: 'transparent', border: '1px dashed #007bff', color: '#007bff', padding: '4px 15px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}
        >
          + Órgão
        </button>
      </div>

      <div style={{ width: '1px', height: '24px', background: '#333' }} />

      <select 
        value={margem} 
        onChange={e => handleMargemChange(e.target.value)}
        style={{ padding: '6px 12px', borderRadius: '6px', background: '#000', color: '#fff', border: '1px solid #444', fontSize: '13px', outline: 'none' }}
      >
        <option value="">Todas as Margens</option>
        <option value="COM_MARGEM">💵 Com Margem</option>
        <option value="SEM_MARGEM">🚫 Sem Margem</option>
      </select>

      <button 
        onClick={() => { setOrgaosSelecionados([]); setMargem(''); onFilter({}); }}
        style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '13px', marginLeft: 'auto' }}
      >
        Limpar Tudo
      </button>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#222', width: '450px', borderRadius: '12px', border: '1px solid #444', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', overflow: 'hidden' }}>
            
            <div style={{ padding: '15px 20px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '16px' }}>Selecionar Órgãos</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#888', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ padding: '20px' }}>
              <input 
                type="text" 
                placeholder="Pesquise por nome..." 
                autoFocus
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#000', border: '1px solid #444', color: '#fff', marginBottom: '15px', outline: 'none' }}
              />
              
              <div style={{ maxHeight: '250px', overflowY: 'auto', background: '#111', borderRadius: '8px', border: '1px solid #333' }}>
                {orgaosFiltrados.map(o => (
                  <label key={o} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #222', transition: '0.2s', backgroundColor: orgaosSelecionados.includes(o) ? '#007bff22' : 'transparent' }}>
                    <input 
                      type="checkbox" 
                      checked={orgaosSelecionados.includes(o)}
                      onChange={() => toggleOrgao(o)}
                    />
                    <span style={{ color: orgaosSelecionados.includes(o) ? '#007bff' : '#ccc', fontSize: '13px' }}>{o}</span>
                  </label>
                ))}
                {orgaosFiltrados.length === 0 && <div style={{ padding: '20px', color: '#666', textAlign: 'center' }}>Nenhum órgão com nome encontrado.</div>}
              </div>
            </div>

            <div style={{ padding: '15px 20px', background: '#1a1a1a', textAlign: 'right' }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 25px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
