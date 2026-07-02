import { api } from '@/services/api'
import { PaginatedSolicitacaoPrintVoo, SolicitacaoPrintVooType, SolicitacaoPrintVooDescricaoType } from '../types'

export interface GetAllSolicitacoesParams {
  search?: string
  status?: string
  page?: number
  per_page?: number
}

export const getAllSolicitacoesPrintVoo = async (params?: GetAllSolicitacoesParams): Promise<PaginatedSolicitacaoPrintVoo> => {
  try {
    const response = await api.get<PaginatedSolicitacaoPrintVoo>('/solicitacao-print-voo', { params })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar solicitações de print de voo:', error)
    throw error
  }
}

export const aprovarSolicitacaoPrintVoo = async (id: string): Promise<{ message: string; data: SolicitacaoPrintVooType }> => {
  try {
    const response = await api.post<{ message: string; data: SolicitacaoPrintVooType }>(`/solicitacao-print-voo/${id}/aprovar`)
    return response.data
  } catch (error) {
    console.error('Erro ao aprovar solicitação:', error)
    throw error
  }
}

export const rejeitarSolicitacaoPrintVoo = async (id: string, motivo_rejeicao?: string): Promise<{ message: string; data: SolicitacaoPrintVooType }> => {
  try {
    const response = await api.post<{ message: string; data: SolicitacaoPrintVooType }>(`/solicitacao-print-voo/${id}/rejeitar`, { motivo_rejeicao })
    return response.data
  } catch (error) {
    console.error('Erro ao rejeitar solicitação:', error)
    throw error
  }
}

export const enviarDocumentoPrintVoo = async (id: string, formData: FormData): Promise<{ message: string; data: SolicitacaoPrintVooType }> => {
  try {
    const response = await api.post<{ message: string; data: SolicitacaoPrintVooType }>(
      `/solicitacao-print-voo/${id}/enviar-documento`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response.data
  } catch (error) {
    console.error('Erro ao enviar documento:', error)
    throw error
  }
}

export const getDescricoesPrintVoo = async (): Promise<SolicitacaoPrintVooDescricaoType[]> => {
  try {
    const response = await api.get<{ data: SolicitacaoPrintVooDescricaoType[] }>('/solicitacao-print-voo-descricao')
    return response.data.data
  } catch (error) {
    console.error('Erro ao buscar descrições:', error)
    throw error
  }
}

export const createDescricaoPrintVoo = async (data: { descricao: string; status?: boolean }): Promise<SolicitacaoPrintVooDescricaoType> => {
  try {
    const response = await api.post<{ data: SolicitacaoPrintVooDescricaoType }>('/solicitacao-print-voo-descricao', data)
    return response.data.data
  } catch (error) {
    console.error('Erro ao criar descrição:', error)
    throw error
  }
}

export const updateDescricaoPrintVoo = async (id: string, data: { descricao?: string; status?: boolean }): Promise<SolicitacaoPrintVooDescricaoType> => {
  try {
    const response = await api.put<{ data: SolicitacaoPrintVooDescricaoType }>(`/solicitacao-print-voo-descricao/${id}`, data)
    return response.data.data
  } catch (error) {
    console.error('Erro ao atualizar descrição:', error)
    throw error
  }
}

export const deleteDescricaoPrintVoo = async (id: string): Promise<void> => {
  try {
    await api.delete(`/solicitacao-print-voo-descricao/${id}`)
  } catch (error) {
    console.error('Erro ao excluir descrição:', error)
    throw error
  }
}

export const toggleDescricaoPrintVooActive = async (id: string): Promise<SolicitacaoPrintVooDescricaoType> => {
  try {
    const response = await api.patch<{ data: SolicitacaoPrintVooDescricaoType }>(`/solicitacao-print-voo-descricao/${id}/toggle-active`)
    return response.data.data
  } catch (error) {
    console.error('Erro ao alternar status da descrição:', error)
    throw error
  }
}
