import { api } from "@/services/api";



const API_URL = '/dashboard';

export interface CardStatPaginated {
  totalUsers: number;
  totalContracts: number;
  totalDocPOS: number;
  totalClients: number;
}

export interface ChartDataPaginated {
  monthlyContracts: number[];
  monthlyDocs: number[];
}

export const cardStatData = async (): Promise<CardStatPaginated> => {
  try {
    const response = await api.get<CardStatPaginated>(`${API_URL}/stat-cards`);
    return response.data;
  } catch (error) {
    console.log("Erro ao buscar os dados dos cards",error);
    throw error;
  }
}

export const chartData = async (): Promise<ChartDataPaginated> => {
  try {
    const response = await api.get<ChartDataPaginated>(`${API_URL}/chart-data`);
    return response.data;
  } catch (error) {
    console.log("Erro ao buscar os dados do graficos",error);
    throw error;
  }
}