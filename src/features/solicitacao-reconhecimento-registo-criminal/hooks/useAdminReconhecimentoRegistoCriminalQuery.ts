import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllSolicitacoesReconhecimentoRegistoCriminal,
  aprovarSolicitacaoReconhecimentoRegistoCriminal,
  getConfigReconhecimentoCriminal,
  updateConfigReconhecimentoCriminal,
  GetAllSolicitacoesParams,
} from '../api/adminReconhecimentoRegistoCriminalApi'

export const useGetAllSolicitacoesReconhecimentoRegistoCriminal = (params?: GetAllSolicitacoesParams) => {
  return useQuery({
    queryKey: ['solicitacoes-reconhecimento-registo-criminal', params],
    queryFn: () => getAllSolicitacoesReconhecimentoRegistoCriminal(params),
    staleTime: 1000 * 60 * 5,
    networkMode: 'always',
  })
}

export const useAprovarSolicitacaoReconhecimentoRegistoCriminal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => aprovarSolicitacaoReconhecimentoRegistoCriminal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-reconhecimento-registo-criminal'] })
    },
  })
}

export const useGetConfigReconhecimentoCriminal = () => {
  return useQuery({
    queryKey: ['configReconhecimentoCriminal'],
    queryFn: getConfigReconhecimentoCriminal,
    staleTime: 1000 * 60 * 5,
    networkMode: 'always',
  })
}

export const useUpdateConfigReconhecimentoCriminal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { preco_base: number; taxa_domicilio: number; endereco_agencia: string }) => updateConfigReconhecimentoCriminal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configReconhecimentoCriminal'] })
    },
  })
}
