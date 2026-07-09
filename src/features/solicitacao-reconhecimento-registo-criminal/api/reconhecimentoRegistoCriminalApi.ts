import { api } from '@/services/api'
import { SolicitacaoReconhecimentoRegistoCriminalType, ConfigReconhecimentoCriminalType } from '../types'

export const createSolicitacaoReconhecimentoRegistoCriminal = async (formData: FormData): Promise<SolicitacaoReconhecimentoRegistoCriminalType> => {
  try {
    const response = await api.post<SolicitacaoReconhecimentoRegistoCriminalType>('/reconhecimento-registo-criminal', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  } catch (error) {
    console.error('Erro ao criar solicitação de reconhecimento de registo criminal:', error)
    throw error
  }
}

export const getSolicitacaoReconhecimentoRegistoCriminalByClienteId = async (clienteId: string): Promise<SolicitacaoReconhecimentoRegistoCriminalType> => {
  try {
    const response = await api.get<SolicitacaoReconhecimentoRegistoCriminalType>(`/reconhecimento-registo-criminal/cliente/${clienteId}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar solicitação por cliente:', error)
    throw error
  }
}

export const getMotivoRejeicaoReconhecimentoRegistoCriminal = async (id: string): Promise<{ motivo_rejeicao: string }> => {
  try {
    const response = await api.get<{ motivo_rejeicao: string }>(`/reconhecimento-registo-criminal/${id}/motivo-rejeicao`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar motivo de rejeição:', error)
    throw error
  }
}

export const getConfigReconhecimentoCriminal = async (): Promise<ConfigReconhecimentoCriminalType> => {
  try {
    const response = await api.get<{ data: ConfigReconhecimentoCriminalType }>('/config-reconhecimento-criminal')
    return response.data.data
  } catch (error) {
    console.error('Erro ao buscar configuração:', error)
    throw error
  }
}
