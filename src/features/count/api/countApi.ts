import { api } from "@/services/api";
import { CountType } from "../types";

export interface PaginatedCount {
    data: CountType[]
    current_page: number
    per_page: number
    total: number
    last_page: number
    total_geral: number
    total_ativos: number
    total_inativos: number
}

const API_URL = '/contas-financeiras'; // URL base para a API de contas

// Obter todas as contas
export const getAllCount= async (per_page: number, page: number, search?: string, estado?: string): Promise<PaginatedCount> => {
    try {
        const response = await api.get<PaginatedCount>(API_URL, {
            params: { per_page, page, search , estado},
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar contas:', error);
        throw error;
    }
};


// Obter uma Countpor ID
export const getCountById = async (id: number): Promise<CountType> => {
    try {
        const response = await api.get<CountType>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar a Count com ID ${id}:`, error);
        throw error;
    }
};

// Criar um novo Count
export const createCount= async (Count: Omit<CountType, 'id'>): Promise<CountType> => {
    try {
        const response = await api.post<CountType>(API_URL, Count);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar Count:', error);
        throw error;
    }
};

//Ativar e Inativar Count
export const alterarEstadoCount= async (
  id: number,
  estado: 'ativo' | 'inativo'
): Promise<CountType> => {
  const response = await api.post<CountType>(`${API_URL}/${id}/estado`, { estado });
  return response.data;
};


// Atualizar um Countexistente
export const updateCount= async (id: number | undefined, Count: Omit<CountType, 'id'>): Promise<CountType> => {
    try {
        const response = await api.put<CountType>(`${API_URL}/${id}`, Count);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar a Countcom ID ${id}:`, error);
        throw error;
    }
};

// Deletar uma Count
export const deleteCount= async (id: number | undefined): Promise<void> => {
    try {
        await api.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar a Countcom ID ${id}:`, error);
        throw error;
    }
};

