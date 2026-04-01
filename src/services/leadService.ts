import api from './api';

export const leadService = {
  listarTodos: async (filtros: any = {}) => {
    const params = new URLSearchParams();
    Object.keys(filtros).forEach(key => {
      const value = filtros[key];
      if (Array.isArray(value)) {
        // Se for array (órgãos), manda orgao=GDF&orgao=SIAPE
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
  }
};
