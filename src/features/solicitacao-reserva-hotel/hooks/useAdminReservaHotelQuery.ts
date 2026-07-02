import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllSolicitacoesReservaHotel,
  aprovarSolicitacaoReservaHotel,
  rejeitarSolicitacaoReservaHotel,
  enviarDocumentoReservaHotel,
  getDescricoesReservaHotel,
  createDescricaoReservaHotel,
  updateDescricaoReservaHotel,
  deleteDescricaoReservaHotel,
  toggleDescricaoReservaHotelActive,
  GetAllSolicitacoesParams,
} from '../api/adminReservaHotelApi'

export const useGetAllSolicitacoesReservaHotel = (params?: GetAllSolicitacoesParams) => {
  return useQuery({
    queryKey: ['solicitacoes-reserva-hotel', params],
    queryFn: () => getAllSolicitacoesReservaHotel(params),
    staleTime: 1000 * 60 * 5,
    networkMode: 'always',
  })
}

export const useAprovarSolicitacaoReservaHotel = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => aprovarSolicitacaoReservaHotel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-reserva-hotel'] })
    },
  })
}

export const useRejeitarSolicitacaoReservaHotel = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, motivo }: { id: string; motivo?: string }) => rejeitarSolicitacaoReservaHotel(id, motivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-reserva-hotel'] })
    },
  })
}

export const useEnviarDocumentoReservaHotel = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => enviarDocumentoReservaHotel(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-reserva-hotel'] })
    },
  })
}

export const useGetDescricoesReservaHotel = () => {
  return useQuery({
    queryKey: ['descricoes-reserva-hotel'],
    queryFn: () => getDescricoesReservaHotel(),
    staleTime: 1000 * 60 * 5,
  })
}

export const useCreateDescricaoReservaHotel = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { descricao: string; status?: boolean }) => createDescricaoReservaHotel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['descricoes-reserva-hotel'] })
    },
  })
}

export const useUpdateDescricaoReservaHotel = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { descricao?: string; status?: boolean } }) => updateDescricaoReservaHotel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['descricoes-reserva-hotel'] })
    },
  })
}

export const useDeleteDescricaoReservaHotel = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteDescricaoReservaHotel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['descricoes-reserva-hotel'] })
    },
  })
}

export const useToggleDescricaoReservaHotelActive = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => toggleDescricaoReservaHotelActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['descricoes-reserva-hotel'] })
    },
  })
}
