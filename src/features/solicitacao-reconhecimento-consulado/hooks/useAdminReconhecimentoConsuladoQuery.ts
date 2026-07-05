import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllReconhecimentosConsulado,
  aprovarReconhecimentoConsulado,
  rejeitarReconhecimentoConsulado,
  GetAllReconhecimentosParams,
} from '../api/adminReconhecimentoConsuladoApi'

export const useGetAllReconhecimentosConsulado = (params?: GetAllReconhecimentosParams) => {
  return useQuery({
    queryKey: ['reconhecimentos-consulado', params],
    queryFn: () => getAllReconhecimentosConsulado(params),
    staleTime: 1000 * 60 * 5,
    networkMode: 'always',
  })
}

export const useAprovarReconhecimentoConsulado = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => aprovarReconhecimentoConsulado(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reconhecimentos-consulado'] })
    },
  })
}

export const useRejeitarReconhecimentoConsulado = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, motivo }: { id: string; motivo?: string }) => rejeitarReconhecimentoConsulado(id, motivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reconhecimentos-consulado'] })
    },
  })
}
