import { ImageIcon } from "lucide-react";


export function CardService() {
    return (
        <div className="rounded-md bg-white border border-gray-300 h-[180px] cursor-pointer">
            <div className="flex justify-center items-center h-[50%] bg-gray-300">
                <ImageIcon className="text-gray-500" />
            </div>
            <div className="p-3 flex flex-col justify-between gap-2">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Computador</span>
                    <span className="font-medium text-sm text-gray-700">Visto Nacional</span>
                </div>
                <h2 className="text-blue-600 font-bold text-sm">35.000,00 kz</h2>
            </div>
        </div>
    )
}