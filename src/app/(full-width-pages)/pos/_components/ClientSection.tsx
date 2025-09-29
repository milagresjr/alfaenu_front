"use client";

import { usePOSStore } from "@/features/pos/store/usePOSStore";
import { useEffect } from "react";
import { XCircle, CheckCircle2, PauseCircle, PlayCircle } from "lucide-react";


export function ClientSection() {
    const {
        clienteContrato,
        setClienteContrato,
        setSubContaContrato,
        subContaContrato,
        setTotalPago,
        setTotalPorPagar,
    } = usePOSStore();

    useEffect(() => {
        if (!clienteContrato) return;

        setTotalPago(Number(clienteContrato?.valor_pago ?? 0));
        setTotalPorPagar(Number(clienteContrato?.valor_por_pagar ?? 0));
    }, [clienteContrato, setTotalPago, setTotalPorPagar]);

    return (
        <div className="flex flex-col gap-2 px-4 pt-2 bg-white dark:bg-transparent rounded-t-md border border-gray-300 dark:border-gray-600 border-b-0">
            <div className="flex gap-2 items-center justify-end">
                Estado:
                <span
                    className={`
      px-3 py-1 rounded-full text-sm font-medium
      ${clienteContrato?.estado === "ativo" ? "bg-green-100 text-green-700" :
                            clienteContrato?.estado === "suspenso" ? "bg-yellow-100 text-yellow-700" :
                                clienteContrato?.estado === "finalizado" ? "bg-blue-100 text-blue-700" :
                                    clienteContrato?.estado === "cancelado" ? "bg-red-100 text-red-700" :
                                        "bg-gray-100 text-gray-700"
                        }
    `}
                >
                    {clienteContrato?.estado || ""}
                </span>
            </div>

            <div className="flex gap-2 mt-4">
                <button className="flex-1 flex items-center gap-2 px-4 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200 transition">
                    <XCircle className="w-5 h-5" />
                    Cancelar
                </button>

                <button className="flex-1 flex items-center gap-2 px-4 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition">
                    <CheckCircle2 className="w-5 h-5" />
                    Finalizar
                </button>

                <button className="flex-1 flex items-center gap-2 px-4 py-2 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition">
                    <PauseCircle className="w-5 h-5" />
                    Suspender
                </button>

                <button className="flex-1 flex items-center gap-2 px-4 py-2 rounded bg-green-100 text-green-700 hover:bg-green-200 transition">
                    <PlayCircle className="w-5 h-5" />
                    Ativar
                </button>
            </div>

            <hr />
        </div >
    );
}
