import { api } from "@/services/api";
import { SubcontaType } from "../type";

export interface PaginatedSubconta {
    data: SubcontaType[]
    current_page: number
    per_page: number
    total: number
    last_page: number
    total_geral: number
    total_ativos: number
    total_inativos: number
}

const API_URL = '/subcontas'; // URL base para a API de Marcas

// Obter todas as Subcontas
export const getAllSubconta = async (per_page: number, page: number, search?: string, estado?: string): Promise<PaginatedSubconta> => {
    try {
        const response = await api.get<PaginatedSubconta>(API_URL, {
            params: { per_page, page, search, estado },
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar tipo serviços:', error);
        throw error;
    }
};

// Obter todas as Marcas
export const getAllSubcontaByContrato = async (idContract: number | string, per_page: number, page: number, search?: string, estado?: string): Promise<PaginatedSubconta> => {
    try {
        const response = await api.get<PaginatedSubconta>(`${API_URL}/contract/${idContract}`, {
            params: { per_page, page, search, estado },
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar todas subcontas:', error);
        throw error;
    }
};


// Obter uma Subconta por ID
export const getSubcontaById = async (id: number): Promise<SubcontaType> => {
    try {
        const response = await api.get<SubcontaType>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar a  Subconta com ID ${id}:`, error);
        throw error;
    }
};

// Criar um novo Subconta
export const createSubconta = async (Subconta: Omit<SubcontaType, 'id'>): Promise<SubcontaType> => {
    try {
        const response = await api.post<SubcontaType>(API_URL, Subconta);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar  Subconta:', error);
        throw error;
    }
};

export const alterarEstadoSubconta = async (
    id: number,
    estado: string
): Promise<SubcontaType> => {
    const response = await api.post<SubcontaType>(`${API_URL}/${id}/estado`, { estado });
    return response.data;
};


// Atualizar um Subconta existente
export const updateSubconta = async (id: number | undefined, Subconta: Omit<SubcontaType, 'id'>): Promise<SubcontaType> => {
    try {
        const response = await api.put<SubcontaType>(`${API_URL}/${id}`, Subconta);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar a  Subconta com ID ${id}:`, error);
        throw error;
    }
};

// Deletar uma Subconta
export const deleteSubconta = async (id: number | undefined): Promise<void> => {
    try {
        await api.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar a Subconta com ID ${id}:`, error);
        throw error;
    }
};

