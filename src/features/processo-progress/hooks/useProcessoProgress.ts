import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProcessoProgressType } from "../types";
import { deleteProcessoProgress, getProcessoProgress, getProcessoProgressByClienteId, getProcessoProgressByUser, resetProgress, saveProcessoProgress, updateDataProcessoProgress } from "../api/processProgressApi";

export const useProcessoProgress = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["processo-progress"],
        queryFn: () => getProcessoProgress(),
        staleTime: 1000 * 60 * 5,
        networkMode: 'always',
        //keepPreviousData: true, 
    });

    return {
        data,
        isLoading,
        isError,
    };
};

export const useProcessoProgressByUser = (id: number | string) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["processo-progress", id],
        queryFn: () => getProcessoProgressByUser(id),
        staleTime: 1000 * 60 * 5,
        networkMode: 'always',
        //keepPreviousData: true, 
    });

    return {
        data,
        isLoading,
        isError,
    };
};

export const useSaveProcessoProgress = () => {
    const mutation = useMutation({
        mutationFn: (newProgress: ProcessoProgressType) => saveProcessoProgress(newProgress),
    });

    return mutation;
};


export const useUpdateProcessoProgress = () => {
    const mutation = useMutation({
        mutationFn: ({id, ...data}: ProcessoProgressType) => updateDataProcessoProgress(id, data),
    });

    return mutation;
};

export const useResetProgress = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number | undefined) => resetProgress(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["processo-progress"],
                exact: false,
            });
        },
    });

    return mutation;
}

// Obter o progresso de um processo específico
export const useGetProcessoProgressByClienteId = (clienteId: number) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["processo-progress", clienteId],
        queryFn: () => getProcessoProgressByClienteId(clienteId),
        staleTime: 1000 * 60 * 5,
        networkMode: 'always',
    });

    return {
        data,
        isLoading,
        isError,
    };
}

export const useDeleteProcessoProgress = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (idCliente: number | undefined) => deleteProcessoProgress(idCliente),
        onSuccess: (_data, clienteId) => {
            queryClient.invalidateQueries({
                queryKey: ["processo-progress"],
                exact: false,
            });
            if (clienteId) {
                queryClient.invalidateQueries({
                    queryKey: ["documentoProfundoStatus", clienteId],
                    exact: false,
                });
                queryClient.invalidateQueries({
                    queryKey: ["solicitacaoMatricula", clienteId],
                    exact: false,
                });
                queryClient.invalidateQueries({
                    queryKey: ["solicitacaoAgendamento", clienteId],
                    exact: false,
                });
                queryClient.invalidateQueries({
                    queryKey: ["solicitacaoPrintVoo", clienteId],
                    exact: false,
                });
                queryClient.invalidateQueries({
                    queryKey: ["solicitacaoReservaHotel", clienteId],
                    exact: false,
                });
                queryClient.invalidateQueries({
                    queryKey: ["solicitacaoSeguroViagem", clienteId],
                    exact: false,
                });
                queryClient.invalidateQueries({
                    queryKey: ["reconhecimentoRegistoCriminal", clienteId],
                    exact: false,
                });
                queryClient.invalidateQueries({
                    queryKey: ["solicitacao-reconhecimento-notario", clienteId],
                    exact: false,
                });
                queryClient.invalidateQueries({
                    queryKey: ["reconhecimentoConsulado", clienteId],
                    exact: false,
                });
            }
        },
    });

    return mutation;
}