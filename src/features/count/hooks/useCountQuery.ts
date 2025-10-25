import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CountType } from "../types";
import { createCount, getCountById, getAllCount, updateCount, deleteCount, alterarEstadoCount  } from "../api/countApi";

export const useCounts = (page = 1, per_page = 15, search = '', estado = '') => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["contas", per_page, page, search, estado],
        queryFn: () => getAllCount(per_page, page, search, estado),
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

export const useCreateCount = () => {
    const mutation = useMutation({
        mutationFn: (newClient: CountType) => createCount(newClient),
    });

    return mutation;
};


export const useAlterarEstadoCount = () => {

  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: 'ativo' | 'inativo' }) =>
      alterarEstadoCount(id, estado)
  });

};


export const useUpdateCount = () => {
    const mutation = useMutation({
        mutationFn: ({id, ...data}: CountType) => updateCount(Number(id),data),
    });

    return mutation;
};

export const useDeleteCount = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number | undefined) => deleteCount(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["contas"],
                exact: false,
            });
        },
    });

    return mutation;
}