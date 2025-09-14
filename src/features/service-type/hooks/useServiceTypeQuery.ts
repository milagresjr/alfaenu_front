import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ServiceTypeType } from "../types";
import { createTipoServico, deleteTipoServico, getAllTipoServico, updateTipoServico } from "../api/serviceTypeApi";

export const useTipoServicos = (page = 1, per_page = 15, search = '') => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["tipo-servicos", per_page, page, search],
        queryFn: () => getAllTipoServico(per_page, page, search),
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


export const useCreateTipoServico = () => {
    const mutation = useMutation({
        mutationFn: (newService: ServiceTypeType) => createTipoServico(newService),
    });

    return mutation;
};

export const useUpdateTipoServico = () => {
    const mutation = useMutation({
        mutationFn: ({id, ...data}: ServiceTypeType) => updateTipoServico(Number(id),data),
    });

    return mutation;
};

export const useDeleteTipoServico = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number | undefined) => deleteTipoServico(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tipo-servicos"],
                exact: false,
            });
        },
    });

    return mutation;
}