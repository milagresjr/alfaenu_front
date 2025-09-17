import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ServiceType } from "../types";
import { useAlterarEstadoServico } from "../hooks/useServicesQuery";


export function EstadoCell({ servico }: { servico: ServiceType }) {


    const alterarEstado = useAlterarEstadoServico();
    const queryClient = useQueryClient();
    const toggleEstado = () => {
        alterarEstado.mutate({
            id: Number(servico.id),
            estado: servico.estado === "ativo" ? "inativo" : "ativo",
        },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["servicos"] });
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
        ${servico.estado === "ativo"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
        >
            {alterarEstado.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
            ) : servico.estado === "ativo" ? (
                "Ativo"
            ) : (
                "Inativo"
            )}
        </span>
    );
}
