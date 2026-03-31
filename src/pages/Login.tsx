import { useState } from 'react';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      window.location.href = '/dashboard'; // Vai para o Dashboard que já funciona
    } catch (err) {
      setErro('❌ E-mail ou senha inválidos.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f5f5' }}>
      <form onSubmit={handleLogin} style={{ padding: '30px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center' }}>🎯 Consig-Sniper Login</h2>
        <div style={{ marginBottom: '15px' }}>
          <label>E-mail:</label><br/>
          <input type="email" style={{ width: '100%', padding: '8px' }} value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Senha:</label><br/>
          <input type="password" style={{ width: '100%', padding: '8px' }} value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Entrar no Sistema
        </button>
      </form>
    </div>
  );
}
