import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CentroFormacaoType } from "../types";
import { createCentroFormacao, getAllCentroFormacao, updateCentroFormacao, deleteCentroFormacao } from "../api/centroFormacaoApi";

export const useCentrosFormacao = (page = 1, per_page = 15, search = '') => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["centros-formacao", per_page, page, search],
        queryFn: () => getAllCentroFormacao(per_page, page, search),
        staleTime: 1000 * 60 * 5,
        networkMode: 'always',
    });
    return { data, isLoading, isError };
};

export const useCreateCentroFormacao = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (formData: FormData) => createCentroFormacao(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["centros-formacao"], exact: false });
        },
    });
    return mutation;
};

export const useUpdateCentroFormacao = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (formData: FormData) => updateCentroFormacao(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["centros-formacao"], exact: false });
        },
    });
    return mutation;
};

export const useDeleteCentroFormacao = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number | undefined) => deleteCentroFormacao(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["centros-formacao"], exact: false });
        },
    });
    return mutation;
};
