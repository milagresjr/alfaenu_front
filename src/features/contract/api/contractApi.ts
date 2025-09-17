import { api } from "@/services/api";
import { ContratoType } from "../types";

export interface PaginatedContrato {
    data: ContratoType[]
    current_page: number
    per_page: number
    total: number
    last_page: number
}

const API_URL = '/contracts'; // URL base para a API de Contratos

// Obter todas as Contratos
export const getAllContrato = async (per_page: number, page: number, search?: string): Promise<PaginatedContrato> => {
    try {
        const response = await api.get<PaginatedContrato>(API_URL, {
            params: { per_page, page, search },
        });

        return response.data; 
    } catch (error) {
        console.error('Erro ao buscar Contratos:', error);
        throw error;
    }
};


// Obter uma Contrato por ID
export const getContratoById = async (id: number): Promise<ContratoType> => {
    try {
        const response = await api.get<ContratoType>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar a Contrato com ID ${id}:`, error);
        throw error;
    }
};

// Criar um novo Contrato
export const createContrato = async (Contrato: Omit<ContratoType, 'id'>): Promise<ContratoType> => {
    try {
        const response = await api.post<ContratoType>(API_URL, Contrato);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar Contrato:', error);
        throw error;
    }
};

//Alterar o estado do contrato
export const alterarEstadoContrato = async (
  id: number,
  estado: string
): Promise<ContratoType> => {
  const response = await api.post<ContratoType>(`${API_URL}/${id}/estado`, { estado });
  return response.data;
};


// Atualizar um Contrato existente
export const updateContrato = async (id: number | undefined, Contrato: Omit<ContratoType, 'id'>): Promise<ContratoType> => {
    try {
        const response = await api.put<ContratoType>(`${API_URL}/${id}`, Contrato);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar a Contrato com ID ${id}:`, error);
        throw error;
    }
};

// Deletar uma Contrato
export const deleteContrato = async (id: number | undefined): Promise<void> => {
    try {
        await api.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar a Contrato com ID ${id}:`, error);
        throw error;
    }
};

