"use client";

import type { Metadata } from "next";
import React from "react";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import { CardStat } from "./(admin)/_dashboard/CardStat";
import { useCardStatData, useChartData, useExternalDashboardData } from "@/features/dashboard/hooks/useDashboardQuery";
import { Users, FileText, Briefcase, FileSignature } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { ExternalCards } from "@/features/dashboard/components/ExternalCards";
import { MonthlyProcessesChart, DocumentStatusDonut } from "@/features/dashboard/components/ExternalCharts";

export default function Dashboard() {

  const { user } = useAuthStore();
  const isExternal = user?.type === "externo";

  const { data: dataCard, isError: errorCard, isLoading: isLoadingCard } = useCardStatData();
  const { data: dataChart } = useChartData();
  const { data: externalData, isLoading: isLoadingExternal } = useExternalDashboardData(user?.id);

  const monthlyContracts = dataChart?.monthlyContracts;
  const monthlyDocs = dataChart?.monthlyDocs;

  if (isExternal) {
    return (
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <ExternalCards data={externalData} isLoading={isLoadingExternal} />

        <div className="col-span-12 lg:col-span-7">
          <MonthlyProcessesChart data={externalData} isLoading={isLoadingExternal} />
        </div>

        <div className="col-span-12 lg:col-span-5">
          <DocumentStatusDonut data={externalData} isLoading={isLoadingExternal} />
        </div>
      </div>
    );
  }

  const totUsers = dataCard?.totalUsers;
  const totDocuments = dataCard?.totalDocPOS;
  const totClients = dataCard?.totalClients;
  const totContrats = dataCard?.totalContracts;

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 col-span-12">
        <CardStat
          isLoading={isLoadingCard}
          title="Total de Usuários"
          value={Number(totUsers)}
          icon={<Users className="h-5 w-5" />}
          accentColor="blue"
        />
        <CardStat
          isLoading={isLoadingCard}
          title="Total de Documentos"
          value={Number(totDocuments)}
          icon={<FileText className="h-5 w-5" />}
          accentColor="emerald"
        />
        <CardStat
          isLoading={isLoadingCard}
          title="Total de Clientes"
          value={Number(totClients)}
          icon={<Briefcase className="h-5 w-5" />}
          accentColor="violet"
        />
        <CardStat
          isLoading={isLoadingCard}
          title="Total de Contratos"
          value={Number(totContrats)}
          icon={<FileSignature className="h-5 w-5" />}
          accentColor="amber"
        />
      </div>

      <div className="col-span-12">
        <MonthlySalesChart monthlyContracts={monthlyContracts} monthlyDocs={monthlyDocs} />
      </div>

    </div>
  );
}
