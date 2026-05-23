import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CourseType } from "../types";
import { createCourse, getCourseById, getAllCourse, updateCourse, deleteCourse, alterarEstadoCourse } from "../api/courseApi";

export const useCourses = (page = 1, per_page = 15, search = '', estado = '') => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["courses", per_page, page, search, estado],
        queryFn: () => getAllCourse(per_page, page, search, estado),
        staleTime: 1000 * 60 * 5,
        networkMode: 'always',
    });

    return {
        data,
        isLoading,
        isError,
    };
};

export const useCreateCourse = () => {
    const mutation = useMutation({
        mutationFn: (newCourse: CourseType) => createCourse(newCourse),
    });

    return mutation;
};

export const useAlterarEstadoCourse = () => {
    return useMutation({
        mutationFn: ({ id, estado }: { id: number; estado: 'ativo' | 'inativo' }) =>
            alterarEstadoCourse(id, estado)
    });
};

export const useUpdateCourse = () => {
    const mutation = useMutation({
        mutationFn: ({id, ...data}: CourseType) => updateCourse(id, data),
    });

    return mutation;
};

export const useDeleteCourse = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number | undefined) => deleteCourse(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["courses"],
                exact: false,
            });
        },
    });

    return mutation;
};
