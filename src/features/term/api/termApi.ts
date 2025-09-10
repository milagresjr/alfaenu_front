import { api } from "@/services/api";
import { TermoType } from "../types";

export interface PaginatedTermo{
    data: TermoType[]
    current_page: number
    per_page: number
    total: number
    last_page: number
}

const API_URL = 'terms'; // URL base para a API de Marcas

// Obter todas as Marcas
export const getAllTermo = async (per_page: number, page: number, search?: string,): Promise<PaginatedTermo> => {
    try {
        const response = await api.get<PaginatedTermo>(API_URL, {
            params: { per_page, page, search },
        });
        return response.data; 
        
    } catch (error) {
        console.error('Erro ao buscar termos:', error);
        throw error;
    }
};


// Obter uma Termo por ID
export const getTermoById = async (id: number): Promise<TermoType> => {
    try {
        const response = await api.get<TermoType>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar a Termo com ID ${id}:`, error);
        throw error;
    }
};

// Criar um novo Termo
export const createTermo = async (Termo: Omit<TermoType, 'id'>): Promise<TermoType> => {
    try {
        const response = await api.post<TermoType>(API_URL, Termo);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar Termo:', error);
        throw error;
    }
};

// Atualizar um Termo existente
export const updateTermo = async (id: number | undefined, Termo: Omit<TermoType, 'id'>): Promise<TermoType> => {
    try {
        const response = await api.put<TermoType>(`${API_URL}/${id}`, Termo);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar a Termo com ID ${id}:`, error);
        throw error;
    }
};

// Deletar uma Termo
export const deleteTermo = async (id: number | undefined): Promise<void> => {
    try {
        await api.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar a Termo com ID ${id}:`, error);
        throw error;
    }
};

