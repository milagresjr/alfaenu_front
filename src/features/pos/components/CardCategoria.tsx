import { ServiceTypeType } from "@/features/service-type/types"
import { usePOSStore } from "../store/usePOSStore";


interface CardCategoriaProps {
    categoria: ServiceTypeType;
    selected?: boolean;
}

export function CardCategoria({ categoria, selected = false }: CardCategoriaProps) {

    const { setCategoriaSelected } = usePOSStore();

    function handleClick() {
        setCategoriaSelected(categoria);
    }

    return (
        <div
            onClick={handleClick}
            className={`
    px-3 py-2 rounded-md cursor-pointer transition-colors duration-200
    ${selected
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }
  `}
        >
            <span className="text-sm font-medium">{categoria.descricao}</span>
        </div>

    )
}