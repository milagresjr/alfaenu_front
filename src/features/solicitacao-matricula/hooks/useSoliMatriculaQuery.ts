import { useMutation, useQuery } from "@tanstack/react-query";
import { createSolicitacaoMatricula, getSolicitacaoMatriculaByClienteId, getSolicitacaoMatriculaById } from "../api/soliMatriculaApi";



export const useCreateSolicitacaoMatricula = () => {
    const mutation = useMutation({
        mutationFn: (newSolicitacao: FormData) => createSolicitacaoMatricula(newSolicitacao),
    });

    return mutation;
};

export const useGetSolicitacaoMatriculaByClienteId = (clienteId: string) => {
    const { data, isError, isLoading } = useQuery({
        queryKey: ['solicitacaoMatricula', clienteId],
        queryFn: () => getSolicitacaoMatriculaByClienteId(clienteId),
        enabled: !!clienteId, // A consulta só será executada se clienteId for válido
    });

    return { data, isError, isLoading };
};

export const useGetSolicitacaoMatriculaById = (id: string) => {
    const { data, isError, isLoading } = useQuery({
        queryKey: ['solicitacaoMatricula', id],
        queryFn: () => getSolicitacaoMatriculaById(id),
        enabled: !!id, // A consulta só será executada se id for válido
    });

    return { data, isError, isLoading };
};