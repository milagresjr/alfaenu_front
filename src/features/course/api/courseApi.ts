import { api } from "@/services/api";
import { CourseType } from "../types";

export interface PaginatedCourse {
    data: CourseType[]
    current_page: number
    per_page: number
    total: number
    last_page: number
    total_geral: number
    total_ativos: number
    total_inativos: number
}

const API_URL = '/courses'; // URL base para a API de Cursos

// Obter todos os Cursos
export const getAllCourse = async (per_page: number, page: number, search?: string, estado?: string): Promise<PaginatedCourse> => {
    try {
        const response = await api.get<PaginatedCourse>(API_URL, {
            params: { per_page, page, search , estado},
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar Cursos:', error);
        throw error;
    }
};

// Obter um Curso por ID
export const getCourseById = async (id: number): Promise<CourseType> => {
    try {
        const response = await api.get<CourseType>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar o Curso com ID ${id}:`, error);
        throw error;
    }
};

// Criar um novo Curso
export const createCourse = async (formData: FormData): Promise<CourseType> => {
    try {
        const response = await api.post<CourseType>(API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar Curso:', error);
        throw error;
    }
};

// Ativar e Inativar Curso
export const alterarEstadoCourse = async (
  id: number,
  estado: 'ativo' | 'inativo'
): Promise<CourseType> => {
  const response = await api.post<CourseType>(`/courses/${id}/estado`, { estado });
  return response.data;
};

// Atualizar um Curso existente
export const updateCourse = async (formData: FormData): Promise<CourseType> => {
    try {
        const id = formData.get('id'); // Pega o ID do FormData
        formData.delete('id'); // Remove o ID do FormData para não enviar duplicado
        
        const response = await api.put<CourseType>(`${API_URL}/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar Curso:', error);
        throw error;
    }
};

// Deletar um Curso
export const deleteCourse = async (id: number | undefined): Promise<void> => {
    try {
        await api.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar o Curso com ID ${id}:`, error);
        throw error;
    }
};
