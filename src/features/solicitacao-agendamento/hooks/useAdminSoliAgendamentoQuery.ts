import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllSolicitacoesAgendamento,
  aprovarSolicitacaoAgendamento,
  rejeitarSolicitacaoAgendamento,
  enviarAgendamento,
  getDescricoes,
  createDescricao,
  updateDescricao,
  deleteDescricao,
  toggleDescricaoActive,
  GetAllSolicitacoesParams,
} from '../api/adminSoliAgendamentoApi'

export const useGetAllSolicitacoesAgendamento = (params?: GetAllSolicitacoesParams) => {
  return useQuery({
    queryKey: ['solicitacoes-agendamento', params],
    queryFn: () => getAllSolicitacoesAgendamento(params),
    staleTime: 1000 * 60 * 5,
    networkMode: 'always',
  })
}

export const useAprovarSolicitacaoAgendamento = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => aprovarSolicitacaoAgendamento(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-agendamento'] })
    },
  })
}

export const useRejeitarSolicitacaoAgendamento = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, motivo }: { id: string; motivo?: string }) => rejeitarSolicitacaoAgendamento(id, motivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-agendamento'] })
    },
  })
}

export const useEnviarAgendamento = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => enviarAgendamento(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-agendamento'] })
    },
  })
}

export const useGetDescricoes = () => {
  return useQuery({
    queryKey: ['descricoes-agendamento'],
    queryFn: () => getDescricoes(),
    staleTime: 1000 * 60 * 5,
  })
}

export const useCreateDescricao = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { descricao: string; status?: boolean }) => createDescricao(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['descricoes-agendamento'] })
    },
  })
}

export const useUpdateDescricao = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { descricao?: string; status?: boolean } }) => updateDescricao(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['descricoes-agendamento'] })
    },
  })
}

export const useDeleteDescricao = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteDescricao(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['descricoes-agendamento'] })
    },
  })
}

export const useToggleDescricaoActive = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => toggleDescricaoActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['descricoes-agendamento'] })
    },
  })
}
