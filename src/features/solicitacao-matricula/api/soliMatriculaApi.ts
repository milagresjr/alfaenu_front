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

