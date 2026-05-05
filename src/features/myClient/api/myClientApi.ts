import { api } from "@/services/api";
import { MyClienteType } from "../types";

export interface PaginatedCliente {
    data: MyClienteType[]
    current_page: number
    per_page: number
    total: number
    last_page: number
    total_geral?: number
    total_ativos?: number
    total_inativos?: number
}

const API_URL = '/my-clients'; // URL base para a API de Clientes

// Obter todas as Clientes
export const getAllMyCliente = async (per_page: number, page: number, search?: string, estado?: string): Promise<PaginatedCliente> => {
    try {
        const response = await api.get<PaginatedCliente>(API_URL, {
            params: { per_page, page, search , estado},
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar Clientes:', error);
        throw error;
    }
};


// Obter uma Cliente por ID
export const getClienteById = async (id: number): Promise<MyClienteType> => {
    try {
        const response = await api.get<MyClienteType>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar a Cliente com ID ${id}:`, error);
        throw error;
    }
};

// Criar um novo Cliente
export const createMyCliente = async (Cliente: Omit<MyClienteType, 'id'>): Promise<MyClienteType> => {
    try {
        const response = await api.post<MyClienteType>(API_URL, Cliente);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar Cliente:', error);
        throw error;
    }
};

//Ativar e Inativar Cliente
export const alterarEstadoMyCliente = async (
  id: number,
  estado: 'ativo' | 'inativo'
): Promise<MyClienteType> => {
  const response = await api.post<MyClienteType>(`/clients/${id}/estado`, { estado });
  return response.data;
};


// Atualizar um Cliente existente
export const updateMyCliente = async (id: number | undefined, Cliente: Omit<MyClienteType, 'id'>): Promise<MyClienteType> => {
    try {
        const response = await api.put<MyClienteType>(`${API_URL}/${id}`, Cliente);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar a Cliente com ID ${id}:`, error);
        throw error;
    }
};

// Deletar uma Cliente
export const deleteMyCliente = async (id: number | undefined): Promise<void> => {
    try {
        await api.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar a Cliente com ID ${id}:`, error);
        throw error;
    }
};

