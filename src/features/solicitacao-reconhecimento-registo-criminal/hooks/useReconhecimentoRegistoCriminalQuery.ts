import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createSolicitacaoReconhecimentoRegistoCriminal,
  getSolicitacaoReconhecimentoRegistoCriminalByClienteId,
  getMotivoRejeicaoReconhecimentoRegistoCriminal,
  getConfigReconhecimentoCriminal,
} from '../api/reconhecimentoRegistoCriminalApi'

export const useCreateSolicitacaoReconhecimentoRegistoCriminal = () => {
  return useMutation({
    mutationFn: (formData: FormData) => createSolicitacaoReconhecimentoRegistoCriminal(formData),
  })
}

export const useGetSolicitacaoReconhecimentoRegistoCriminalByClienteId = (clienteId: string) => {
  return useQuery({
    queryKey: ['reconhecimentoRegistoCriminal', clienteId],
    queryFn: () => getSolicitacaoReconhecimentoRegistoCriminalByClienteId(clienteId),
    enabled: !!clienteId,
  })
}

export const useGetMotivoRejeicaoReconhecimentoRegistoCriminal = (id: string) => {
  return useQuery({
    queryKey: ['motivoRejeicaoReconhecimentoRegistoCriminal', id],
    queryFn: () => getMotivoRejeicaoReconhecimentoRegistoCriminal(id),
    enabled: !!id,
  })
}

export const useGetConfigReconhecimentoCriminal = () => {
  return useQuery({
    queryKey: ['configReconhecimentoCriminal'],
    queryFn: () => getConfigReconhecimentoCriminal(),
    staleTime: 1000 * 60 * 10,
  })
}
