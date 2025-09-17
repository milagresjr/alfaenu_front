export type ClienteType = {
  id?: number;
  nome: string;
  email: string;
  telefone?: string;
  data_nascimento?: string;
  endereco?: string;
  n_bi?: string;
  estado?: 'ativo' | 'inativo';
  created_at?: string;
  updated_at?: string;
};
