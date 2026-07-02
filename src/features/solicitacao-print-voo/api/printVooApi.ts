import { api } from '@/services/api'
import { SolicitacaoPrintVooType, SolicitacaoPrintVooDescricaoType } from '../types'

export const createSolicitacaoPrintVoo = async (formData: FormData): Promise<SolicitacaoPrintVooType> => {
  try {
    const response = await api.post<SolicitacaoPrintVooType>('/solicitacao-print-voo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  } catch (error) {
    console.error('Erro ao criar solicitação de print de voo:', error)
    throw error
  }
}

export const getSolicitacaoPrintVooByClienteId = async (clienteId: string): Promise<SolicitacaoPrintVooType> => {
  try {
    const response = await api.get<SolicitacaoPrintVooType>(`/solicitacao-print-voo/cliente/${clienteId}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar solicitação de print de voo por cliente:', error)
    throw error
  }
}

export const getSolicitacaoPrintVooById = async (id: string): Promise<SolicitacaoPrintVooType> => {
  try {
    const response = await api.get<SolicitacaoPrintVooType>(`/solicitacao-print-voo/${id}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar solicitação de print de voo por ID:', error)
    throw error
  }
}

export const getMotivoRejeicaoPrintVoo = async (id: string): Promise<{ motivo_rejeicao: string }> => {
  try {
    const response = await api.get<{ motivo_rejeicao: string }>(`/solicitacao-print-voo/${id}/motivo-rejeicao`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar motivo de rejeição:', error)
    throw error
  }
}

export const getDescricaoAtivaPrintVoo = async (): Promise<SolicitacaoPrintVooDescricaoType | null> => {
  try {
    const response = await api.get('/solicitacao-print-voo-descricao')
    const body = response.data
    const descricoes = body?.data ?? body
    const arr = Array.isArray(descricoes) ? descricoes : []
    return arr[0] || null
  } catch (error) {
    console.error('Erro ao buscar descrição ativa:', error)
    return null
  }
}
