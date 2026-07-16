import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createSolicitacaoAgendamento,
  createAgendamentoExterno,
  getSolicitacaoAgendamentoByClienteId,
  getSolicitacaoAgendamentoById,
  getMotivoRejeicaoAgendamento,
  downloadAgendamentoPdf,
  getDescricaoAtiva,
} from '../api/soliAgendamentoApi'

export const useCreateSolicitacaoAgendamento = () => {
  return useMutation({
    mutationFn: (formData: FormData) => createSolicitacaoAgendamento(formData),
  })
}

export const useCreateAgendamentoExterno = () => {
  return useMutation({
    mutationFn: (formData: FormData) => createAgendamentoExterno(formData),
  })
}

export const useGetSolicitacaoAgendamentoByClienteId = (clienteId: string) => {
  return useQuery({
    queryKey: ['solicitacaoAgendamento', clienteId],
    queryFn: () => getSolicitacaoAgendamentoByClienteId(clienteId),
    enabled: !!clienteId,
  })
}

export const useGetSolicitacaoAgendamentoById = (id: string) => {
  return useQuery({
    queryKey: ['solicitacaoAgendamento', id],
    queryFn: () => getSolicitacaoAgendamentoById(id),
    enabled: !!id,
  })
}

export const useGetMotivoRejeicaoAgendamento = (id: string) => {
  return useQuery({
    queryKey: ['motivoRejeicaoAgendamento', id],
    queryFn: () => getMotivoRejeicaoAgendamento(id),
    enabled: !!id,
  })
}

export const useDownloadAgendamentoPdf = () => {
  return useMutation({
    mutationFn: (id: string) => downloadAgendamentoPdf(id),
  })
}

export const useGetDescricaoAtiva = (tipo?: string) => {
  return useQuery({
    queryKey: ['descricaoAgendamentoAtiva', tipo],
    queryFn: () => getDescricaoAtiva(tipo),
    staleTime: 1000 * 60 * 10,
  })
}
