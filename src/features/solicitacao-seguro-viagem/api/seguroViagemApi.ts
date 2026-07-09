import { api } from '@/services/api'
import { SolicitacaoSeguroViagemType, SolicitacaoSeguroViagemDescricaoType } from '../types'

export const createSolicitacaoSeguroViagem = async (formData: FormData): Promise<SolicitacaoSeguroViagemType> => {
  try {
    const response = await api.post<SolicitacaoSeguroViagemType>('/solicitacao-seguro-viagem', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  } catch (error) {
    console.error('Erro ao criar solicitação de seguro de viagem:', error)
    throw error
  }
}

export const getSolicitacaoSeguroViagemByClienteId = async (clienteId: string): Promise<SolicitacaoSeguroViagemType> => {
  try {
    const response = await api.get<SolicitacaoSeguroViagemType>(`/solicitacao-seguro-viagem/cliente/${clienteId}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar solicitação de seguro de viagem por cliente:', error)
    throw error
  }
}

export const getDescricaoAtivaSeguroViagem = async (): Promise<SolicitacaoSeguroViagemDescricaoType | null> => {
  try {
    const response = await api.get('/solicitacao-seguro-viagem-descricao')
    const body = response.data
    const descricoes = body?.data ?? body
    const arr = Array.isArray(descricoes) ? descricoes : []
    return arr[0] || null
  } catch (error) {
    console.error('Erro ao buscar descrição ativa:', error)
    return null
  }
}

export const getMotivoRejeicaoSeguroViagem = async (id: string): Promise<{ motivo_rejeicao: string }> => {
  try {
    const response = await api.get<{ motivo_rejeicao: string }>(`/solicitacao-seguro-viagem/${id}/motivo-rejeicao`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar motivo de rejeição:', error)
    throw error
  }
}
