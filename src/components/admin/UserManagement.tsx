import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';

export const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [userData, setUserData] = useState({ nome: '', email: '', password: '', role: 'ROLE_CONSULTOR' });

  const carregarUsers = async () => {
    try {
      const data = await userService.listar();
      setUsers(data);
    } catch (err) { console.error("Erro ao carregar:", err); }
  };

  useEffect(() => { carregarUsers(); }, []);

  const handleOpenModal = (user: any | null = null) => {
    if (user) {
      setEditingUser(user);
      setUserData({ nome: user.nome, email: user.email, password: '', role: user.role });
    } else {
      setEditingUser(null);
      setUserData({ nome: '', email: '', password: '', role: 'ROLE_CONSULTOR' });
    }
    setShowModal(true);
  };

  const handleSalvar = async () => {
    try {
      if (editingUser) {
        // Lógica de Update no Backend (via PUT no AdminController)
        const response = await fetch(`http://localhost:8080/api/admin/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error();
      } else {
        await userService.salvar(userData);
      }
      setShowModal(false);
      carregarUsers();
    } catch (err) { alert("Erro ao salvar usuário."); }
  };

  const handleDeletar = async (id: number) => {
    if (window.confirm("Remover usuário?")) {
      await userService.deletar(id);
      carregarUsers();
    }
  };

  return (
    <div style={{ color: 'white', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>👥 Equipe Sniper</h2>
        <button onClick={() => handleOpenModal()} style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          + Novo Usuário
        </button>
      </div>

      <div style={{ background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #333', color: '#888' }}>
              <th style={{ padding: '15px' }}>Nome</th>
              <th style={{ padding: '15px' }}>E-mail</th>
              <th style={{ padding: '15px' }}>Cargo</th>
              <th style={{ padding: '15px', textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '15px' }}>{u.nome}</td>
                <td style={{ padding: '15px' }}>{u.email}</td>
                <td style={{ padding: '15px' }}>
                   <span style={{ fontSize: '11px', background: u.role === 'ROLE_ADMIN' ? '#4a148c' : '#1b5e20', padding: '4px 10px', borderRadius: '15px' }}>
                    {u.role.replace('ROLE_', '')}
                  </span>
                </td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <button onClick={() => handleOpenModal(u)} style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer', marginRight: '15px' }}>Editar</button>
                  <button onClick={() => handleDeletar(u.id)} style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer' }}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#222', padding: '30px', borderRadius: '12px', width: '400px', border: '1px solid #444' }}>
            <h3 style={{ marginTop: 0 }}>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" placeholder="Nome" value={userData.nome} onChange={e => setUserData({...userData, nome: e.target.value})} style={{ padding: '12px', background: '#000', color: '#fff', border: '1px solid #444' }} />
                <input type="email" placeholder="E-mail" value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})} style={{ padding: '12px', background: '#000', color: '#fff', border: '1px solid #444' }} />
                <input type="password" placeholder={editingUser ? "Nova senha (opcional)" : "Senha"} value={userData.password} onChange={e => setUserData({...userData, password: e.target.value})} style={{ padding: '12px', background: '#000', color: '#fff', border: '1px solid #444' }} />
                <select value={userData.role} onChange={e => setUserData({...userData, role: e.target.value})} style={{ padding: '12px', background: '#000', color: '#fff', border: '1px solid #444' }}>
                  <option value="ROLE_CONSULTOR">Consultor</option>
                  <option value="ROLE_ADMIN">Admin</option>
                </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button onClick={handleSalvar} style={{ flex: 1, padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>Salvar</button>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: '#444', color: 'white', border: 'none', borderRadius: '6px' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
