import { api } from '@/services/api'
import { PaginatedReconhecimentoConsulado, ReconhecimentoConsuladoType } from '../types'

export interface GetAllReconhecimentosParams {
  search?: string
  status?: string
  page?: number
  per_page?: number
}

export const getAllReconhecimentosConsulado = async (params?: GetAllReconhecimentosParams): Promise<PaginatedReconhecimentoConsulado> => {
  try {
    const response = await api.get<PaginatedReconhecimentoConsulado>('/reconhecimento-termo-consulado', { params })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar reconhecimentos de termo:', error)
    throw error
  }
}

export const aprovarReconhecimentoConsulado = async (id: string): Promise<{ message: string; data: ReconhecimentoConsuladoType }> => {
  try {
    const response = await api.post<{ message: string; data: ReconhecimentoConsuladoType }>(`/reconhecimento-termo-consulado/${id}/aprovar`)
    return response.data
  } catch (error) {
    console.error('Erro ao aprovar reconhecimento:', error)
    throw error
  }
}

export const rejeitarReconhecimentoConsulado = async (id: string, motivo_rejeicao?: string): Promise<{ message: string; data: ReconhecimentoConsuladoType }> => {
  try {
    const response = await api.post<{ message: string; data: ReconhecimentoConsuladoType }>(`/reconhecimento-termo-consulado/${id}/rejeitar`, { motivo_rejeicao })
    return response.data
  } catch (error) {
    console.error('Erro ao rejeitar reconhecimento:', error)
    throw error
  }
}


