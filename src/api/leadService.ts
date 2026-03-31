import api from './axios';
import type { Lead, StatusLead } from '../types';

export const leadService = {
  getMeusLeads: async (): Promise<Lead[]> => {
    const response = await api.get<Lead[]>('/leads/meus-leads');
    return response.data;
  },
  
  updateStatus: async (id: number, status: StatusLead): Promise<Lead> => {
    const response = await api.put<Lead>(`/leads/${id}/status`, { status });
    return response.data;
  }
};
