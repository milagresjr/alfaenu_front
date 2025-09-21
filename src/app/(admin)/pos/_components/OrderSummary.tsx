"use client";

import { ServiceItemCart } from "@/features/pos/components/ServiceItemCart";
import { useDeleteItensServiceContrato, useItensServiceContrato } from "@/features/pos/hooks/usePOSQuery";
import { usePOSStore } from "@/features/pos/store/usePOSStore";
import { ItemServicContratoType } from "@/features/pos/types";
import { alert } from "@/lib/alert";
import { formatarMoeda } from "@/lib/helpers";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-toastify";

export function OrderSummary() {

    const { totalPago, totalPorPagar, subContaContrato, clienteContrato, setSaldoAtual } = usePOSStore();

    const { data: dataItensServiceContrato, isLoading: isLoadingItensServiceContrato } = useItensServiceContrato();

    const itensServicoContratoFiltrado = dataItensServiceContrato?.filter(
        (item) => (item.subconta_id === subContaContrato?.id && item.contract_id === clienteContrato?.id)
    );

    const itensServicoContratoFiltradoPorCliente = dataItensServiceContrato?.filter(
        (item) => (item.contract_id === clienteContrato?.id)
    );

    const Totalsaida = itensServicoContratoFiltradoPorCliente?.reduce(
        (acc, item) => acc + Number(item.servico_valor),
        0
    );

    const saida = itensServicoContratoFiltrado?.reduce(
        (acc, item) => acc + Number(item.servico_valor),
        0
    );

    const saldoTotal = Number(totalPago) - Number(Totalsaida);

    const deleteItemServico = useDeleteItensServiceContrato();

    const queryClient = useQueryClient();

    const handleDelete = async (service: ItemServicContratoType) => {
        const confirmed = await alert.confirm('Confirmar', 'Tem certeza que deseja excluir este serviço da lista?', 'Sim', 'Não');
        if (confirmed) {
            deleteItemServico.mutate(Number(service.id), {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["servicos"],
                        exact: false,
                    });
                    toast.success('Serviço excluído da lista com sucesso!');
                },
                onError: (error) => {
                    console.error("Erro ao excluir o Serviço:", error);
                },
            });
        }
    };

    useEffect(() => {
        setSaldoAtual(saldoTotal);
    }, [saldoTotal]);

    return (
        <div className="w-full bg-gray-200 dark:bg-gray-800 flex flex-col gap-2 justify-between h-[calc(100vh-400px)] md:h-[calc(100vh-170px)] md:w-[300px] rounded-md">
            
            <div className="flex-1 flex flex-col gap-2 overflow-auto custom-scrollbar p-4">
                {isLoadingItensServiceContrato ? (
                    <p className="text-center text-gray-700 dark:text-gray-300">Carregando...</p>
                ) : (
                    itensServicoContratoFiltrado?.map((item) => (
                        <ServiceItemCart key={item.id} item={item} onClickDelete={() => handleDelete(item)} />
                    ))
                )}
            </div>

            <div className="h-[100px] flex flex-col">
                <div className="flex flex-col px-4 py-2">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Total do serviço(s)</span>
                        <span className="text-gray-800 dark:text-gray-200 font-medium text-sm">
                            {formatarMoeda(Number(totalPorPagar))}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Pago</span>
                        <span className="text-gray-800 dark:text-gray-200 font-medium text-sm">
                            {formatarMoeda(Number(totalPago))}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Total de Saída</span>
                        <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                            {formatarMoeda(Number(Totalsaida)) || 0}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Saída p/Subconta</span>
                        <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                            {formatarMoeda(Number(saida)) || 0}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-center bg-blue-800 dark:bg-blue-900 py-3 px-4 text-center rounded-b-lg">
                    <span className="font-medium text-white text-lg">Saldo atual</span>
                    <span className="font-medium text-white text-lg">
                        {isNaN(saldoTotal) ? "0" : formatarMoeda(Number(saldoTotal))}
                    </span>
                </div>
            </div>
        </div>

    )
}