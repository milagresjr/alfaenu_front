import { useMutation, useQuery } from "@tanstack/react-query";
import { createDocumentoProfundoStatus, getDocumentoProfundoStatus, getDocumentoProfundoStatusByClienteId, updateDocumentoProfundoStatus } from "../api/documentoProfundoApi";

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

export const useUpdateDocumentoProfundoStatus = () => {
    const mutation = useMutation({
        mutationFn: (params: {clienteId: string, newSolicitacao: any}) => updateDocumentoProfundoStatus(params.clienteId, params.newSolicitacao),
    });

    return mutation;
};
