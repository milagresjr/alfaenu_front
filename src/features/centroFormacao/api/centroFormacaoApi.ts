import { api } from "@/services/api";
import { CentroFormacaoType } from "../types";

export interface PaginatedCentroFormacao {
    data: CentroFormacaoType[]
    current_page: number
    per_page: number
    total: number
    last_page: number
}

const API_URL = '/centros-formacao';

export const getAllCentroFormacao = async (per_page: number, page: number, search?: string): Promise<PaginatedCentroFormacao> => {
    try {
        const response = await api.get<PaginatedCentroFormacao>(API_URL, {
            params: { per_page, page, search },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar centros de formação:', error);
        throw error;
    }
};

export const getCentroFormacaoById = async (id: number): Promise<CentroFormacaoType> => {
    try {
        const response = await api.get<CentroFormacaoType>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar centro de formação com ID ${id}:`, error);
        throw error;
    }
};

export const createCentroFormacao = async (formData: FormData): Promise<CentroFormacaoType> => {
    try {
        const response = await api.post<CentroFormacaoType>(API_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar centro de formação:', error);
        throw error;
    }
};

export const updateCentroFormacao = async (formData: FormData): Promise<CentroFormacaoType> => {
    try {
        const id = formData.get('id');
        formData.delete('id');
        const response = await api.put<CentroFormacaoType>(`${API_URL}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar centro de formação:', error);
        throw error;
    }
};

export const deleteCentroFormacao = async (id: number | undefined): Promise<void> => {
    try {
        await api.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar centro de formação com ID ${id}:`, error);
        throw error;
    }
};
