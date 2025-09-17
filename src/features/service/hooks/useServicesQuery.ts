import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ServiceType } from "../types";
import { createServico, getServicoById, getAllServico, updateServico, deleteServico, alterarEstadoServico } from "../api/serviceApi";

// export const useServicos = (page = 1, per_page = 20, search = '', estado = '') => {
//     const { data, isLoading, isError } = useQuery({
//         queryKey: ["servicos", per_page, page, search, estado],
//         queryFn: () => getAllServico(per_page, page, search, estado),
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

export const useServicos = ({ page = 1, per_page = 15, search = '', estado = '' } = {}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["servicos", per_page, page, search, estado],
    queryFn: () => getAllServico(per_page, page, search, estado),
    staleTime: 1000 * 60 * 5,
    networkMode: 'always',
  });

  return { data, isLoading, isError };
};



export const useCreateServico = () => {
    const mutation = useMutation({
        mutationFn: (newService: ServiceType) => createServico(newService),
    });

    return mutation;
};

export const useAlterarEstadoServico = () => {

    return useMutation({
        mutationFn: ({ id, estado }: { id: number; estado: 'ativo' | 'inativo' }) =>
            alterarEstadoServico(id, estado)
    });

};


export const useUpdateServico = () => {
    const mutation = useMutation({
        mutationFn: ({ id, ...data }: ServiceType) => updateServico(Number(id), data),
    });

    return mutation;
};

export const useDeleteServico = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number | undefined) => deleteServico(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["servicos"],
                exact: false,
            });
        },
    });

    return mutation;
}