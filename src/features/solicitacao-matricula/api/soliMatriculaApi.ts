import { api } from '@/services/api';
import { SolicitacaoMatriculaType } from '../types';

const API_URL = '/solicitacao-matricula'; // URL base para a API de solicitações de matrícula

// Criar uma nova solicitação de matrícula
export const createSolicitacaoMatricula = async (formData: FormData | SolicitacaoMatriculaType): Promise<SolicitacaoMatriculaType> => {
    try {
        const response = await api.post<SolicitacaoMatriculaType>(API_URL, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao criar solicitação de matrícula:", error);
        throw error;
    }
};

// Buscar solicitações de matrícula por cliente
export const getSolicitacaoMatriculaByClienteId = async (clienteId: string): Promise<SolicitacaoMatriculaType> => {
    try {
        const response = await api.get<SolicitacaoMatriculaType>(`${API_URL}/cliente/${clienteId}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar solicitações de matrícula por cliente:", error);
        throw error;
    }
};

// Buscar uma solicitação de matrícula por ID
export const getSolicitacaoMatriculaById = async (id: string): Promise<SolicitacaoMatriculaType> => {
    try {
        const response = await api.get<SolicitacaoMatriculaType>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar solicitação de matrícula por ID:", error);
        throw error;
    }
};

