import { api } from "@/services/api";
import { ProcessoProgressType } from "../types";



const API_URL = '/processo/progress'; // URL base para a API de ProcessProgress

// Obter todas as ProcessProgress
export const getProcessoProgress = async (): Promise<ProcessoProgressType[]> => {
    try {
        const response = await api.get<ProcessoProgressType[]>(API_URL);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar ProcessProgress:', error);
        throw error;
    }
};

export const getProcessoProgressByClienteId = async (clienteId: number): Promise<ProcessoProgressType> => {
    try {
        const response = await api.get<ProcessoProgressType>(`${API_URL}/cliente/${clienteId}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar ProcessProgress para cliente ID ${clienteId}:`, error);
        throw error;
    }
}

// Salvar ou atualizar o progresso de um processo
export const saveProcessoProgress = async (ProcessoProgress: Omit<ProcessoProgressType, 'id'>): Promise<ProcessoProgressType> => {
    try {
        const response = await api.post<ProcessoProgressType>(API_URL, ProcessoProgress);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar ProcessProgress:', error);
        throw error;
    }
};

export const updateDataProcessoProgress = async (id: number | undefined, ProcessoProgress: Omit<ProcessoProgressType, 'id'>): Promise<ProcessoProgressType> => {
    try {
        const response = await api.put<ProcessoProgressType>(`${API_URL}/${id}`, ProcessoProgress);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar o ProcessProgress com ID ${id}:`, error);
        throw error;
    }
}

export const resetProgress = async (id: number | undefined): Promise<ProcessoProgressType> => {
    try {
        const response = await api.post<ProcessoProgressType>(`${API_URL}/${id}/reset`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao resetar o progresso do processo com ID ${id}:`, error);
        throw error;
    }
}

// Obter o progresso de um processo específico
export const getProcessoProgressById = async (id: number | undefined): Promise<ProcessoProgressType> => {
    try {
        const response = await api.get<ProcessoProgressType>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar ProcessProgress com ID ${id}:`, error);
        throw error;
    }
};

export const deleteProcessoProgress = async (idCliente: number | undefined) => {
    try {
         const response = await api.delete(`${API_URL}/${idCliente}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao deletar ProcessProgress com ID ${idCliente}:`, error);
        throw error;
    }
}
