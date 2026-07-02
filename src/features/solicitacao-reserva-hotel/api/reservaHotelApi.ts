import { api } from '@/services/api'
import { SolicitacaoReservaHotelType, SolicitacaoReservaHotelDescricaoType } from '../types'

export const createSolicitacaoReservaHotel = async (formData: FormData): Promise<SolicitacaoReservaHotelType> => {
  try {
    const response = await api.post<SolicitacaoReservaHotelType>('/solicitacao-reserva-hotel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  } catch (error) {
    console.error('Erro ao criar solicitação de reserva de hotel:', error)
    throw error
  }
}

export const getSolicitacaoReservaHotelByClienteId = async (clienteId: string): Promise<SolicitacaoReservaHotelType> => {
  try {
    const response = await api.get<SolicitacaoReservaHotelType>(`/solicitacao-reserva-hotel/cliente/${clienteId}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar solicitação de reserva de hotel por cliente:', error)
    throw error
  }
}

export const getSolicitacaoReservaHotelById = async (id: string): Promise<SolicitacaoReservaHotelType> => {
  try {
    const response = await api.get<SolicitacaoReservaHotelType>(`/solicitacao-reserva-hotel/${id}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar solicitação de reserva de hotel por ID:', error)
    throw error
  }
}

export const getMotivoRejeicaoReservaHotel = async (id: string): Promise<{ motivo_rejeicao: string }> => {
  try {
    const response = await api.get<{ motivo_rejeicao: string }>(`/solicitacao-reserva-hotel/${id}/motivo-rejeicao`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar motivo de rejeição:', error)
    throw error
  }
}

export const getDescricaoAtivaReservaHotel = async (): Promise<SolicitacaoReservaHotelDescricaoType | null> => {
  try {
    const response = await api.get('/solicitacao-reserva-hotel-descricao')
    const body = response.data
    const descricoes = body?.data ?? body
    const arr = Array.isArray(descricoes) ? descricoes : []
    return arr[0] || null
  } catch (error) {
    console.error('Erro ao buscar descrição ativa:', error)
    return null
  }
}
