import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDocumentoProfundoStatus, getDocumentoProfundoStatus, getDocumentoProfundoStatusByClienteId, updateDocumentoProfundoStatus } from "../api/documentoProfundoApi";
import { uploadDeclaracaoServico, getDeclaracoesServico } from "../api/declaracaoServicoApi";

export const useGetDocumentoProfundoStatus = () => {
    const { data, isError, isLoading } = useQuery({
        queryKey: ['documentoProfundoStatus'],
        queryFn: () => getDocumentoProfundoStatus(),
        enabled: true, // A consulta só será executada se clienteId for válido
    });

    return { data, isError, isLoading };
};

//useGetDocumentoProfundoStatusByClienteId
export const useGetDocumentoProfundoStatusByClienteId = (clienteId: string) => {
    const { data, isError, isLoading, refetch } = useQuery({
        queryKey: ['documentoProfundoStatus', clienteId],
        queryFn: () => getDocumentoProfundoStatusByClienteId(clienteId),
        enabled: !!clienteId, // A consulta só será executada se clienteId for válido
    });

    return { data, isError, isLoading, refetch };
}

//Criar
export const useCreateDocumentoProfundoStatus = () => {
    const mutation = useMutation({
        mutationFn: (status: any) => createDocumentoProfundoStatus(status),
    });

    return mutation;
};

export const useUploadDeclaracaoServico = () => {
  return useMutation({
    mutationFn: (params: { clienteId: string; file: File }) => uploadDeclaracaoServico(params.clienteId, params.file),
  })
}

export const useGetDeclaracoesServico = (page: number, per_page: number) => {
  return useQuery({
    queryKey: ['declaracoes-servico', page, per_page],
    queryFn: () => getDeclaracoesServico(page, per_page),
    staleTime: 1000 * 60 * 5,
    networkMode: 'always',
  })
}

export const useUpdateDocumentoProfundoStatus = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (params: {clienteId: string, newSolicitacao: any}) => updateDocumentoProfundoStatus(params.clienteId, params.newSolicitacao),
        onSuccess: (_, params) => {
            queryClient.invalidateQueries({
                queryKey: ['documentoProfundoStatus', params.clienteId]
            });
        },
    });

    return mutation;
};
