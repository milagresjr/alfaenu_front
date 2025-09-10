import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClienteType } from "../types";
import { createCliente, getClienteById, getAllCliente, updateCliente, deleteCliente  } from "../api/clientApi";

export const useClientes = (page = 1, per_page = 15, search = '') => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["clientes", per_page, page, search],
        queryFn: () => getAllCliente(per_page, page, search),
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


export const useCreateCliente = () => {
    const mutation = useMutation({
        mutationFn: (newClient: ClienteType) => createCliente(newClient),
    });

    return mutation;
};

export const useUpdateCliente = () => {
    const mutation = useMutation({
        mutationFn: ({id, ...data}: ClienteType) => updateCliente(id,data),
    });

    return mutation;
};

export const useDeleteCliente = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number | undefined) => deleteCliente(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["clientes"],
                exact: false,
            });
        },
    });

    return mutation;
}