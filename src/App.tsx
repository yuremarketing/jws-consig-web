import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ConsultorDashboard from './pages/ConsultorDashboard';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
  const [nome, setNome] = useState<string | null>(localStorage.getItem('nome'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
      setRole(localStorage.getItem('role'));
      setNome(localStorage.getItem('nome'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!token) {
    return <Login />;
  }

  const isAdmin = role === 'ROLE_ADMIN';

  return (
    <>
      <div style={{ background: '#1a1a1a', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333' }}>
        <div style={{ fontWeight: 'bold', color: '#007bff' }}>🚀 CONSIG SNIPER v1.0</div>
        <div>
          <span style={{ marginRight: '15px', fontSize: '14px' }}>
            {isAdmin ? '🛠️ Painel Admin' : '📞 Operação'} | 👤 {nome || 'Usuário'}
          </span>
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '5px 12px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}
          >
            Sair
          </button>
        </div>
      </div>
      
      {isAdmin ? <Dashboard /> : <ConsultorDashboard />}
    </>
  );
}

export default App;
