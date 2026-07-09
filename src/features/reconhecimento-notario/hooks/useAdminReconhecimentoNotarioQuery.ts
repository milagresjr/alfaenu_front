import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllSolicitacoesReconhecimentoNotario,
  aprovarSolicitacaoReconhecimentoNotario,
  getConfigReconhecimentoNotario,
  updateConfigReconhecimentoNotario,
  GetAllSolicitacoesParams,
} from '../api/adminReconhecimentoNotarioApi'

export const useGetAllSolicitacoesReconhecimentoNotario = (params?: GetAllSolicitacoesParams) => {
  return useQuery({
    queryKey: ['solicitacoes-reconhecimento-notario', params],
    queryFn: () => getAllSolicitacoesReconhecimentoNotario(params),
    staleTime: 1000 * 60 * 5,
    networkMode: 'always',
  })
}

export const useAprovarSolicitacaoReconhecimentoNotario = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => aprovarSolicitacaoReconhecimentoNotario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-reconhecimento-notario'] })
    },
  })
}

export const useGetConfigReconhecimentoNotario = () => {
  return useQuery({
    queryKey: ['configReconhecimentoNotarioAdmin'],
    queryFn: getConfigReconhecimentoNotario,
    staleTime: 1000 * 60 * 5,
    networkMode: 'always',
  })
}

export const useUpdateConfigReconhecimentoNotario = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { preco_base: number; taxa_domicilio: number; endereco_agencia: string }) => updateConfigReconhecimentoNotario(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configReconhecimentoNotarioAdmin'] })
    },
  })
}
