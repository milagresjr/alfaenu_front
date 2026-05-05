import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserType } from "../types";
import { createUser, deleteUser, getAllUsers, registerUser, updateUser } from "../api/userApi";

export const useUsers = ({ page = 1, per_page = 15, search = '', estado = '' } = {}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", per_page, page, search, estado],
    queryFn: () => getAllUsers(per_page, page, search, estado),
    staleTime: 1000 * 60 * 5,
    networkMode: 'always',
  });

  return { data, isLoading, isError };
};

export const useCreateUser = () => {
  const mutation = useMutation({
    mutationFn: (newUser: UserType) => createUser(newUser),
  });

  return mutation;
};

export const useRegisterUser = () => {
  const mutation = useMutation({
    mutationFn: (newUser: UserType) => registerUser(newUser),
  });

  return mutation;
}

export const useAlterarEstadoUser = () => {

  // return useMutation({
  //     mutationFn: ({ id, estado }: { id: number; estado: 'ativo' | 'inativo' }) =>
  //         alterarEstadoUsuario(id, estado)
  // });

};


export const useUpdateUser = () => {
  const mutation = useMutation({
    mutationFn: ({ id, ...data }: UserType) => updateUser(Number(id), data),
  });

  return mutation;
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: number | undefined) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
        exact: false,
      });
    },
  });

  return mutation;
}