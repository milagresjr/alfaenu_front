import { useQuery, useMutation } from '@tanstack/react-query'
import {
  createSolicitacaoReconhecimentoNotario,
  getSolicitacaoReconhecimentoNotarioByClienteId,
  gerarDeclaracaoAutonoma,
  getConfigReconhecimentoNotario,
} from '../api/reconhecimentoNotarioApi'

export const useCreateSolicitacaoReconhecimentoNotario = () => {
  return useMutation({
    mutationFn: (formData: FormData) => createSolicitacaoReconhecimentoNotario(formData),
  })
}

export const useGetSolicitacaoReconhecimentoNotarioByClienteId = (clienteId: string) => {
  return useQuery({
    queryKey: ['solicitacao-reconhecimento-notario', clienteId],
    queryFn: () => getSolicitacaoReconhecimentoNotarioByClienteId(clienteId),
    enabled: !!clienteId,
    staleTime: 1000 * 60 * 5,
    networkMode: 'always',
  })
}

export const useGerarDeclaracaoAutonoma = () => {
  return useMutation({
    mutationFn: (params: { cliente_id: number; financiador_id: number; estado_civil?: string; profissao?: string; rendimento_min?: number; rendimento_max?: number; parentesco?: string; parentesco_preposicao?: string }) =>
      gerarDeclaracaoAutonoma(params),
  })
}

export const useGetConfigReconhecimentoNotario = () => {
  return useQuery({
    queryKey: ['configReconhecimentoNotario'],
    queryFn: getConfigReconhecimentoNotario,
    staleTime: 1000 * 60 * 5,
    networkMode: 'always',
  })
}
