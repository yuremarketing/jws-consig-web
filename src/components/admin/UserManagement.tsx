import React, { useEffect, useState } from 'react';
import { userService } from '../../services/userService';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ nome: '', email: '', role: '' });
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ nome: '', email: '', password: '', role: 'CONSULTOR' });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const carregarUsers = async () => {
    try {
      const data = await userService.listar();
      setUsers(data.sort((a: any, b: any) => a.nome.localeCompare(b.nome)));
    } catch (error) { console.error(error); }
  };

  useEffect(() => { carregarUsers(); }, []);

  const handleCriar = async () => {
    setErro(''); setSucesso('');
    if (!newUser.nome || !newUser.email || !newUser.password) {
      setErro('Preencha todos os campos obrigatórios.'); return;
    }
    try {
      await userService.salvar(newUser);
      setSucesso('Usuário criado com sucesso!');
      setNewUser({ nome: '', email: '', password: '', role: 'CONSULTOR' });
      setShowForm(false);
      carregarUsers();
    } catch (error: any) {
      setErro(error?.response?.data?.message || 'Erro ao criar usuário.');
    }
  };

  const handleStartEdit = (user: any) => {
    setEditingId(user.id);
    setEditForm({ nome: user.nome, email: user.email, role: user.role });
  };

  const handleSaveEdit = async (id: number) => {
    try {
      await userService.atualizar(id, editForm);
      setEditingId(null);
      carregarUsers();
    } catch (error) { alert('Erro ao atualizar'); }
  };

  const handleToggleStatus = async (id: number) => {
    if (window.confirm('Alterar status?')) {
      await userService.deletar(id);
      carregarUsers();
    }
  };

  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>GESTÃO DE TROPA SNIPER</h2>
        <button onClick={() => { setShowForm(!showForm); setErro(''); setSucesso(''); }}
          style={{ background: '#2196f3', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
          {showForm ? '✕ Cancelar' : '+ Criar Usuário'}
        </button>
      </div>

      {sucesso && <div style={{ background: '#1b5e20', color: '#69f0ae', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>✅ {sucesso}</div>}
      {erro    && <div style={{ background: '#b71c1c', color: '#ff8a80', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>❌ {erro}</div>}

      {showForm && (
        <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', color: '#90caf9' }}>Novo Usuário</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#888' }}>Nome *</label>
              <input value={newUser.nome} onChange={e => setNewUser({ ...newUser, nome: e.target.value })}
                placeholder="Nome completo"
                style={{ width: '100%', background: '#222', color: '#fff', border: '1px solid #444', padding: '10px', borderRadius: '4px', marginTop: '4px' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#888' }}>E-mail *</label>
              <input value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="email@consig.com" type="email"
                style={{ width: '100%', background: '#222', color: '#fff', border: '1px solid #444', padding: '10px', borderRadius: '4px', marginTop: '4px' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#888' }}>Senha provisória *</label>
              <input value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Senha inicial" type="password"
                style={{ width: '100%', background: '#222', color: '#fff', border: '1px solid #444', padding: '10px', borderRadius: '4px', marginTop: '4px' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#888' }}>Perfil *</label>
              <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                style={{ width: '100%', background: '#222', color: '#fff', border: '1px solid #444', padding: '10px', borderRadius: '4px', marginTop: '4px' }}>
                <option value="CONSULTOR">CONSULTOR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </div>
          <button onClick={handleCriar}
            style={{ marginTop: '16px', background: '#43a047', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
            ✔ Salvar Usuário
          </button>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#111' }}>
        <thead>
          <tr style={{ background: '#1a1a1a', color: '#888' }}>
            <th style={{ padding: '15px', textAlign: 'left' }}>Nome</th>
            <th style={{ padding: '15px', textAlign: 'left' }}>E-mail</th>
            <th style={{ padding: '15px', textAlign: 'center' }}>Status</th>
            <th style={{ padding: '15px', textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ borderBottom: '1px solid #222', opacity: u.ativo ? 1 : 0.5 }}>
              <td style={{ padding: '15px' }}>
                {editingId === u.id
                  ? <input value={editForm.nome} onChange={e => setEditForm({ ...editForm, nome: e.target.value })}
                      style={{ background: '#222', color: '#fff', border: '1px solid #444', padding: '5px' }} />
                  : u.nome}
              </td>
              <td style={{ padding: '15px' }}>
                {editingId === u.id
                  ? <input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                      style={{ background: '#222', color: '#fff', border: '1px solid #444', padding: '5px' }} />
                  : u.email}
              </td>
              <td style={{ padding: '15px', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', color: u.ativo ? '#4caf50' : '#666' }}>
                  {u.ativo ? '🟢 ATIVO' : '⚪ INATIVO'}
                </span>
              </td>
              <td style={{ padding: '15px', textAlign: 'center' }}>
                {editingId === u.id ? (
                  <button onClick={() => handleSaveEdit(u.id)}
                    style={{ color: '#4caf50', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    SALVAR
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <button onClick={() => handleStartEdit(u)}
                      style={{ color: '#2196f3', background: 'none', border: 'none', cursor: 'pointer' }}>EDITAR</button>
                    <button onClick={() => handleToggleStatus(u.id)}
                      style={{ color: u.ativo ? '#ff9800' : '#4caf50', background: 'none', border: 'none', cursor: 'pointer' }}>
                      {u.ativo ? 'DESATIVAR' : 'REATIVAR'}
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
