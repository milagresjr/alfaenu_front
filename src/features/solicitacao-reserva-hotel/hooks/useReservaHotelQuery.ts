import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createSolicitacaoReservaHotel,
  getSolicitacaoReservaHotelByClienteId,
  getSolicitacaoReservaHotelById,
  getMotivoRejeicaoReservaHotel,
  getDescricaoAtivaReservaHotel,
} from '../api/reservaHotelApi'

export const useCreateSolicitacaoReservaHotel = () => {
  return useMutation({
    mutationFn: (formData: FormData) => createSolicitacaoReservaHotel(formData),
  })
}

export const useGetSolicitacaoReservaHotelByClienteId = (clienteId: string) => {
  return useQuery({
    queryKey: ['solicitacaoReservaHotel', clienteId],
    queryFn: () => getSolicitacaoReservaHotelByClienteId(clienteId),
    enabled: !!clienteId,
  })
}

export const useGetSolicitacaoReservaHotelById = (id: string) => {
  return useQuery({
    queryKey: ['solicitacaoReservaHotel', id],
    queryFn: () => getSolicitacaoReservaHotelById(id),
    enabled: !!id,
  })
}

export const useGetMotivoRejeicaoReservaHotel = (id: string) => {
  return useQuery({
    queryKey: ['motivoRejeicaoReservaHotel', id],
    queryFn: () => getMotivoRejeicaoReservaHotel(id),
    enabled: !!id,
  })
}

export const useGetDescricaoAtivaReservaHotel = () => {
  return useQuery({
    queryKey: ['descricaoReservaHotelAtiva'],
    queryFn: () => getDescricaoAtivaReservaHotel(),
    staleTime: 1000 * 60 * 10,
  })
}
