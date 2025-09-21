
import { Search } from "lucide-react";

interface SearchItemProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchItem({ onChange }: SearchItemProps) {
    return (
        <div className="flex p-2 gap-2 rounded-md bg-gray-200 dark:bg-gray-800 items-center">
            <div className="flex items-center justify-center">
                <Search size={25} className="text-gray-500 dark:text-gray-400" />
            </div>
            <input
                onChange={onChange}
                placeholder="Pesquisar"
                type="search"
                className="flex-1 border-none placeholder:text-gray-600 dark:placeholder:text-gray-400 text-gray-600 dark:text-gray-200 outline-none bg-transparent text-lg"
            />
        </div>

    )
}