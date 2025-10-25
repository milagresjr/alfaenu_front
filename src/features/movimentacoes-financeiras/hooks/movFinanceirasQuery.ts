import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MovimentacoesFinanceirasType } from "../types";
import { createMovFinanceira, deleteMovFinanceira, getAllMovFinanceira, updateMovFinanceira } from "../api/movFinanceirasApi";

export const useMovFinanceiras = (page = 1, per_page = 15, search = '', estado = '') => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["mov-financeiras", per_page, page, search, estado],
        queryFn: () => getAllMovFinanceira(per_page, page, search, estado),
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

export const useCreateMovFinanceira = () => {
    const mutation = useMutation({
        mutationFn: (newClient: MovimentacoesFinanceirasType) => createMovFinanceira(newClient),
    });

    return mutation;
};


export const useUpdateMovFinanceira = () => {
    const mutation = useMutation({
        mutationFn: ({id, ...data}: MovimentacoesFinanceirasType) => updateMovFinanceira(Number(id),data),
    });

    return mutation;
};

export const useDeleteMovFinanceira = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number | undefined) => deleteMovFinanceira(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["mov-financeiras"],
                exact: false,
            });
        },
    });

    return mutation;
}