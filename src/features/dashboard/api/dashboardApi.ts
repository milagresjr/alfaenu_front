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

export interface ExternalDashboardData {
  totalActiveProcesses: number;
  totalMyClients: number;
  pendingDocuments: number;
  monthlyProcesses: number[];
  documentStatusCounts: {
    pendente: number;
    aprovado: number;
    nao_enviado: number;
    rejeitado: number;
    concluido: number;
  };
}

export const externalDashboardData = async (userId: number | string): Promise<ExternalDashboardData> => {
  try {
    const response = await api.get<ExternalDashboardData>(`${API_URL}/external-data/${userId}`);
    return response.data;
  } catch (error) {
    console.log("Erro ao buscar dados do dashboard externo", error);
    throw error;
  }
}