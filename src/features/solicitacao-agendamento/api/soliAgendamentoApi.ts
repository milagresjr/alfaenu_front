import { api } from '@/services/api'
import { SolicitacaoAgendamentoType, SolicitacaoAgendamentoDescricaoType } from '../types'

export const createSolicitacaoAgendamento = async (formData: FormData): Promise<SolicitacaoAgendamentoType> => {
  try {
    const response = await api.post<SolicitacaoAgendamentoType>('/solicitacao-agendamento', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  } catch (error) {
    console.error('Erro ao criar solicitação de agendamento:', error)
    throw error
  }
}

export const getSolicitacaoAgendamentoByClienteId = async (clienteId: string): Promise<SolicitacaoAgendamentoType> => {
  try {
    const response = await api.get<SolicitacaoAgendamentoType>(`/solicitacao-agendamento/cliente/${clienteId}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar solicitação de agendamento por cliente:', error)
    throw error
  }
}

export const getSolicitacaoAgendamentoById = async (id: string): Promise<SolicitacaoAgendamentoType> => {
  try {
    const response = await api.get<SolicitacaoAgendamentoType>(`/solicitacao-agendamento/${id}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar solicitação de agendamento por ID:', error)
    throw error
  }
}

export const getMotivoRejeicaoAgendamento = async (id: string): Promise<{ motivo_rejeicao: string }> => {
  try {
    const response = await api.get<{ motivo_rejeicao: string }>(`/solicitacao-agendamento/${id}/motivo-rejeicao`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar motivo de rejeição:', error)
    throw error
  }
}

export const downloadAgendamentoPdf = async (id: string): Promise<Blob> => {
  try {
    const response = await api.get(`/solicitacao-agendamento/${id}/agendamento/download`, {
      responseType: 'blob',
    })
    return response.data
  } catch (error) {
    console.error('Erro ao baixar PDF do agendamento:', error)
    throw error
  }
}

export const getDescricaoAtiva = async (): Promise<SolicitacaoAgendamentoDescricaoType | null> => {
  try {
    const response = await api.get('/solicitacao-agendamento-descricao')
    const body = response.data
    const descricoes = body?.data ?? body
    const arr = Array.isArray(descricoes) ? descricoes : []
    return arr[0] || null
  } catch (error) {
    console.error('Erro ao buscar descrição ativa:', error)
    return null
  }
}

export const createAgendamentoExterno = async (formData: FormData): Promise<SolicitacaoAgendamentoType> => {
  try {
    const response = await api.post<SolicitacaoAgendamentoType>('/solicitacao-agendamento/agendamento-externo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  } catch (error) {
    console.error('Erro ao criar agendamento externo:', error)
    throw error
  }
}
