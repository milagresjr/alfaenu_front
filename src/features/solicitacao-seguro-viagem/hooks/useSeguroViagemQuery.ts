import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createSolicitacaoSeguroViagem,
  getSolicitacaoSeguroViagemByClienteId,
  getMotivoRejeicaoSeguroViagem,
  getDescricaoAtivaSeguroViagem,
} from '../api/seguroViagemApi'

export const useCreateSolicitacaoSeguroViagem = () => {
  return useMutation({
    mutationFn: (formData: FormData) => createSolicitacaoSeguroViagem(formData),
  })
}

export const useGetSolicitacaoSeguroViagemByClienteId = (clienteId: string) => {
  return useQuery({
    queryKey: ['solicitacaoSeguroViagem', clienteId],
    queryFn: () => getSolicitacaoSeguroViagemByClienteId(clienteId),
    enabled: !!clienteId,
  })
}

export const useGetMotivoRejeicaoSeguroViagem = (id: string) => {
  return useQuery({
    queryKey: ['motivoRejeicaoSeguroViagem', id],
    queryFn: () => getMotivoRejeicaoSeguroViagem(id),
    enabled: !!id,
  })
}

export const useGetDescricaoAtivaSeguroViagem = () => {
  return useQuery({
    queryKey: ['descricaoSeguroViagemAtiva'],
    queryFn: () => getDescricaoAtivaSeguroViagem(),
    staleTime: 1000 * 60 * 10,
  })
}
