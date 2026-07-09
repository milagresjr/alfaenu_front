import { api } from '@/services/api'
import { PaginatedReconhecimentoRegistoCriminal, SolicitacaoReconhecimentoRegistoCriminalType, ConfigReconhecimentoCriminalType } from '../types'

export const getConfigReconhecimentoCriminal = async (): Promise<ConfigReconhecimentoCriminalType> => {
  try {
    const response = await api.get<{ data: ConfigReconhecimentoCriminalType }>('/config-reconhecimento-criminal')
    return response.data.data
  } catch (error) {
    console.error('Erro ao buscar configuração:', error)
    throw error
  }
}

export interface GetAllSolicitacoesParams {
  search?: string
  status?: string
  page?: number
  per_page?: number
}

export const getAllSolicitacoesReconhecimentoRegistoCriminal = async (params?: GetAllSolicitacoesParams): Promise<PaginatedReconhecimentoRegistoCriminal> => {
  try {
    const response = await api.get<PaginatedReconhecimentoRegistoCriminal>('/reconhecimento-registo-criminal', { params })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar solicitações:', error)
    throw error
  }
}

export const aprovarSolicitacaoReconhecimentoRegistoCriminal = async (id: number): Promise<{ message: string; data: SolicitacaoReconhecimentoRegistoCriminalType }> => {
  try {
    const response = await api.post<{ message: string; data: SolicitacaoReconhecimentoRegistoCriminalType }>(`/reconhecimento-registo-criminal/${id}/aprovar`)
    return response.data
  } catch (error) {
    console.error('Erro ao aprovar solicitação:', error)
    throw error
  }
}

export const updateConfigReconhecimentoCriminal = async (data: {
  preco_base: number
  taxa_domicilio: number
  endereco_agencia: string
}): Promise<ConfigReconhecimentoCriminalType> => {
  try {
    const response = await api.put<{ data: ConfigReconhecimentoCriminalType }>('/config-reconhecimento-criminal', data)
    return response.data.data
  } catch (error) {
    console.error('Erro ao atualizar configuração:', error)
    throw error
  }
}
