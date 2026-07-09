import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllSolicitacoesSeguroViagem,
  aprovarSolicitacaoSeguroViagem,
  rejeitarSolicitacaoSeguroViagem,
  enviarDocumentoSeguroViagem,
  getDescricoesSeguroViagem,
  createDescricaoSeguroViagem,
  updateDescricaoSeguroViagem,
  deleteDescricaoSeguroViagem,
  toggleDescricaoSeguroViagemActive,
  GetAllSolicitacoesParams,
} from '../api/adminSeguroViagemApi'

export const useGetAllSolicitacoesSeguroViagem = (params?: GetAllSolicitacoesParams) => {
  return useQuery({
    queryKey: ['solicitacoes-seguro-viagem', params],
    queryFn: () => getAllSolicitacoesSeguroViagem(params),
    staleTime: 1000 * 60 * 5,
    networkMode: 'always',
  })
}

export const useAprovarSolicitacaoSeguroViagem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => aprovarSolicitacaoSeguroViagem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-seguro-viagem'] })
    },
  })
}

export const useRejeitarSolicitacaoSeguroViagem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, motivo }: { id: number; motivo?: string }) => rejeitarSolicitacaoSeguroViagem(id, motivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-seguro-viagem'] })
    },
  })
}

export const useEnviarDocumentoSeguroViagem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => enviarDocumentoSeguroViagem(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-seguro-viagem'] })
    },
  })
}

export const useGetDescricoesSeguroViagem = () => {
  return useQuery({
    queryKey: ['descricoes-seguro-viagem'],
    queryFn: () => getDescricoesSeguroViagem(),
    staleTime: 1000 * 60 * 5,
  })
}

export const useCreateDescricaoSeguroViagem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { descricao: string; status?: boolean }) => createDescricaoSeguroViagem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['descricoes-seguro-viagem'] })
    },
  })
}

export const useUpdateDescricaoSeguroViagem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { descricao?: string; status?: boolean } }) => updateDescricaoSeguroViagem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['descricoes-seguro-viagem'] })
    },
  })
}

export const useDeleteDescricaoSeguroViagem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteDescricaoSeguroViagem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['descricoes-seguro-viagem'] })
    },
  })
}

export const useToggleDescricaoSeguroViagemActive = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => toggleDescricaoSeguroViagemActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['descricoes-seguro-viagem'] })
    },
  })
}
