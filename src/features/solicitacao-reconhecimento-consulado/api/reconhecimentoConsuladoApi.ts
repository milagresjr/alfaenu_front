import { api } from '@/services/api'
import { ReconhecimentoConsuladoType } from '../types'

export const createReconhecimentoConsulado = async (formData: FormData): Promise<ReconhecimentoConsuladoType> => {
  try {
    const response = await api.post<ReconhecimentoConsuladoType>('/reconhecimento-termo-consulado', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  } catch (error) {
    console.error('Erro ao criar reconhecimento de termo no consulado:', error)
    throw error
  }
}

export const getReconhecimentoConsuladoByClienteId = async (clienteId: string): Promise<ReconhecimentoConsuladoType> => {
  try {
    const response = await api.get<ReconhecimentoConsuladoType>(`/reconhecimento-termo-consulado/cliente/${clienteId}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar reconhecimento de termo por cliente:', error)
    throw error
  }
}

export const getMotivoRejeicaoReconhecimentoConsulado = async (id: string): Promise<{ motivo_rejeicao: string }> => {
  try {
    const response = await api.get<{ motivo_rejeicao: string }>(`/reconhecimento-termo-consulado/${id}/motivo-rejeicao`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar motivo de rejeição:', error)
    throw error
  }
}
