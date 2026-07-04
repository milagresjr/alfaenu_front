import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllSolicitacoes, aprovarSolicitacao, rejeitarSolicitacao, enviarDeclaracao, baixarComprovativo, baixarCertificado, baixarPassaporte, GetAllSolicitacoesParams } from '../api/adminSoliMatriculaApi';

export const useGetAllSolicitacoes = (params?: GetAllSolicitacoesParams) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['solicitacoes-matricula', params],
    queryFn: () => getAllSolicitacoes(params),
    staleTime: 1000 * 60 * 5,
    networkMode: 'always',
  });

  return { data, isLoading, isError, refetch };
};

export const useAprovarSolicitacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aprovarSolicitacao(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-matricula'] });
    },
  });
};

export const useRejeitarSolicitacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, motivo }: { id: string; motivo?: string }) => rejeitarSolicitacao(id, motivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-matricula'] });
    },
  });
};

export const useEnviarDeclaracao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => enviarDeclaracao(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes-matricula'] });
    },
  });
};

export const useBaixarComprovativo = () => {
  return useMutation({
    mutationFn: (id: string) => baixarComprovativo(id),
  });
};

export const useBaixarCertificado = () => {
  return useMutation({
    mutationFn: (id: string) => baixarCertificado(id),
  });
};

export const useBaixarPassaporte = () => {
  return useMutation({
    mutationFn: (id: string) => baixarPassaporte(id),
  });
};
