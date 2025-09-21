"use client";

import { SelectClientPOS } from "@/features/pos/components/SelectClientPOS";
import { SelectContaPOS } from "@/features/pos/components/SelectContaPOS";
import { usePOSStore } from "@/features/pos/store/usePOSStore";
import { useEffect } from "react";

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

            <div className="flex flex-col md:flex-row gap-2">
                <SelectClientPOS
                    selectedClienteContrato={clienteContrato}
                    onSelectClienteContrato={(clienteContratoSelected) =>
                        setClienteContrato(clienteContratoSelected)
                    }
                    error={!clienteContrato}
                />
                <SelectContaPOS
                    selectedSubconta={subContaContrato}
                    onSelectSubconta={(subContaSelected) =>
                        setSubContaContrato(subContaSelected)
                    }
                    error={!subContaContrato}
                />
            </div>
            <hr />
        </div>
    );
}
