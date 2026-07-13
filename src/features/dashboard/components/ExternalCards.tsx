import { Layers, Users, Clock, FileCheck } from "lucide-react";
import { ExternalDashboardData } from "../api/dashboardApi";

interface ExternalCardsProps {
  data: ExternalDashboardData | undefined;
  isLoading: boolean;
}

const colorMap: Record<string, { from: string; iconBg: string; ring: string }> = {
  blue: {
    from: "from-blue-500/10 via-blue-500/5 to-transparent",
    iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    ring: "ring-blue-500/20",
  },
  emerald: {
    from: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-500/20",
  },
  amber: {
    from: "from-amber-500/10 via-amber-500/5 to-transparent",
    iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    ring: "ring-amber-500/20",
  },
  violet: {
    from: "from-violet-500/10 via-violet-500/5 to-transparent",
    iconBg: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    ring: "ring-violet-500/20",
  },
};

export function ExternalCards({ data, isLoading }: ExternalCardsProps) {
  const cards = [
    {
      title: "Meus Processos Ativos",
      value: data?.totalActiveProcesses ?? 0,
      icon: <Layers className="h-5 w-5" />,
      color: "blue",
    },
    {
      title: "Meus Clientes",
      value: data?.totalMyClients ?? 0,
      icon: <Users className="h-5 w-5" />,
      color: "emerald",
    },
    {
      title: "Documentos Pendentes",
      value: data?.pendingDocuments ?? 0,
      icon: <Clock className="h-5 w-5" />,
      color: "amber",
    },
    {
      title: "Processos Concluídos",
      value: 0,
      icon: <FileCheck className="h-5 w-5" />,
      color: "violet",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 col-span-12">
      {cards.map((card) => {
        const c = colorMap[card.color];
        return (
          <div
            key={card.title}
            className={`relative flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md dark:border-white/[0.08] dark:bg-gray-900 ${c.ring} ring-1`}
          >
            <div className={`pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b ${c.from}`} />
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {card.title}
              </span>
              <div className={`flex items-center justify-center rounded-lg p-2 ${c.iconBg}`}>
                {card.icon}
              </div>
            </div>
            <div className="relative">
              {isLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              ) : (
                <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {card.value.toLocaleString("pt-PT")}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
