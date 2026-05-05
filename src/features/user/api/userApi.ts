import { api } from "@/services/api";
import { UserType } from "../types";

export interface PaginatedUser {
    data: UserType[]
    current_page: number
    per_page: number
    total: number
    last_page: number
    total_geral: number
    total_ativos: number
    total_inativos: number
}

const API_URL = '/users'; // URL base para a API de Usuários

// Obter todos os Usuários
export const getAllUsers = async (per_page: number, page: number, search?: string, estado?: string): Promise<PaginatedUser> => {
    try {
        const response = await api.get<PaginatedUser>(API_URL, {
            params: { per_page, page, search, estado },
        });

        return response.data; 
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
    }
};


// Obter uma Usuário por ID
export const getUserById = async (id: number): Promise<UserType> => {
    try {
        const response = await api.get<UserType>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar o Usuário com ID ${id}:`, error);
        throw error;
    }
};

// Criar um novo Usuário
export const createUser = async (user: Omit<UserType, 'id'>): Promise<UserType> => {
    try {
        const response = await api.post<UserType>(API_URL, user);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar Usuário:', error);
        throw error;
    }
};

//Registrar um novo Usuário
export const registerUser = async (user: Omit<UserType, 'id'>): Promise<UserType> => {
    try {
        const response = await api.post<UserType>(`/register`, user);
        return response.data;
    } catch (error) {
        console.error('Erro ao registrar Usuário:', error);
        throw error;
    }
}

//Ativar e Inativar Usuário
export const alterarEstadoUsuario = async (
  id: number,
  estado: 'ativo' | 'inativo'
): Promise<UserType> => {
  const response = await api.post<UserType>(`${API_URL}/${id}/estado`, { estado });
  return response.data;
};


// Atualizar um Usuário existente
export const updateUser = async (id: number | undefined, user: Omit<UserType, 'id'>): Promise<UserType> => {
    try {
        const response = await api.put<UserType>(`${API_URL}/${id}`, user);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar o Usuário com ID ${id}:`, error);
        throw error;
    }
};

// Deletar um Usuário
export const deleteUser = async (id: number | undefined): Promise<void> => {
    try {
        await api.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar o Usuário com ID ${id}:`, error);
        throw error;
    }
};

