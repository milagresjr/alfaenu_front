import { useQuery } from "@tanstack/react-query";
import { cardStatData, chartData, externalDashboardData } from "../api/dashboardApi";


export function useCardStatData() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["cart-stat-data"],
    queryFn: () => cardStatData(),
    staleTime: 1000 * 60 * 5,
    networkMode: 'always',
  });

  return {
    data,
    isError,
    isLoading
  }
}

export function useChartData() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["chart-data"],
    queryFn: () => chartData(),
    staleTime: 1000 * 60 * 5,
    networkMode: 'always',
  });

  return {
    data,
    isError,
    isLoading
  }
}

export function useExternalDashboardData(userId: number | string | undefined) {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["external-dashboard-data", userId],
    queryFn: () => externalDashboardData(userId!),
    staleTime: 1000 * 60 * 5,
    networkMode: 'always',
    enabled: !!userId,
  });

  return {
    data,
    isError,
    isLoading
  }
}