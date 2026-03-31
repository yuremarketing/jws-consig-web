export type StatusLead = 'DISPONIVEL' | 'EM_ATENDIMENTO' | 'FINALIZADO';
export type RoleUser = 'ROLE_ADMIN' | 'ROLE_CONSULTOR';

export interface Lead {
  id: number;
  nome: string;
  cpf: string;
  margem: number;
  status: StatusLead;
}

export interface AuthResponse {
  token: string;
  role: RoleUser;
}

export interface LoginCredentials {
  email: string;
  password: string; // ou password, dependendo de como está no seu Java
}
