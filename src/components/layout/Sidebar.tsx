import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Target, LogOut } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const nome = localStorage.getItem('nome') || 'Usuário';
  const role = localStorage.getItem('role') || 'ROLE_USER';

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div style={{ width: '260px', height: '100vh', background: '#0a0a0a', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: '900', letterSpacing: '2px', margin: 0 }}>
          CONSIG <span style={{ color: '#4caf50' }}>SNIPER</span>
        </h1>
        
        <div style={{ marginTop: '25px', padding: '15px', background: '#111', borderRadius: '8px', border: '1px solid #333' }}>
          <p style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold', margin: 0 }}>{nome}</p>
          <p style={{ color: '#888', fontSize: '11px', margin: '4px 0 10px 0' }}>
            {role === 'ROLE_ADMIN' ? 'Administrador' : 'Consultor'}
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(76, 175, 80, 0.15)', padding: '5px 10px', borderRadius: '4px', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4caf50', boxShadow: '0 0 10px #4caf50' }}></span>
            <span style={{ fontSize: '10px', color: '#4caf50', fontWeight: '900', letterSpacing: '0.5px' }}>🟢 CONTA ATIVA</span>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <NavLink to="/dashboard" style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', textDecoration: 'none', color: isActive ? '#fff' : '#888', background: isActive ? '#1a1a1a' : 'transparent' })}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        {role === 'ROLE_ADMIN' && (
          <NavLink to="/admin/users" style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', textDecoration: 'none', color: isActive ? '#fff' : '#888', background: isActive ? '#1a1a1a' : 'transparent' })}>
            <Users size={20} /> Equipe Sniper
          </NavLink>
        )}
        <NavLink to="/leads" style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', textDecoration: 'none', color: isActive ? '#fff' : '#888', background: isActive ? '#1a1a1a' : 'transparent' })}>
          <Target size={20} /> Meus Leads
        </NavLink>
      </nav>

      <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontWeight: 'bold', marginTop: 'auto' }}>
        <LogOut size={20} /> Sair do Sistema
      </button>
    </div>
  );
};

export default Sidebar;
