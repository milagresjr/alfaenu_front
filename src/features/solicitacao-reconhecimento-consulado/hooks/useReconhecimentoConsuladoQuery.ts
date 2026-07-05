import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createReconhecimentoConsulado,
  getReconhecimentoConsuladoByClienteId,
  getMotivoRejeicaoReconhecimentoConsulado,
} from '../api/reconhecimentoConsuladoApi'

export const useCreateReconhecimentoConsulado = () => {
  return useMutation({
    mutationFn: (formData: FormData) => createReconhecimentoConsulado(formData),
  })
}

export const useGetReconhecimentoConsuladoByClienteId = (clienteId: string) => {
  return useQuery({
    queryKey: ['reconhecimentoConsulado', clienteId],
    queryFn: () => getReconhecimentoConsuladoByClienteId(clienteId),
    enabled: !!clienteId,
  })
}

export const useGetMotivoRejeicaoReconhecimentoConsulado = (id: string) => {
  return useQuery({
    queryKey: ['motivoRejeicaoReconhecimento', id],
    queryFn: () => getMotivoRejeicaoReconhecimentoConsulado(id),
    enabled: !!id,
  })
}
