// CardService.tsx
import { ServiceType } from "@/features/service/types";
import { formatarMoeda } from "@/lib/helpers";
import { ImageIcon } from "lucide-react";

interface CardServiceProps {
  service: ServiceType;
  onClick?: () => void;
  disabled?: boolean;
}

export function CardService({ service, onClick, disabled }: CardServiceProps) {
  return (
    <div
      onClick={onClick}
      className={`
    rounded-md border flex flex-col min-h-[200px] 
    bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-700
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-md transition"}
  `}
    >
      {/* topo fixo */}
      <div className="flex justify-center items-center h-24 bg-gray-300 dark:bg-gray-700">
        <ImageIcon className="text-gray-500 dark:text-gray-400" />
      </div>

      {/* corpo que cresce igualmente */}
      <div className="p-3 flex flex-col justify-between flex-1 overflow-hidden">
        <div className="flex flex-col overflow-hidden">
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {service.categoria?.descricao || "-"}
          </span>
          <span className="font-medium text-sm text-gray-700 dark:text-gray-200 line-clamp-2">
            {service.nome}
          </span>
        </div>
        <h2 className="text-blue-600 dark:text-blue-400 font-bold text-sm">
          {formatarMoeda(Number(service.valor))}
        </h2>
      </div>
    </div>

  );
}
