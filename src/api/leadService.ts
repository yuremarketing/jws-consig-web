import api from './axios';

export const leadService = {
  // Busca leads para o Admin (Trata paginação do Spring Boot)
  listarLeads: async (filters = {}) => {
    const response = await api.get('/leads', { params: filters });
    return response.data.content || []; 
  },

  // Busca leads específicos do consultor logado
  getMeusLeads: async () => {
    const response = await api.get('/leads/meus');
    return response.data.content || [];
  },
  
  // Lista consultores para o Select da tabela
  listarConsultores: async () => {
    const response = await api.get('/api/usuarios/consultores'); 
    return response.data;
  },

  // Atribuição em massa ou individual
  atribuirLeads: async (leadIds: number[], consultorId: number) => {
    return await api.post('/leads/atribuir', { leadIds, consultorId });
  },

  // Atualização de status (ex: Liberar lead)
  atualizarStatus: async (id: number, status: string) => {
    return await api.put(`/leads/${id}/status`, { status });
  }
};
