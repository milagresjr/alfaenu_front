import { api } from '@/services/api'
import { PaginatedSolicitacaoAgendamento, SolicitacaoAgendamentoType, SolicitacaoAgendamentoDescricaoType } from '../types'

export interface GetAllSolicitacoesParams {
  search?: string
  status?: string
  page?: number
  per_page?: number
}

export const getAllSolicitacoesAgendamento = async (params?: GetAllSolicitacoesParams): Promise<PaginatedSolicitacaoAgendamento> => {
  try {
    const response = await api.get<PaginatedSolicitacaoAgendamento>('/solicitacao-agendamento', { params })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar solicitações de agendamento:', error)
    throw error
  }
}

export const aprovarSolicitacaoAgendamento = async (id: string): Promise<{ message: string; data: SolicitacaoAgendamentoType }> => {
  try {
    const response = await api.post<{ message: string; data: SolicitacaoAgendamentoType }>(`/solicitacao-agendamento/${id}/aprovar`)
    return response.data
  } catch (error) {
    console.error('Erro ao aprovar solicitação:', error)
    throw error
  }
}

export const rejeitarSolicitacaoAgendamento = async (id: string, motivo_rejeicao?: string): Promise<{ message: string; data: SolicitacaoAgendamentoType }> => {
  try {
    const response = await api.post<{ message: string; data: SolicitacaoAgendamentoType }>(`/solicitacao-agendamento/${id}/rejeitar`, { motivo_rejeicao })
    return response.data
  } catch (error) {
    console.error('Erro ao rejeitar solicitação:', error)
    throw error
  }
}

export const enviarAgendamento = async (id: string, formData: FormData): Promise<{ message: string; data: SolicitacaoAgendamentoType }> => {
  try {
    const response = await api.post<{ message: string; data: SolicitacaoAgendamentoType }>(
      `/solicitacao-agendamento/${id}/enviar-agendamento`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response.data
  } catch (error) {
    console.error('Erro ao enviar agendamento:', error)
    throw error
  }
}

export const getDescricoes = async (): Promise<SolicitacaoAgendamentoDescricaoType[]> => {
  try {
    const response = await api.get<{ data: SolicitacaoAgendamentoDescricaoType[] }>('/solicitacao-agendamento-descricao')
    return response.data.data
  } catch (error) {
    console.error('Erro ao buscar descrições:', error)
    throw error
  }
}

export const createDescricao = async (data: { descricao: string; status?: boolean }): Promise<SolicitacaoAgendamentoDescricaoType> => {
  try {
    const response = await api.post<{ data: SolicitacaoAgendamentoDescricaoType }>('/solicitacao-agendamento-descricao', data)
    return response.data.data
  } catch (error) {
    console.error('Erro ao criar descrição:', error)
    throw error
  }
}

export const updateDescricao = async (id: string, data: { descricao?: string; status?: boolean }): Promise<SolicitacaoAgendamentoDescricaoType> => {
  try {
    const response = await api.put<{ data: SolicitacaoAgendamentoDescricaoType }>(`/solicitacao-agendamento-descricao/${id}`, data)
    return response.data.data
  } catch (error) {
    console.error('Erro ao atualizar descrição:', error)
    throw error
  }
}

export const deleteDescricao = async (id: string): Promise<void> => {
  try {
    await api.delete(`/solicitacao-agendamento-descricao/${id}`)
  } catch (error) {
    console.error('Erro ao excluir descrição:', error)
    throw error
  }
}
