import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FinanciadorType } from "../types";
import { createFinanciador, deleteFinanciador, getAllFinanciador, updateFinanciador } from "../api/financiadorApi";

export const useFinanciadores = (id: string, page = 1, per_page = 15, search = '') => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["financiadores", id, per_page, page, search],
        queryFn: () => getAllFinanciador(id, per_page, page, search),
        staleTime: 1000 * 60 * 5,
        networkMode: 'always',
    });

    return { data, isLoading, isError };
};

export const useCreateFinanciador = () => {
    const mutation = useMutation({
        mutationFn: (newData: FinanciadorType) => createFinanciador(newData),
    });
    return mutation;
};

export const useUpdateFinanciador = () => {
    const mutation = useMutation({
        mutationFn: ({ id, ...data }: FinanciadorType) => updateFinanciador(id, data),
    });
    return mutation;
};

export const useDeleteFinanciador = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number | undefined) => deleteFinanciador(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["financiadores"],
                exact: false,
            });
        },
    });
    return mutation;
};
