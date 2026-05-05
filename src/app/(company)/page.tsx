"use client";

import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import { CardStat } from "./(admin)/_dashboard/CardStat";
import { useCardStatData, useChartData } from "@/features/dashboard/hooks/useDashboardQuery";

// export const metadata: Metadata = {
//   title:
//     "Alfaenu",
//   description: "Alfaenu - Agência de viagens",
// };

export default function Dashboard() {

  const { data: dataCard, isError: errorCard, isLoading: isLoadingCard } = useCardStatData();
  const totUsers = dataCard?.totalUsers;
  const totDocuments = dataCard?.totalDocPOS;
  const totClients = dataCard?.totalClients;
  const totContrats = dataCard?.totalContracts;

  const { data: dataChart, isError: isErrorChart, isLoading: isLoadingChart } = useChartData();

  const monthlyContracts = dataChart?.monthlyContracts;
  const monthlyDocs = dataChart?.monthlyDocs;

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      
       <div className="grid grid-cols-4 gap-4 md:gap-6 col-span-12">
        <CardStat isLoading={isLoadingCard} title="Total de Usuários" value={Number(totUsers)} />
        <CardStat isLoading={isLoadingCard} title="Total de Documentos" value={Number(totDocuments)} />
        <CardStat isLoading={isLoadingCard} title="Total de Clientes" value={Number(totClients)} />
        <CardStat isLoading={isLoadingCard} title="Total de Contratos" value={Number(totContrats)} />
      </div>

      <div className="col-span-12">
        <MonthlySalesChart monthlyContracts={monthlyContracts} monthlyDocs={monthlyDocs} />
      </div> 

      {/* <div className="col-span-12 lg:col-span-6">
        <StatisticsChart />
      </div> */}

    </div>
  );
}
