import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAlterarEstadoCliente } from "../hooks/useClientsQuery";
import { toast } from "react-toastify";
import { ClienteType } from "../types";


export function EstadoCell({ cliente }: { cliente: ClienteType }) {


    const alterarEstado = useAlterarEstadoCliente();
    const queryClient = useQueryClient();
    const toggleEstado = () => {
        alterarEstado.mutate({
            id: Number(cliente.id),
            estado: cliente.estado === "ativo" ? "inativo" : "ativo",
        },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["clientes"] });
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
        ${cliente.estado === "ativo"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
        >
            {alterarEstado.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
            ) : cliente.estado === "ativo" ? (
                "Ativo"
            ) : (
                "Inativo"
            )}
        </span>
    );
}
