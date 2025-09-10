
import { Search } from "lucide-react";


export function SearchItem() {
    return (
        <div className="flex p-2 gap-2 rounded-md bg-gray-200 items-center">
            <div className="flex items-center justify-center"><Search size={25} className="text-gray-500" /></div>
            <input placeholder="Pesquisar" type="search" className="flex-1 border-none placeholder:text-gray-600 text-gray-600 outline-none bg-transparent text-lg" />
        </div>
    )
}