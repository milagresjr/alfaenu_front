import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ServiceTypeType } from "../types";
import { useAlterarEstadoServicoType } from "../hooks/useServiceTypeQuery";


export function EstadoCell({ servicoType }: { servicoType: ServiceTypeType }) {


    const alterarEstado = useAlterarEstadoServicoType();
    const queryClient = useQueryClient();
    const toggleEstado = () => {
        alterarEstado.mutate({
            id: Number(servicoType.id),
            estado: servicoType.estado === "ativo" ? "inativo" : "ativo",
        },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["tipo-servicos"] });
                    toast.success('Estado alterado com sucesso!');
                },
                onError: (error) => {
                    console.error("Erro ao alterar o estado do cliente:", error);
                }
            }
        );
    };

    return (
        <span
            onClick={toggleEstado}
            className={`cursor-pointer px-2 py-1 rounded-full text-xs flex items-center justify-center gap-1 w-20
        ${servicoType.estado === "ativo"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
        >
            {alterarEstado.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
            ) : servicoType.estado === "ativo" ? (
                "Ativo"
            ) : (
                "Inativo"
            )}
        </span>
    );
}
