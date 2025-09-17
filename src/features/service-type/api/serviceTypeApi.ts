import { api } from "@/services/api";
import { ServiceTypeType } from "../types";

export interface PaginatedTipoServico {
    data: ServiceTypeType[]
    current_page: number
    per_page: number
    total: number
    last_page: number
}

const API_URL = '/services-type'; // URL base para a API de Marcas

// Obter todas as Marcas
export const getAllTipoServico = async (per_page: number, page: number, search?: string, estado?: string): Promise<PaginatedTipoServico> => {
    try {
        const response = await api.get<PaginatedTipoServico>(API_URL, {
            params: { per_page, page, search, estado },
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar tipo serviços:', error);
        throw error;
    }
};


// Obter uma TipoServico por ID
export const getTipoServicoById = async (id: number): Promise<ServiceTypeType> => {
    try {
        const response = await api.get<ServiceTypeType>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar a Tipo Servico com ID ${id}:`, error);
        throw error;
    }
};

// Criar um novo TipoServico
export const createTipoServico = async (TipoServico: Omit<ServiceTypeType, 'id'>): Promise<ServiceTypeType> => {
    try {
        const response = await api.post<ServiceTypeType>(API_URL, TipoServico);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar Tipo Servico:', error);
        throw error;
    }
};

export const alterarEstadoServiceType = async (
    id: number,
    estado: 'ativo' | 'inativo'
): Promise<ServiceTypeType> => {
    const response = await api.post<ServiceTypeType>(`${API_URL}/${id}/estado`, { estado });
    return response.data;
};


// Atualizar um TipoServico existente
export const updateTipoServico = async (id: number | undefined, TipoServico: Omit<ServiceTypeType, 'id'>): Promise<ServiceTypeType> => {
    try {
        const response = await api.put<ServiceTypeType>(`${API_URL}/${id}`, TipoServico);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar a Tipo Servico com ID ${id}:`, error);
        throw error;
    }
};

// Deletar uma TipoServico
export const deleteTipoServico = async (id: number | undefined): Promise<void> => {
    try {
        await api.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar a TipoServico com ID ${id}:`, error);
        throw error;
    }
};

