import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContratoType } from "../types";
import { createContrato, getContratoById, getAllContrato, updateContrato, deleteContrato  } from "../api/contractApi";

export const useContratos = (page = 1, per_page = 15, search = '') => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["contratos", per_page, page, search],
        queryFn: () => getAllContrato(per_page, page, search),
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


export const useCreateContrato = () => {
    const mutation = useMutation({
        mutationFn: (newContrato: ContratoType) => createContrato(newContrato),
    });

    return mutation;
};

export const useUpdateContrato = () => {
    const mutation = useMutation({
        mutationFn: ({id, ...data}: ContratoType) => updateContrato(id,data),
    });

    return mutation;
};

export const useDeleteContrato = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number | undefined) => deleteContrato(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["contratos"],
                exact: false,
            });
        },
    });

    return mutation;
}