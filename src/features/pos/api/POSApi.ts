import { api } from "@/services/api";
import { ItemServicContratoType } from "../types";


const API_URL = '/items-services-contract'; // URL base para a API de ItensServiceContratos

export interface DocumentPOSPaginated {
    data: any[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

// Obter todas as ItensServiceContratos
export const getAllItensServiceContrato = async (search: string): Promise<ItemServicContratoType[]> => {
    try {
        const response = await api.get<ItemServicContratoType[]>(API_URL, {
            params: { search },
        });

        return response.data; 
    } catch (error) {
        console.error('Erro ao buscar ItensServiceContratos:', error);
        throw error;
    }
};


// Obter uma ItensServiceContrato por ID
export const getItensServiceContratoById = async (id: number): Promise<ItemServicContratoType> => {
    try {
        const response = await api.get<ItemServicContratoType>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar a ItensServiceContrato com ID ${id}:`, error);
        throw error;
    }
};

// Criar um novo ItensServiceContrato
export const createItensServiceContrato = async (ItensServiceContrato: Omit<ItemServicContratoType, 'id'>): Promise<ItemServicContratoType> => {
    try {
        const response = await api.post<ItemServicContratoType>(API_URL, ItensServiceContrato);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar ItensServiceContrato:', error);
        throw error;
    }
};

// Atualizar um ItensServiceContrato existente
export const updateItensServiceContrato = async (id: number | undefined, ItensServiceContrato: Omit<ItemServicContratoType, 'id'>): Promise<ItemServicContratoType> => {
    try {
        const response = await api.put<ItemServicContratoType>(`${API_URL}/${id}`, ItensServiceContrato);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar a ItensServiceContrato com ID ${id}:`, error);
        throw error;
    }
};

// Deletar uma ItensServiceContrato
export const deleteItensServiceContrato = async (id: number | undefined): Promise<void> => {
    try {
        await api.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar a ItensServiceContrato com ID ${id}:`, error);
        throw error;
    }
};

export const createDocumentPOS = async (data: any): Promise<any> => {
    try {
        const response = await api.post<any>('/movimento-subconta/movimento-subconta-pos', data);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar documento do POS:', error);
        throw error;
    }
}

export const listDocumentsPOS = async (
    page: number, 
    per_page: number, 
    search?: string
): Promise<DocumentPOSPaginated> => {
    try {
        const response = await api.get<DocumentPOSPaginated>('/movimento-subconta/list-movimento-subconta-pos', {
            params: { page, per_page, search }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao listar documentos do POS:', error);
        throw error;
    }
}

export const generatePdfDocumentPOS = async (id: number): Promise<Blob> => {
    try {
        const response = await api.get(`/document-pos-generated/${id}/gerar-pdf`, {
            responseType: 'blob', // Importante para arquivos binários
        });
        return response.data;
    } catch (error) {
        console.error(`Erro ao gerar PDF do documento POS com ID ${id}:`, error);
        throw error;
    }
}