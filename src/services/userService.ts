import api from './api';

export const userService = {
  listar: async () => (await api.get('/admin/users')).data,
  salvar: async (user: any) => (await api.post('/admin/users', user)).data,
  atualizar: async (id: number, user: any) => (await api.put("/admin/users/" + id, user)).data,
  deletar: async (id: number) => (await api.delete("/admin/users/" + id)).data,
};
