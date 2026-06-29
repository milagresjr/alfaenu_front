import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { alterarEstadoMyCliente, createMyCliente, deleteMyCliente, getAllMyCliente, updateMyCliente } from "../api/myClientApi";

export const useMyClientes = (id: string, page = 1, per_page = 15, search = '', estado = '') => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["myclientes", id, per_page, page, search, estado],
        queryFn: () => getAllMyCliente(id, per_page, page, search, estado),
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

export const useCreateMyCliente = () => {
    const mutation = useMutation({
        mutationFn: (formData: FormData) => createMyCliente(formData),
    });

    return mutation;
};


export const useAlterarEstadoMyCliente = () => {

  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: 'ativo' | 'inativo' }) =>
      alterarEstadoMyCliente(id, estado)
  });

};


export const useUpdateMyCliente = () => {
    const mutation = useMutation({
        mutationFn: (formData: FormData) => updateMyCliente(formData),
    });

    return mutation;
};

export const useDeleteMyCliente = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number | undefined) => deleteMyCliente(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["clientes"],
                exact: false,
            });
        },
    });

    return mutation;
}