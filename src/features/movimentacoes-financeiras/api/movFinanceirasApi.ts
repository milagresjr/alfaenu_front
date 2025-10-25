import { api } from "@/services/api";
import { MovimentacoesFinanceirasType } from "../types";

export interface PaginatedMovFinanceira {
    data: MovimentacoesFinanceirasType[]
    current_page: number
    per_page: number
    total: number
    last_page: number
    total_entradas: number
    total_saidas: number
    total_saldo: number
}

const API_URL = '/movimentacoes-financeiras'; // URL base para a API de contas

// Obter todas as contas
export const getAllMovFinanceira= async (per_page: number, page: number, search?: string, estado?: string): Promise<PaginatedMovFinanceira> => {
    try {
        const response = await api.get<PaginatedMovFinanceira>(API_URL, {
            params: { per_page, page, search , estado},
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar contas:', error);
        throw error;
    }
};


// Obter uma MovFinanceirapor ID
export const getMovFinanceiraById = async (id: number): Promise<MovimentacoesFinanceirasType> => {
    try {
        const response = await api.get<MovimentacoesFinanceirasType>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar a MovFinanceira com ID ${id}:`, error);
        throw error;
    }
};

// Criar um novo MovFinanceira
export const createMovFinanceira= async (MovFinanceira: Omit<MovimentacoesFinanceirasType, 'id'>): Promise<MovimentacoesFinanceirasType> => {
    try {
        const response = await api.post<MovimentacoesFinanceirasType>(API_URL, MovFinanceira);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar MovFinanceira:', error);
        throw error;
    }
};


// Atualizar um MovFinanceiraexistente
export const updateMovFinanceira= async (id: number | undefined, MovFinanceira: Omit<MovimentacoesFinanceirasType, 'id'>): Promise<MovimentacoesFinanceirasType> => {
    try {
        const response = await api.put<MovimentacoesFinanceirasType>(`${API_URL}/${id}`, MovFinanceira);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar a MovFinanceiracom ID ${id}:`, error);
        throw error;
    }
};

// Deletar uma MovFinanceira
export const deleteMovFinanceira= async (id: number | undefined): Promise<void> => {
    try {
        await api.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar a MovFinanceiracom ID ${id}:`, error);
        throw error;
    }
};

