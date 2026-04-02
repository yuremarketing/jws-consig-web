import React, { useEffect, useState } from 'react';
import { userService } from '../../services/userService';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ nome: '', email: '', role: '' });

  const carregarUsers = async () => {
    try {
      const data = await userService.listar();
      const sorted = data.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
      setUsers(sorted);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { carregarUsers(); }, []);

  const handleStartEdit = (user: any) => {
    setEditingId(user.id);
    setEditForm({ nome: user.nome, email: user.email, role: user.role });
  };

  const handleSaveEdit = async (id: number) => {
    try {
      await userService.atualizar(id, editForm);
      setEditingId(null);
      carregarUsers();
    } catch (error) { alert("Erro ao atualizar"); }
  };

  const handleToggleStatus = async (id: number) => {
    if (window.confirm("Alterar status?")) {
      await userService.deletar(id);
      carregarUsers();
    }
  };

  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <h2 style={{ marginBottom: '20px' }}>GESTÃO DE TROPA SNIPER</h2>
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
                {editingId === u.id ? 
                  <input value={editForm.nome} onChange={e => setEditForm({...editForm, nome: e.target.value})} style={{ background: '#222', color: '#fff', border: '1px solid #444', padding: '5px' }} /> 
                  : u.nome}
              </td>
              <td style={{ padding: '15px' }}>
                {editingId === u.id ? 
                  <input value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} style={{ background: '#222', color: '#fff', border: '1px solid #444', padding: '5px' }} /> 
                  : u.email}
              </td>
              <td style={{ padding: '15px', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', color: u.ativo ? '#4caf50' : '#666' }}>{u.ativo ? "🟢 ATIVO" : "⚪ INATIVO"}</span>
              </td>
              <td style={{ padding: '15px', textAlign: 'center' }}>
                {editingId === u.id ? (
                  <button onClick={() => handleSaveEdit(u.id)} style={{ color: '#4caf50', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>SALVAR</button>
                ) : (
                  <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <button onClick={() => handleStartEdit(u)} style={{ color: '#2196f3', background: 'none', border: 'none', cursor: 'pointer' }}>EDITAR</button>
                    <button onClick={() => handleToggleStatus(u.id)} style={{ color: u.ativo ? '#ff9800' : '#4caf50', background: 'none', border: 'none', cursor: 'pointer' }}>{u.ativo ? "DESATIVAR" : "REATIVAR"}</button>
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
