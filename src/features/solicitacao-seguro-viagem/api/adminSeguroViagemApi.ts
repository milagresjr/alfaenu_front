import { api } from '@/services/api'
import { PaginatedSolicitacaoSeguroViagem, SolicitacaoSeguroViagemType, SolicitacaoSeguroViagemDescricaoType } from '../types'

export interface GetAllSolicitacoesParams {
  search?: string
  status?: string
  page?: number
  per_page?: number
}

export const getAllSolicitacoesSeguroViagem = async (params?: GetAllSolicitacoesParams): Promise<PaginatedSolicitacaoSeguroViagem> => {
  try {
    const response = await api.get<PaginatedSolicitacaoSeguroViagem>('/solicitacao-seguro-viagem', { params })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar solicitações de seguro de viagem:', error)
    throw error
  }
}

export const aprovarSolicitacaoSeguroViagem = async (id: number): Promise<{ message: string; data: SolicitacaoSeguroViagemType }> => {
  try {
    const response = await api.post<{ message: string; data: SolicitacaoSeguroViagemType }>(`/solicitacao-seguro-viagem/${id}/aprovar`)
    return response.data
  } catch (error) {
    console.error('Erro ao aprovar solicitação:', error)
    throw error
  }
}

export const rejeitarSolicitacaoSeguroViagem = async (id: number, motivo_rejeicao?: string): Promise<{ message: string; data: SolicitacaoSeguroViagemType }> => {
  try {
    const response = await api.post<{ message: string; data: SolicitacaoSeguroViagemType }>(`/solicitacao-seguro-viagem/${id}/rejeitar`, { motivo_rejeicao })
    return response.data
  } catch (error) {
    console.error('Erro ao rejeitar solicitação:', error)
    throw error
  }
}

export const enviarDocumentoSeguroViagem = async (id: number, formData: FormData): Promise<{ message: string; data: SolicitacaoSeguroViagemType }> => {
  try {
    const response = await api.post<{ message: string; data: SolicitacaoSeguroViagemType }>(
      `/solicitacao-seguro-viagem/${id}/enviar-documento`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response.data
  } catch (error) {
    console.error('Erro ao enviar documento:', error)
    throw error
  }
}

export const getDescricoesSeguroViagem = async (): Promise<SolicitacaoSeguroViagemDescricaoType[]> => {
  try {
    const response = await api.get<{ data: SolicitacaoSeguroViagemDescricaoType[] }>('/solicitacao-seguro-viagem-descricao')
    return response.data.data
  } catch (error) {
    console.error('Erro ao buscar descrições:', error)
    throw error
  }
}

export const createDescricaoSeguroViagem = async (data: { descricao: string; status?: boolean }): Promise<SolicitacaoSeguroViagemDescricaoType> => {
  try {
    const response = await api.post<{ data: SolicitacaoSeguroViagemDescricaoType }>('/solicitacao-seguro-viagem-descricao', data)
    return response.data.data
  } catch (error) {
    console.error('Erro ao criar descrição:', error)
    throw error
  }
}

export const updateDescricaoSeguroViagem = async (id: string, data: { descricao?: string; status?: boolean }): Promise<SolicitacaoSeguroViagemDescricaoType> => {
  try {
    const response = await api.put<{ data: SolicitacaoSeguroViagemDescricaoType }>(`/solicitacao-seguro-viagem-descricao/${id}`, data)
    return response.data.data
  } catch (error) {
    console.error('Erro ao atualizar descrição:', error)
    throw error
  }
}

export const deleteDescricaoSeguroViagem = async (id: string): Promise<void> => {
  try {
    await api.delete(`/solicitacao-seguro-viagem-descricao/${id}`)
  } catch (error) {
    console.error('Erro ao excluir descrição:', error)
    throw error
  }
}

export const toggleDescricaoSeguroViagemActive = async (id: string): Promise<SolicitacaoSeguroViagemDescricaoType> => {
  try {
    const response = await api.patch<{ data: SolicitacaoSeguroViagemDescricaoType }>(`/solicitacao-seguro-viagem-descricao/${id}/toggle-active`)
    return response.data.data
  } catch (error) {
    console.error('Erro ao alternar status da descrição:', error)
    throw error
  }
}
