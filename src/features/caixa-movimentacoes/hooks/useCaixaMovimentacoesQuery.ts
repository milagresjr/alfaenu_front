import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CaixaMovimentacoesType } from "../types";
import { createCaixaMovimentacoes, deleteCaixaMovimentacoes, getAllCaixaMovimentacoes, updateCaixaMovimentacoes } from "../api/caixaMovimentacoesApi";

export const useCaixaMovimentacoes = (page = 1, per_page = 15, search = '') => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["caixa-movimentacoes", per_page, page, search],
        queryFn: () => getAllCaixaMovimentacoes(per_page, page, search),
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

export const useCreateCaixaMovimentacoes = () => {
    const mutation = useMutation({
        mutationFn: (caixa: CaixaMovimentacoesType) => createCaixaMovimentacoes(caixa),
    });
    return mutation;
};

export const useUpdateCaixaMovimentacoes = () => {
    const mutation = useMutation({
        mutationFn: ({ id, ...data }: CaixaMovimentacoesType) => updateCaixaMovimentacoes(id, data),
    });

    return mutation;
};

export const useDeleteCaixaMovimentacoes = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number | undefined) => deleteCaixaMovimentacoes(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["caixa-movimentacoes"],
                exact: false,
            });
        },
    });

    return mutation;
}