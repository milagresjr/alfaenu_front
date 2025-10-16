import { api } from "@/services/api";
import { CaixaMovimentacoesType, PaginatedCaixaMovimentacoes } from "../types";


const API_URL = '/caixa-movimentacoes'; // URL base para a API de CaixaMovimentacoes

// Obter todas as CaixaMovimentacoes
export const getAllCaixaMovimentacoes = async (per_page: number, page: number, search?: string): Promise<PaginatedCaixaMovimentacoes> => {
    try {
        const response = await api.get<PaginatedCaixaMovimentacoes>(API_URL, {
            params: { per_page, page, search },
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar movimentacoes de CaixaMovimentacoes:', error);
        throw error;
    }
};


// Obter uma CaixaMovimentacoes por ID
export const getCaixaMovimentacoesById = async (id: number): Promise<CaixaMovimentacoesType> => {
    try {
        const response = await api.get<CaixaMovimentacoesType>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar a movimentacoes de CaixaMovimentacoes com ID ${id}:`, error);
        throw error;
    }
};

// Criar um novo CaixaMovimentacoes
export const createCaixaMovimentacoes = async (CaixaMovimentacoes: Omit<CaixaMovimentacoesType, 'id'>): Promise<CaixaMovimentacoesType> => {
    try {
        const response = await api.post<CaixaMovimentacoesType>(API_URL, CaixaMovimentacoes);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar CaixaMovimentacoes:', error);
        throw error;
    }
};

// Atualizar um CaixaMovimentacoes existente
export const updateCaixaMovimentacoes = async (id: number | undefined, CaixaMovimentacoes: Omit<CaixaMovimentacoesType, 'id'>): Promise<CaixaMovimentacoesType> => {
    try {
        const response = await api.put<CaixaMovimentacoesType>(`${API_URL}/${id}`, CaixaMovimentacoes);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar a CaixaMovimentacoes com ID ${id}:`, error);
        throw error;
    }
};

// Deletar uma CaixaMovimentacoes
export const deleteCaixaMovimentacoes = async (id: number | undefined): Promise<void> => {
    try {
        await api.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar a CaixaMovimentacoes com ID ${id}:`, error);
        throw error;
    }
};

