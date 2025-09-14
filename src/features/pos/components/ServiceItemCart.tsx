import { Trash } from "lucide-react";
import { ItemServicContratoType } from "../types";

interface ServiceItemCartProps {
    item: ItemServicContratoType;
    onClickDelete?: () => void;
}

export function ServiceItemCart({ item, onClickDelete }: ServiceItemCartProps) {

    return (
        <div className="flex flex-wrap gap-2 p-3 bg-white rounded-lg justify-between items-center border-l-2 border-blue-600">
            <div className="flex gap-2 items-center">
                <div className="flex w-4 h-4 text-xs bg-blue-600 text-white items-center justify-center rounded-lg">
                    
                </div>
                <span className="text-sm text-gray-500">{ item.servico_nome }</span>
            </div>
            <div className="flex gap-2 items-center">
                <span className="text-sm">{ item.servico_valor }</span>
                <Trash onClick={onClickDelete} size={14} className="text-red-600 cursor-pointer" />
            </div>
        </div>
    )
}