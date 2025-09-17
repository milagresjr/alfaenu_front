import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ServiceTypeType } from "../types";
import { alterarEstadoServiceType, createTipoServico, deleteTipoServico, getAllTipoServico, updateTipoServico } from "../api/serviceTypeApi";

// export const useTipoServicos = (page = 1, per_page = 15, search = '', estado = '') => {
//     const { data, isLoading, isError } = useQuery({
//         queryKey: ["tipo-servicos", per_page, page, search, estado],
//         queryFn: () => getAllTipoServico(per_page, page, search, estado),
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

export const useTipoServicos = (
  { page = 1, per_page = 15, search = '', estado = '' } = {}
) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tipo-servicos", per_page, page, search, estado],
    queryFn: () => getAllTipoServico(per_page, page, search, estado),
    staleTime: 1000 * 60 * 5, // cache de 5min
    networkMode: 'always',
  });

  return { data, isLoading, isError };
};



export const useCreateTipoServico = () => {
    const mutation = useMutation({
        mutationFn: (newService: ServiceTypeType) => createTipoServico(newService),
    });

    return mutation;
};

export const useAlterarEstadoServicoType = () => {

  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: 'ativo' | 'inativo' }) =>
      alterarEstadoServiceType(id, estado)
  });

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