import api from './api';

export const leadService = {
  // 👇 Apenas mudei o nome de listarTodos para listarLeads
  listarLeads: async (filtros: any = {}) => {
    const params = new URLSearchParams();
    Object.keys(filtros).forEach(key => {
      const value = filtros[key];
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else if (value) {
        params.append(key, value);
      }
    });
    const response = await api.get(`/admin/leads?${params.toString()}`);
    return response.data;
  },
  listarConsultores: async () => (await api.get('/admin/consultores')).data,
  listarOrgaos: async () => (await api.get('/admin/leads/orgaos')).data,
  atribuirLeads: async (leadIds: number[], consultorId: number) => 
    (await api.put('/admin/leads/atribuir', { leadIds, consultorId })).data,
  atualizarStatus: async (id: number, status: string) => {
    return (await api.patch(`/admin/leads/${id}/status`, { status })).data;
  },
  importarCSV: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return (await api.post('/admin/leads/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })).data;
  }
};
