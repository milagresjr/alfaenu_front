import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllSolicitacoesPrintVoo,
  aprovarSolicitacaoPrintVoo,
  rejeitarSolicitacaoPrintVoo,
  enviarDocumentoPrintVoo,
  getDescricoesPrintVoo,
  createDescricaoPrintVoo,
  updateDescricaoPrintVoo,
  deleteDescricaoPrintVoo,
  toggleDescricaoPrintVooActive,
  GetAllSolicitacoesParams,
} from '../api/adminPrintVooApi'

export const useGetAllSolicitacoesPrintVoo = (params?: GetAllSolicitacoesParams) => {
  return useQuery({
    queryKey: ['solicitacoes-print-voo', params],
    queryFn: () => getAllSolicitacoesPrintVoo(params),
    staleTime: 1000 * 60 * 5,
    networkMode: 'always',
  })
}

export const useAprovarSolicitacaoPrintVoo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => aprovarSolicitacaoPrintVoo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-print-voo'] })
    },
  })
}

export const useRejeitarSolicitacaoPrintVoo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, motivo }: { id: string; motivo?: string }) => rejeitarSolicitacaoPrintVoo(id, motivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-print-voo'] })
    },
  })
}

export const useEnviarDocumentoPrintVoo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => enviarDocumentoPrintVoo(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-print-voo'] })
    },
  })
}

export const useGetDescricoesPrintVoo = () => {
  return useQuery({
    queryKey: ['descricoes-print-voo'],
    queryFn: () => getDescricoesPrintVoo(),
    staleTime: 1000 * 60 * 5,
  })
}

export const useCreateDescricaoPrintVoo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { descricao: string; status?: boolean }) => createDescricaoPrintVoo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['descricoes-print-voo'] })
    },
  })
}

export const useUpdateDescricaoPrintVoo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { descricao?: string; status?: boolean } }) => updateDescricaoPrintVoo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['descricoes-print-voo'] })
    },
  })
}

export const useDeleteDescricaoPrintVoo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteDescricaoPrintVoo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['descricoes-print-voo'] })
    },
  })
}

export const useToggleDescricaoPrintVooActive = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => toggleDescricaoPrintVooActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['descricoes-print-voo'] })
    },
  })
}
