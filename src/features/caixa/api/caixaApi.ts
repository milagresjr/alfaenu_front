import { api } from "@/services/api";
import { CaixaType, PaginatedCaixa } from "../types";


const API_URL = '/caixas'; // URL base para a API de Caixa

// Obter todas as Caixa
export const getAllCaixa = async (per_page: number, page: number, search?: string): Promise<PaginatedCaixa> => {
    try {
        const response = await api.get<PaginatedCaixa>(API_URL, {
            params: { per_page, page, search },
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar Caixa:', error);
        throw error;
    }
};


// Obter uma Caixa por ID
export const getCaixaById = async (id: number): Promise<CaixaType> => {
    try {
        const response = await api.get<CaixaType>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar a Caixa com ID ${id}:`, error);
        throw error;
    }
};

// Criar um novo Caixa
export const createCaixa = async (Caixa: Omit<CaixaType, 'id'>): Promise<CaixaType> => {
    try {
        const response = await api.post<CaixaType>(API_URL, Caixa);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar Caixa:', error);
        throw error;
    }
};

export const abrirCaixa = async (itensCaixa: any): Promise<CaixaType> => {
    const response = await api.post(`${API_URL}/abrir`, itensCaixa);
    return response.data;
};

//Ativar e Inativar Caixa
export const fecharCaixa = async (
    id: number,
    itensCaixa?: any
): Promise<CaixaType> => {
    const response = await api.patch(`${API_URL}/${id}/fechar`, itensCaixa);
    return response.data;
};

export const getCaixaAbertoByUser = async (userId: number): Promise<CaixaType | null> => {
    try {
        const response = await api.get<CaixaType>(`${API_URL}/aberto/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar a Caixa aberta para o usuário com ID ${userId}:`, error);
        return null; // Retorna null se não houver caixa aberto ou em caso de erro
    }
}

// Atualizar um Caixa existente
export const updateCaixa = async (id: number | undefined, Caixa: Omit<CaixaType, 'id'>): Promise<CaixaType> => {
    try {
        const response = await api.put<CaixaType>(`${API_URL}/${id}`, Caixa);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar a Caixa com ID ${id}:`, error);
        throw error;
    }
};

// Deletar uma Caixa
export const deleteCaixa = async (id: number | undefined): Promise<void> => {
    try {
        await api.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar a Caixa com ID ${id}:`, error);
        throw error;
    }
};

