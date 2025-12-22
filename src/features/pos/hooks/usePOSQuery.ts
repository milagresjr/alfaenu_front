import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createDocumentPOS, createItensServiceContrato, deleteItensServiceContrato, getAllItensServiceContrato, listDocumentsPOS, updateItensServiceContrato } from "../api/POSApi";
import { ItemServicContratoType } from "../types";

export const useItensServiceContrato = (search = '') => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["item-service-contrato",search],
        queryFn: () => getAllItensServiceContrato(search),
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


export const useCreateItensServiceContrato = () => {
    const mutation = useMutation({
        mutationFn: (newItem: ItemServicContratoType) => createItensServiceContrato(newItem),
    });

    return mutation;
};

export const useUpdateItensServiceContrato = () => {
    const mutation = useMutation({
        mutationFn: ({id, ...data}: ItemServicContratoType) => updateItensServiceContrato(id,data),
    });

    return mutation;
};

export const useDeleteItensServiceContrato = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number | undefined) => deleteItensServiceContrato(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["item-service-contrato"],
                exact: false,
            });
        },
    });

    return mutation;
}

export const useCreateDocumentPOS = () => {
    const mutation = useMutation({
        mutationFn: (data: any) => createDocumentPOS(data),
    });

    return mutation;
}

export const useListDocumentPOS = (page = 1, per_page = 15, search = '') => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["document-pos", page, per_page, search],
        queryFn: () => listDocumentsPOS(page, per_page, search),
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