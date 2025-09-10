import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TermoType } from "../types";
import { createTermo, getTermoById, getAllTermo, updateTermo, deleteTermo  } from "../api/termApi";

export const useTermos = (page = 1, per_page = 15, search = '') => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["termos", per_page, page, search],
        queryFn: () => getAllTermo(per_page, page, search),
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


export const useCreateTermo = () => {
    const mutation = useMutation({
        mutationFn: (newTermo: TermoType) => createTermo(newTermo),
    });

    return mutation;
};

export const useUpdateTermo = () => {
    const mutation = useMutation({
        mutationFn: ({id, ...data}: TermoType) => updateTermo(id,data),
    });

    return mutation;
};

export const useDeleteTermo = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number | undefined) => deleteTermo(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["termos"],
                exact: false,
            });
        },
    });

    return mutation;
}