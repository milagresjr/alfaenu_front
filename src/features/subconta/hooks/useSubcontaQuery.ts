import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { alterarEstadoSubconta, createSubconta, deleteSubconta, getAllSubconta, getAllSubcontaByContrato, updateSubconta } from "../api/subcontaApi";
import { SubcontaType } from "../type";

// export const useSubcontas = (page = 1, per_page = 15, search = '', estado = '') => {
//     const { data, isLoading, isError } = useQuery({
//         queryKey: ["tipo-servicos", per_page, page, search, estado],
//         queryFn: () => getAllSubconta(per_page, page, search, estado),
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

export const useSubcontas = (
  { page = 1, per_page = 15, search = '', estado = '' } = {}
) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["subcontas", per_page, page, search, estado],
    queryFn: () => getAllSubconta(per_page, page, search, estado),
    staleTime: 1000 * 60 * 5, // cache de 5min
    networkMode: 'always',
  });

  return { data, isLoading, isError };
};

export const useSubcontasByContract = (
  { idContract = '', page = 1, per_page = 15, search = '', estado = '' } = {}
) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["subcontas", per_page, page, search, estado],
    queryFn: () => getAllSubcontaByContrato(idContract, per_page, page, search, estado),
    staleTime: 1000 * 60 * 5, // cache de 5min
    networkMode: 'always',
  });

  return { data, isLoading, isError };
};



export const useCreateSubconta = () => {
    const mutation = useMutation({
        mutationFn: (newService: SubcontaType) => createSubconta(newService),
    });

    return mutation;
};

export const useAlterarEstadoSubconta = () => {

  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: 'ativo' | 'inativo' }) =>
      alterarEstadoSubconta(id, estado)
  });

};

export const useUpdateSubconta = () => {
    const mutation = useMutation({
        mutationFn: ({id, ...data}: SubcontaType) => updateSubconta(Number(id),data),
    });

    return mutation;
};

export const useDeleteSubconta = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number | undefined) => deleteSubconta(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["subcontas"],
                exact: false,
            });
        },
    });

    return mutation;
}