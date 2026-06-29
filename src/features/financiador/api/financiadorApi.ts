import { api } from "@/services/api";
import { FinanciadorType } from "../types";

export interface PaginatedFinanciador {
    data: FinanciadorType[]
    current_page: number
    per_page: number
    total: number
    last_page: number
}

const API_URL = '/financiadores';

export const getAllFinanciador = async (id: number | string, per_page: number, page: number, search?: string): Promise<PaginatedFinanciador> => {
    try {
        const response = await api.get<PaginatedFinanciador>(`${API_URL}/user/${id}`, {
            params: { per_page, page, search },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar financiadores:', error);
        throw error;
    }
};

export const getFinanciadorById = async (id: number): Promise<FinanciadorType> => {
    try {
        const response = await api.get<FinanciadorType>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar financiador com ID ${id}:`, error);
        throw error;
    }
};

export const createFinanciador = async (data: Omit<FinanciadorType, 'id'>): Promise<FinanciadorType> => {
    try {
        const response = await api.post<FinanciadorType>(API_URL, data);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar financiador:', error);
        throw error;
    }
};

export const updateFinanciador = async (id: number | undefined, data: Omit<FinanciadorType, 'id'>): Promise<FinanciadorType> => {
    try {
        const response = await api.put<FinanciadorType>(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar financiador com ID ${id}:`, error);
        throw error;
    }
};

export const deleteFinanciador = async (id: number | undefined): Promise<void> => {
    try {
        await api.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar financiador com ID ${id}:`, error);
        throw error;
    }
};
