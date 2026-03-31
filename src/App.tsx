import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // Sincroniza o estado quando o componente monta
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Se não houver token, renderiza a tela de Login (CU-01)
  if (!token) {
    return <Login />;
  }

  // Se houver token, renderiza o Dashboard com um botão de Sair (CU-02)
  return (
    <>
      <div style={{ background: '#333', color: 'white', padding: '10px', textAlign: 'right' }}>
        <span style={{ marginRight: '15px' }}>Sessão Ativa: 🟢 Admin</span>
        <button 
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
        >
          Sair do Sistema
        </button>
      </div>
      <Dashboard />
    </>
  );
}

export default App;
