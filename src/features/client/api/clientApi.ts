import { api } from "@/services/api";
import { ClienteType } from "../types";

export interface PaginatedCliente {
    data: ClienteType[]
    current_page: number
    per_page: number
    total: number
    last_page: number
}

const API_URL = '/clients'; // URL base para a API de Clientes

// Obter todas as Clientes
export const getAllCliente = async (per_page: number, page: number, search?: string): Promise<PaginatedCliente> => {
    try {
        const response = await api.get<PaginatedCliente>(API_URL, {
            params: { per_page, page, search },
        });

        return response.data; 
    } catch (error) {
        console.error('Erro ao buscar Clientes:', error);
        throw error;
    }
};


// Obter uma Cliente por ID
export const getClienteById = async (id: number): Promise<ClienteType> => {
    try {
        const response = await api.get<ClienteType>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar a Cliente com ID ${id}:`, error);
        throw error;
    }
};

// Criar um novo Cliente
export const createCliente = async (Cliente: Omit<ClienteType, 'id'>): Promise<ClienteType> => {
    try {
        const response = await api.post<ClienteType>(API_URL, Cliente);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar Cliente:', error);
        throw error;
    }
};

// Atualizar um Cliente existente
export const updateCliente = async (id: number | undefined, Cliente: Omit<ClienteType, 'id'>): Promise<ClienteType> => {
    try {
        const response = await api.put<ClienteType>(`${API_URL}/${id}`, Cliente);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar a Cliente com ID ${id}:`, error);
        throw error;
    }
};

// Deletar uma Cliente
export const deleteCliente = async (id: number | undefined): Promise<void> => {
    try {
        await api.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar a Cliente com ID ${id}:`, error);
        throw error;
    }
};

