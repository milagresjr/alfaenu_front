import { api } from "@/services/api";
import { DocumentoProfundoStatus } from "../types";


const API_URL = "/documento-profundo-status";

export const createDocumentoProfundoStatus = async (status: DocumentoProfundoStatus): Promise<DocumentoProfundoStatus> => {
    try {
        const response = await api.post<DocumentoProfundoStatus>(`${API_URL}`, status);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar status dos documentos profundos:", error);
        throw error;
    }
};

export const getDocumentoProfundoStatus = async (): Promise<DocumentoProfundoStatus> => {
    try {
        const response = await api.get<DocumentoProfundoStatus>(`${API_URL}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar status dos documentos profundos:", error);
        throw error;
    }
};

//useGetDocumentoProfundoStatusByClienteId
export const getDocumentoProfundoStatusByClienteId = async (clienteId: string): Promise<DocumentoProfundoStatus> => {
    try {
        const response = await api.get<DocumentoProfundoStatus>(`${API_URL}/cliente/${clienteId}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar status dos documentos profundos por cliente:", error);
        throw error;
    }
}

export const updateDocumentoProfundoStatus = async (clienteId: string, status: DocumentoProfundoStatus): Promise<DocumentoProfundoStatus> => {
    try {
        const response = await api.put<DocumentoProfundoStatus>(`${API_URL}/${clienteId}`, status);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar status dos documentos profundos:", error);
        throw error;
    }
};

export const changeDocumentoProfundoStatus = async (field: string, value: string | boolean): Promise<DocumentoProfundoStatus> => {
    try {
        const response = await api.put<DocumentoProfundoStatus>(`${API_URL}/${field}`, { value });
        return response.data;
    } catch (error) {
        console.error("Erro ao alterar status dos documentos profundos:", error);
        throw error;
    }
};