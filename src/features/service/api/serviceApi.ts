import { api } from "@/services/api";
import { ServiceType } from "../types";

export interface PaginatedServico {
    data: ServiceType[]
    current_page: number
    per_page: number
    total: number
    last_page: number
}

const API_URL = '/services'; // URL base para a API de Marcas

// Obter todas as Marcas
export const getAllServico = async (per_page: number, page: number, search?: string): Promise<PaginatedServico> => {
    try {
        const response = await api.get<PaginatedServico>(API_URL, {
            params: { per_page, page, search },
        });

        return response.data; 
    } catch (error) {
        console.error('Erro ao buscar serviços:', error);
        throw error;
    }
};


// Obter uma Servico por ID
export const getServicoById = async (id: number): Promise<ServiceType> => {
    try {
        const response = await api.get<ServiceType>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar a Servico com ID ${id}:`, error);
        throw error;
    }
};

// Criar um novo Servico
export const createServico = async (Servico: Omit<ServiceType, 'id'>): Promise<ServiceType> => {
    try {
        const response = await api.post<ServiceType>(API_URL, Servico);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar Servico:', error);
        throw error;
    }
};

// Atualizar um Servico existente
export const updateServico = async (id: number | undefined, Servico: Omit<ServiceType, 'id'>): Promise<ServiceType> => {
    try {
        const response = await api.put<ServiceType>(`${API_URL}/${id}`, Servico);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar a Servico com ID ${id}:`, error);
        throw error;
    }
};

// Deletar uma Servico
export const deleteServico = async (id: number | undefined): Promise<void> => {
    try {
        await api.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar a Servico com ID ${id}:`, error);
        throw error;
    }
};

