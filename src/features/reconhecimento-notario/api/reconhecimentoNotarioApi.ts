import { api } from '@/services/api'
import { SolicitacaoReconhecimentoNotarioType, ConfigReconhecimentoNotarioType } from '../types'

export const createSolicitacaoReconhecimentoNotario = async (formData: FormData): Promise<SolicitacaoReconhecimentoNotarioType> => {
  try {
    const response = await api.post<SolicitacaoReconhecimentoNotarioType>('/reconhecimento-notario', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  } catch (error) {
    console.error('Erro ao criar solicitação de reconhecimento notário:', error)
    throw error
  }
}

export const getSolicitacaoReconhecimentoNotarioByClienteId = async (clienteId: string): Promise<SolicitacaoReconhecimentoNotarioType> => {
  try {
    const response = await api.get<SolicitacaoReconhecimentoNotarioType>(`/reconhecimento-notario/cliente/${clienteId}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar solicitação por cliente:', error)
    throw error
  }
}

export const gerarDeclaracaoAutonoma = async (params: { cliente_id: number; financiador_id: number; estado_civil?: string; profissao?: string }): Promise<{ declaracao_autonoma_path: string; declaracao_autonoma_url: string }> => {
  try {
    const response = await api.post<{ message: string; data: { declaracao_autonoma_path: string; declaracao_autonoma_url: string } }>(
      '/reconhecimento-notario/gerar-declaracao-autonoma',
      params
    )
    return response.data.data
  } catch (error) {
    console.error('Erro ao gerar declaração autónoma:', error)
    throw error
  }
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
