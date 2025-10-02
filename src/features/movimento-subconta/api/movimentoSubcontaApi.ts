import { api } from "@/services/api";
import { MovimentoSubcontaType } from "../type";

export interface PaginatedMovimentoSubconta {
    data: MovimentoSubcontaType[]
    current_page: number
    per_page: number
    total: number
    last_page: number
    total_geral: number
    total_ativos: number
    total_inativos: number
    saldo_total?: number
    total_entradas?: number
    total_saidas?: number
}

const API_URL = '/movimentos-subconta'; // URL base para a API de Marcas

// Obter todas as Marcas
export const getAllMovimento = async (per_page: number, page: number, search?: string, estado?: string): Promise<PaginatedMovimentoSubconta> => {
    try {
        const response = await api.get<PaginatedMovimentoSubconta>(API_URL, {
            params: { per_page, page, search, estado },
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar movimentos da subcontas:', error);
        throw error;
    }
};

export const getAllMovimentoBySubconta = async (
    idSubconta: number | string,
    per_page: number,
    page: number,
    search?: string,
    filters: any = {}
): Promise<PaginatedMovimentoSubconta> => {
    try {
        const response = await api.get<PaginatedMovimentoSubconta>(`${API_URL}/subconta/${idSubconta}`, {
            params: { per_page, page, search, ...filters },
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar movimentos da subcontas:', error);
        throw error;
    }
};


// Obter uma Movimento por ID
export const getMovimentoById = async (id: number): Promise<MovimentoSubcontaType> => {
    try {
        const response = await api.get<MovimentoSubcontaType>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar a Movimento com ID ${id}:`, error);
        throw error;
    }
};

// Criar um novo Movimento
export const createMovimento = async (Movimento: Omit<MovimentoSubcontaType, 'id'>): Promise<MovimentoSubcontaType> => {
    try {
        const response = await api.post<MovimentoSubcontaType>(API_URL, Movimento);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar Movimento:', error);
        throw error;
    }
};

// Atualizar um Movimento existente
export const updateMovimento = async (id: number | undefined, Movimento: Omit<MovimentoSubcontaType, 'id'>): Promise<MovimentoSubcontaType> => {
    try {
        const response = await api.put<MovimentoSubcontaType>(`${API_URL}/${id}`, Movimento);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar a Movimento com ID ${id}:`, error);
        throw error;
    }
};

// Deletar uma Movimento
export const deleteMovimento = async (id: number | undefined): Promise<void> => {
    try {
        await api.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar a Movimento com ID ${id}:`, error);
        throw error;
    }
};

