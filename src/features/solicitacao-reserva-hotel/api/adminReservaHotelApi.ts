import { api } from '@/services/api'
import { PaginatedSolicitacaoReservaHotel, SolicitacaoReservaHotelType, SolicitacaoReservaHotelDescricaoType } from '../types'

export interface GetAllSolicitacoesParams {
  search?: string
  status?: string
  page?: number
  per_page?: number
}

export const getAllSolicitacoesReservaHotel = async (params?: GetAllSolicitacoesParams): Promise<PaginatedSolicitacaoReservaHotel> => {
  try {
    const response = await api.get<PaginatedSolicitacaoReservaHotel>('/solicitacao-reserva-hotel', { params })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar solicitações de reserva de hotel:', error)
    throw error
  }
}

export const aprovarSolicitacaoReservaHotel = async (id: string): Promise<{ message: string; data: SolicitacaoReservaHotelType }> => {
  try {
    const response = await api.post<{ message: string; data: SolicitacaoReservaHotelType }>(`/solicitacao-reserva-hotel/${id}/aprovar`)
    return response.data
  } catch (error) {
    console.error('Erro ao aprovar solicitação:', error)
    throw error
  }
}

export const rejeitarSolicitacaoReservaHotel = async (id: string, motivo_rejeicao?: string): Promise<{ message: string; data: SolicitacaoReservaHotelType }> => {
  try {
    const response = await api.post<{ message: string; data: SolicitacaoReservaHotelType }>(`/solicitacao-reserva-hotel/${id}/rejeitar`, { motivo_rejeicao })
    return response.data
  } catch (error) {
    console.error('Erro ao rejeitar solicitação:', error)
    throw error
  }
}

export const enviarDocumentoReservaHotel = async (id: string, formData: FormData): Promise<{ message: string; data: SolicitacaoReservaHotelType }> => {
  try {
    const response = await api.post<{ message: string; data: SolicitacaoReservaHotelType }>(
      `/solicitacao-reserva-hotel/${id}/enviar-documento`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response.data
  } catch (error) {
    console.error('Erro ao enviar documento:', error)
    throw error
  }
}

export const getDescricoesReservaHotel = async (): Promise<SolicitacaoReservaHotelDescricaoType[]> => {
  try {
    const response = await api.get<{ data: SolicitacaoReservaHotelDescricaoType[] }>('/solicitacao-reserva-hotel-descricao')
    return response.data.data
  } catch (error) {
    console.error('Erro ao buscar descrições:', error)
    throw error
  }
}

export const createDescricaoReservaHotel = async (data: { descricao: string; status?: boolean }): Promise<SolicitacaoReservaHotelDescricaoType> => {
  try {
    const response = await api.post<{ data: SolicitacaoReservaHotelDescricaoType }>('/solicitacao-reserva-hotel-descricao', data)
    return response.data.data
  } catch (error) {
    console.error('Erro ao criar descrição:', error)
    throw error
  }
}

export const updateDescricaoReservaHotel = async (id: string, data: { descricao?: string; status?: boolean }): Promise<SolicitacaoReservaHotelDescricaoType> => {
  try {
    const response = await api.put<{ data: SolicitacaoReservaHotelDescricaoType }>(`/solicitacao-reserva-hotel-descricao/${id}`, data)
    return response.data.data
  } catch (error) {
    console.error('Erro ao atualizar descrição:', error)
    throw error
  }
}

export const deleteDescricaoReservaHotel = async (id: string): Promise<void> => {
  try {
    await api.delete(`/solicitacao-reserva-hotel-descricao/${id}`)
  } catch (error) {
    console.error('Erro ao excluir descrição:', error)
    throw error
  }
}

export const toggleDescricaoReservaHotelActive = async (id: string): Promise<SolicitacaoReservaHotelDescricaoType> => {
  try {
    const response = await api.patch<{ data: SolicitacaoReservaHotelDescricaoType }>(`/solicitacao-reserva-hotel-descricao/${id}/toggle-active`)
    return response.data.data
  } catch (error) {
    console.error('Erro ao alternar status da descrição:', error)
    throw error
  }
}
