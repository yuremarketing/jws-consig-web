import { useState } from 'react';

export const LeadFilter = ({ onFilter }: { onFilter: (f: any) => void }) => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [orgao, setOrgao] = useState('');
  const [estado, setEstado] = useState('');

  return (
    <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #28a745', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
      <div style={{flex: 1, minWidth: '150px'}}>
        <label style={{display:'block', fontSize:'11px', fontWeight:'bold', color: '#333'}}>NOME</label>
        <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome..." style={{width: '100%', padding:'8px', borderRadius:'4px', border:'1px solid #ccc'}} />
      </div>
      <div style={{flex: 1, minWidth: '120px'}}>
        <label style={{display:'block', fontSize:'11px', fontWeight:'bold', color: '#333'}}>CPF</label>
        <input value={cpf} onChange={e => setCpf(e.target.value)} placeholder="000.000..." style={{width: '100%', padding:'8px', borderRadius:'4px', border:'1px solid #ccc'}} />
      </div>
      <div style={{flex: 1, minWidth: '150px'}}>
        <label style={{display:'block', fontSize:'11px', fontWeight:'bold', color: '#333'}}>ÓRGÃO</label>
        <select value={orgao} onChange={e => setOrgao(e.target.value)} style={{width: '100%', padding:'8px', borderRadius:'4px', border:'1px solid #ccc', background: 'white'}}>
          <option value="">Todos</option>
          <option value="INSS">INSS</option>
          <option value="SIAPE">SIAPE</option>
          <option value="EXERCITO">Exército</option>
        </select>
      </div>
      <div style={{flex: 1, minWidth: '80px'}}>
        <label style={{display:'block', fontSize:'11px', fontWeight:'bold', color: '#333'}}>UF</label>
        <select value={estado} onChange={e => setEstado(e.target.value)} style={{width: '100%', padding:'8px', borderRadius:'4px', border:'1px solid #ccc', background: 'white'}}>
          <option value="">Todas</option>
          <option value="SP">SP</option><option value="RJ">RJ</option><option value="DF">DF</option><option value="MG">MG</option>
        </select>
      </div>
      <button onClick={() => onFilter({ nome, cpf, orgao, estado })} style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
        Filtrar 🔍
      </button>
    </div>
  );
};
