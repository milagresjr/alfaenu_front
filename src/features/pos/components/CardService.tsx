// CardService.tsx
import { ServiceType } from "@/features/service/types";
import { ImageIcon } from "lucide-react";

interface CardServiceProps {
  service: ServiceType;
  onClick?: () => void;
}

export function CardService({ service, onClick }: CardServiceProps) {
  return (
    <div
      onClick={onClick}
      className="rounded-md bg-white border border-gray-300 cursor-pointer flex flex-col min-h-[200px]"
    >
      {/* topo fixo */}
      <div className="flex justify-center items-center h-24 bg-gray-300">
        <ImageIcon className="text-gray-500" />
      </div>

      {/* corpo que cresce igualmente */}
      <div className="p-3 flex flex-col justify-between flex-1 overflow-hidden">
        <div className="flex flex-col overflow-hidden">
          <span className="text-xs text-gray-500 truncate">
            {service.categoria?.descricao || "-"}
          </span>
          <span className="font-medium text-sm text-gray-700 line-clamp-2">
            {service.nome}
          </span>
        </div>
        <h2 className="text-blue-600 font-bold text-sm">{service.valor}</h2>
      </div>
    </div>
  );
}
