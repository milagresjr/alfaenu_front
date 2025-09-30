import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createMovimento, getMovimentoById, getAllMovimento, updateMovimento, deleteMovimento, getAllMovimentoBySubconta } from "../api/movimentoSubcontaApi";
import { MovimentoSubcontaType } from "../type";

// export const useMovimentos = (page = 1, per_page = 20, search = '', estado = '') => {
//     const { data, isLoading, isError } = useQuery({
//         queryKey: ["Movimentos", per_page, page, search, estado],
//         queryFn: () => getAllMovimento(per_page, page, search, estado),
//         staleTime: 1000 * 60 * 5,
//         networkMode: 'always',
//         //keepPreviousData: true, 
//     });

//     return {
//         data,
//         isLoading,
//         isError,
//     };
// };

export const useMovimentos = ({ page = 1, per_page = 15, search = '', estado = '' } = {}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["movimentos-subconta", per_page, page, search, estado],
    queryFn: () => getAllMovimento(per_page, page, search, estado),
    staleTime: 1000 * 60 * 5,
    networkMode: 'always',
  });

  return { data, isLoading, isError };
};


export const useMovimentosBySubconta = ({ idSubconta = '', page = 1, per_page = 15, search = '', estado = '' } = {}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["movimentos-subconta", per_page, page, search, estado],
    queryFn: () => getAllMovimentoBySubconta(idSubconta, per_page, page, search, estado),
    staleTime: 1000 * 60 * 5,
    networkMode: 'always',
  });

  return { data, isLoading, isError };
};


export const useCreateMovimento = () => {
    const mutation = useMutation({
        mutationFn: (newService: MovimentoSubcontaType) => createMovimento(newService),
    });

    return mutation;
};


export const useUpdateMovimento = () => {
    const mutation = useMutation({
        mutationFn: ({ id, ...data }: MovimentoSubcontaType) => updateMovimento(Number(id), data),
    });

    return mutation;
};

export const useDeleteMovimento = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number | undefined) => deleteMovimento(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["Movimentos-subconta"],
                exact: false,
            });
        },
    });

    return mutation;
}