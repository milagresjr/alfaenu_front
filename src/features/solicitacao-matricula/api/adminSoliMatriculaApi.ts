import { api } from '@/services/api';
import { PaginatedSolicitacao, SolicitacaoMatriculaType } from '../types';

const API_URL = '/solicitacao-matricula';

export interface GetAllSolicitacoesParams {
  search?: string;
  status?: string;
  page?: number;
  per_page?: number;
}

export const getAllSolicitacoes = async (params?: GetAllSolicitacoesParams): Promise<PaginatedSolicitacao> => {
  try {
    const response = await api.get<PaginatedSolicitacao>(API_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar solicitações de matrícula:', error);
    throw error;
  }
};

export const aprovarSolicitacao = async (id: string): Promise<{ message: string; data: SolicitacaoMatriculaType }> => {
  try {
    const response = await api.post<{ message: string; data: SolicitacaoMatriculaType }>(`${API_URL}/${id}/aprovar`);
    return response.data;
  } catch (error) {
    console.error('Erro ao aprovar solicitação:', error);
    throw error;
  }
};

export const rejeitarSolicitacao = async (id: string, motivo_rejeicao?: string): Promise<{ message: string; data: SolicitacaoMatriculaType }> => {
  try {
    const response = await api.post<{ message: string; data: SolicitacaoMatriculaType }>(`${API_URL}/${id}/rejeitar`, { motivo_rejeicao });
    return response.data;
  } catch (error) {
    console.error('Erro ao rejeitar solicitação:', error);
    throw error;
  }
};

export const enviarDeclaracao = async (id: string, formData: FormData): Promise<{ message: string; data: SolicitacaoMatriculaType }> => {
  try {
    const response = await api.post<{ message: string; data: SolicitacaoMatriculaType }>(
      `${API_URL}/${id}/enviar-declaracao`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar declaração:', error);
    throw error;
  }
};
