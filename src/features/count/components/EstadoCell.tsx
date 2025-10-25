import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CountType } from "../types";
import { useAlterarEstadoCount } from "../hooks/useCountQuery";


export function EstadoCell({ conta }: { conta: CountType }) {


    const alterarEstado = useAlterarEstadoCount();
    const queryClient = useQueryClient();
    const toggleEstado = () => {
        alterarEstado.mutate({
            id: Number(conta.id),
            estado: conta.estado === "ativo" ? "inativo" : "ativo",
        },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["contas"] });
                    toast.success('Estado alterado com sucesso!');
                },
                onError: (error) => {
                    console.error("Erro ao alterar o estado da conta:", error);
                }
            }
        );
    };

    return (
        <span
            onClick={toggleEstado}
            className={`cursor-pointer px-2 py-1 rounded-full text-xs flex items-center justify-center gap-1 w-20
        ${conta.estado === "ativo"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
        >
            {alterarEstado.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
            ) : conta.estado === "ativo" ? (
                "Ativo"
            ) : (
                "Inativo"
            )}
        </span>
    );
}
