import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createSolicitacaoPrintVoo,
  getSolicitacaoPrintVooByClienteId,
  getSolicitacaoPrintVooById,
  getMotivoRejeicaoPrintVoo,
  getDescricaoAtivaPrintVoo,
} from '../api/printVooApi'

export const useCreateSolicitacaoPrintVoo = () => {
  return useMutation({
    mutationFn: (formData: FormData) => createSolicitacaoPrintVoo(formData),
  })
}

export const useGetSolicitacaoPrintVooByClienteId = (clienteId: string) => {
  return useQuery({
    queryKey: ['solicitacaoPrintVoo', clienteId],
    queryFn: () => getSolicitacaoPrintVooByClienteId(clienteId),
    enabled: !!clienteId,
  })
}

export const useGetSolicitacaoPrintVooById = (id: string) => {
  return useQuery({
    queryKey: ['solicitacaoPrintVoo', id],
    queryFn: () => getSolicitacaoPrintVooById(id),
    enabled: !!id,
  })
}

export const useGetMotivoRejeicaoPrintVoo = (id: string) => {
  return useQuery({
    queryKey: ['motivoRejeicaoPrintVoo', id],
    queryFn: () => getMotivoRejeicaoPrintVoo(id),
    enabled: !!id,
  })
}

export const useGetDescricaoAtivaPrintVoo = () => {
  return useQuery({
    queryKey: ['descricaoPrintVooAtiva'],
    queryFn: () => getDescricaoAtivaPrintVoo(),
    staleTime: 1000 * 60 * 10,
  })
}
