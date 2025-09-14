import { ServiceType } from "@/features/service/types";
import { ImageIcon } from "lucide-react";


interface CardServiceProps {
    service: ServiceType;
    onClick?: () => void;
}

export function CardService({ service, onClick }: CardServiceProps) {
    return (
        <div onClick={onClick} className="rounded-md bg-white border border-gray-300 h-[180px] cursor-pointer">
            <div className="flex justify-center items-center h-[50%] bg-gray-300">
                <ImageIcon className="text-gray-500" />
            </div>
            <div className="p-3 flex flex-col justify-between gap-2">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500">{service.categoria?.descricao || '-'}</span>
                    <span className="font-medium text-sm text-gray-700">{service.nome}</span>
                </div>
                <h2 className="text-blue-600 font-bold text-sm">{service.valor}</h2>
            </div>
        </div>
    )
}