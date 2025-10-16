import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { abrirCaixa, createCaixa, deleteCaixa, fecharCaixa, getAllCaixa, getCaixaAbertoByUser, updateCaixa } from "../api/caixaApi";
import { CaixaType } from "../types";

export const useCaixas = (page = 1, per_page = 15, search = '') => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["caixas", per_page, page, search],
        queryFn: () => getAllCaixa(per_page, page, search),
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

export const useCreateCaixa = () => {
    const mutation = useMutation({
        mutationFn: (caixa: CaixaType) => createCaixa(caixa),
    });
    return mutation;
};

export const useAbrirCaixa = () => {
    return useMutation({
        mutationFn: (itensCaixa: any) =>
            abrirCaixa(itensCaixa)
    });
}

export const useFecharCaixa = () => {

    return useMutation({
        mutationFn: ({ id, itensCaixa }: { id: number, itensCaixa: any }) =>
            fecharCaixa(id,itensCaixa)
    });

};

export const useGetCaixaAbertoByUser = (userId: number) => {
    return useQuery({
        queryKey: ['caixaAberto', userId],
        queryFn: () => getCaixaAbertoByUser(userId),
        staleTime: 1000 * 60 * 5,
        networkMode: 'always',
        enabled: !!userId, //A consulta só será executada se userId for válido
    });
}

export const useUpdateCaixa = () => {
    const mutation = useMutation({
        mutationFn: ({ id, ...data }: CaixaType) => updateCaixa(id, data),
    });

    return mutation;
};

export const useDeleteCaixa = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number | undefined) => deleteCaixa(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["caixas"],
                exact: false,
            });
        },
    });

    return mutation;
}