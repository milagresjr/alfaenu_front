import { api } from '@/services/api'
import { PaginatedReconhecimentoNotario, SolicitacaoReconhecimentoNotarioType, ConfigReconhecimentoNotarioType } from '../types'

export interface GetAllSolicitacoesParams {
  search?: string
  status?: string
  page?: number
  per_page?: number
}

export const getConfigReconhecimentoNotario = async (): Promise<ConfigReconhecimentoNotarioType> => {
  try {
    const response = await api.get<{ data: ConfigReconhecimentoNotarioType }>('/config-reconhecimento-notario')
    return response.data.data
  } catch (error) {
    console.error('Erro ao buscar configuração:', error)
    throw error
  }
}

export const updateConfigReconhecimentoNotario = async (data: {
  preco_base: number
  taxa_domicilio: number
  endereco_agencia: string
}): Promise<ConfigReconhecimentoNotarioType> => {
  try {
    const response = await api.put<{ data: ConfigReconhecimentoNotarioType }>('/config-reconhecimento-notario', data)
    return response.data.data
  } catch (error) {
    console.error('Erro ao atualizar configuração:', error)
    throw error
  }
}

export const getAllSolicitacoesReconhecimentoNotario = async (params?: GetAllSolicitacoesParams): Promise<PaginatedReconhecimentoNotario> => {
  try {
    const response = await api.get<PaginatedReconhecimentoNotario>('/reconhecimento-notario', { params })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar solicitações:', error)
    throw error
  }
}

export const aprovarSolicitacaoReconhecimentoNotario = async (id: number): Promise<{ message: string; data: SolicitacaoReconhecimentoNotarioType }> => {
  try {
    const response = await api.post<{ message: string; data: SolicitacaoReconhecimentoNotarioType }>(`/reconhecimento-notario/${id}/aprovar`)
    return response.data
  } catch (error) {
    console.error('Erro ao aprovar solicitação:', error)
    throw error
  }
}
