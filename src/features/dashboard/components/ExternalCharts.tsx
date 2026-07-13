"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { ExternalDashboardData } from "../api/dashboardApi";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ExternalChartsProps {
  data: ExternalDashboardData | undefined;
  isLoading: boolean;
}

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function MonthlyProcessesChart({ data, isLoading }: ExternalChartsProps) {
  const options: ApexOptions = {
    colors: ["#6366f1"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories: meses,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#9ca3af", fontSize: "12px" } },
    },
    yaxis: {
      title: { text: undefined },
      labels: { style: { colors: "#9ca3af", fontSize: "12px" } },
    },
    grid: { borderColor: "#f3f4f6" },
    fill: { opacity: 1 },
    tooltip: { x: { show: false } },
  };

  const series = [
    {
      name: "Processos",
      data: data?.monthlyProcesses ?? [],
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white px-5 pt-5 shadow-sm ring-1 ring-indigo-500/20 transition-all duration-200 hover:shadow-md dark:border-white/[0.08] dark:bg-gray-900 sm:px-6 sm:pt-6">
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-indigo-500/10 via-indigo-500/5 to-transparent" />
      <div className="relative flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Evolução Mensal de Processos
        </h3>
      </div>
      <div className="relative max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          {isLoading ? (
            <div className="flex h-[280px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            </div>
          ) : (
            <ReactApexChart options={options} series={series} type="bar" height={280} />
          )}
        </div>
      </div>
    </div>
  );
}

export function DocumentStatusDonut({ data, isLoading }: ExternalChartsProps) {
  const counts = data?.documentStatusCounts;
  const hasData = counts && Object.values(counts).some((v) => v > 0);

  const options: ApexOptions = {
    colors: ["#f59e0b", "#10b981", "#6b7280", "#ef4444", "#6366f1"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
      toolbar: { show: false },
    },
    labels: ["Pendente", "Aprovado", "Não Enviado", "Rejeitado", "Concluído"],
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
        },
      },
    },
    legend: {
      position: "bottom",
      fontFamily: "Outfit",
      labels: { colors: "#6b7280" },
      markers: { shape: "circle" },
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: "12px", fontFamily: "Outfit" },
      formatter(val: number) {
        return `${Math.round(val)}%`;
      },
    },
    stroke: { show: false },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { height: 250 },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  const series = counts
    ? [counts.pendente, counts.aprovado, counts.nao_enviado, counts.rejeitado, counts.concluido]
    : [0, 0, 0, 0, 0];

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white px-5 pt-5 shadow-sm ring-1 ring-amber-500/20 transition-all duration-200 hover:shadow-md dark:border-white/[0.08] dark:bg-gray-900 sm:px-6 sm:pt-6">
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent" />
      <div className="relative flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Status dos Documentos
        </h3>
      </div>
      <div className="relative">
        {isLoading ? (
          <div className="flex h-[280px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          </div>
        ) : !hasData ? (
          <div className="flex h-[280px] items-center justify-center text-sm text-gray-400">
            Nenhum documento encontrado
          </div>
        ) : (
          <ReactApexChart options={options} series={series} type="donut" height={300} />
        )}
      </div>
    </div>
  );
}
