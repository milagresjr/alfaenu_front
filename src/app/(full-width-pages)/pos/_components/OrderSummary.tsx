"use client";

import { DropdownActions } from "@/components/dropdown-action-menu/drop-actions-menu";
import { useContratos } from "@/features/contract/hooks/useContractQuery";
import { ContratoType } from "@/features/contract/types";
import { useMovimentosBySubconta } from "@/features/movimento-subconta/hooks/useMovimentosQuery";
import { SelectClientPOS } from "@/features/pos/components/SelectClientPOS";
import { SelectContaPOS } from "@/features/pos/components/SelectContaPOS";
import { ServiceItemCart } from "@/features/pos/components/ServiceItemCart";
import { useDeleteItensServiceContrato, useItensServiceContrato } from "@/features/pos/hooks/usePOSQuery";
import { usePOSStore } from "@/features/pos/store/usePOSStore";
import { ItemServicContratoType } from "@/features/pos/types";
import { alert } from "@/lib/alert";
import { formatarMoeda } from "@/lib/helpers";
import { useQueryClient } from "@tanstack/react-query";
import { Info, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { QuantityDialog } from "./QuantityDialog";

export function OrderSummary() {

    const {
        totalPago,
        subContaContrato,
        clienteContrato,
        setSaldoAtual,
        setClienteContrato,
        setSubContaContrato,

        itensServicesContrato,
        setItensServicesContrato
    } = usePOSStore();

    const { data: dataContratos } = useContratos(1, 100000);


    const { data: dataItensServiceContrato, isLoading: isLoadingItensServiceContrato } = useItensServiceContrato();

    const { data, isLoading, isError } = useMovimentosBySubconta({ idSubconta: String(subContaContrato?.id), page: 1, per_page: 1000, search: '', filters: {} });

    const [openDialogQtd, setOpenDialogQtd] = useState(false);
    const [serviceSelected, setServiceSelected] = useState<ItemServicContratoType | null>(null);

    const saldoTotalSubconta = data?.saldo_total || 0;

    const totalEntradas = data?.total_entradas || 0;

    const totalSaidas = data?.total_saidas || 0;


    const itensServicoContratoFiltrado = dataItensServiceContrato?.filter(
        (item) => (item.subconta_id === subContaContrato?.id && item.contract_id === clienteContrato?.id)
    );

    const itensServicoContratoFiltradoPorSubConta = dataItensServiceContrato?.filter(
        (item) => (item.subconta_id === subContaContrato?.id)
    );

    const TotalsaidaPorSubConta = itensServicoContratoFiltradoPorSubConta?.reduce(
        (acc, item) => acc + Number(item.servico_valor),
        0
    );


    const contratoFiltradas = dataContratos?.data.filter((contrato) => contrato.id === clienteContrato?.id);
    const subContasFiltradas = contratoFiltradas?.[0]?.subcontas?.find(
        s => Number(s?.id) === Number(subContaContrato?.id)
    );

    const totalQtd = itensServicesContrato.reduce((acc, item) => (
        acc + Number(item?.qtd)
    ), 0);

    const totalValor = itensServicesContrato.reduce((acc, item) => (
        acc + Number(item?.servico_valor) * Number(item?.qtd)
    ), 0);

    const saldoTotal = Number(totalPago) - Number(TotalsaidaPorSubConta);

    function updateQtdServiceContrato(service_id: number, novaQtd: number) {
        const { itensServicesContrato, setItensServicesContrato } = usePOSStore.getState();

        const novaLista = itensServicesContrato.map((item) =>
            item.service_id === service_id
                ? { ...item, qtd: novaQtd }
                : item
        );

        setItensServicesContrato(novaLista);
    }

    function removeServiceContrato(service_id: number) {
        const { itensServicesContrato, setItensServicesContrato } = usePOSStore.getState();

        const novaLista = itensServicesContrato.filter(
            (item) => item.service_id !== service_id
        );

        setItensServicesContrato(novaLista);
    }

    async function clearItensServicesContrato() {
        const { setItensServicesContrato } = usePOSStore.getState();

        const confirmed = await alert.confirm("Limpar Carrinho", "Deseja limpar o carrinho?", "Sim", "Não");

        if (confirmed) {
            // Define a lista como vazia
            setItensServicesContrato([]);
        }
    }

    function handleQtdClick(service: ItemServicContratoType) {
        setServiceSelected(service)
        setOpenDialogQtd(true);
    }

    useEffect(() => {
        setSaldoAtual(saldoTotal);
    }, [saldoTotal]);

    return (
        <div className="w-full p-2 bg-gray-200 dark:bg-gray-800 flex flex-col gap-2 justify-start h-[calc(100vh-400px)] md:h-[calc(100vh-90px)] md:w-[400px] rounded-md">

            <div className="flex flex-col gap-2 border-b">
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
                    totalPorSubConta={saldoTotalSubconta}
                    saidaPorSubConta={totalSaidas}
                />
            </div>
            <div className="flex flex-col gap-2 overflow-auto custom-scrollbar p-2">
                {isLoadingItensServiceContrato ? (
                    <p className="text-center text-gray-700 dark:text-gray-300">Carregando...</p>
                ) : (
                    <>
                        {/* Resumo Totais */}
                        {itensServicesContrato && itensServicesContrato.length > 0 && (
                            <div className="w-full flex items-center justify-between">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button onClick={clearItensServicesContrato} className="cursor-pointer">
                                            <Trash size={15} />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Limpar carrinho</p>
                                    </TooltipContent>
                                </Tooltip>
                                <div className="flex items-center gap-2 p-2">
                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                        Qtd Total:{" "}
                                        <span className="font-semibold">
                                            {totalQtd}
                                        </span>
                                    </div>
                                    <span className="mx-1">|</span>
                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                        Total Geral:{" "}
                                        <span className="font-semibold">
                                            {formatarMoeda(totalValor)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tabela */}
                        <table className="w-full border-collapse rounded-xl overflow-hidden shadow-md">
                            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                <tr>
                                    <th className="p-2 text-sm text-left">Nome</th>
                                    <th className="p-2 text-sm text-center">Qtd</th>
                                    <th className="p-2 text-sm text-right">Total</th>
                                    <th className="p-2 text-sm text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itensServicesContrato?.map((item) => {
                                    const actions = [
                                        // {
                                        //     label: "Editar",
                                        //     icon: <Edit />,
                                        //     onClick: () => handleDelete(item),
                                        // },
                                        {
                                            label: "Excluir",
                                            icon: <Trash />,
                                            onClick: () => removeServiceContrato(Number(item.service_id)),
                                        },
                                        {
                                            label: "Qtd",
                                            icon: <Info />,
                                            onClick: () => handleQtdClick(item),
                                        },
                                    ];

                                    return (
                                        <tr
                                            key={item.id}
                                            className="border-b last:border-0 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                                        >
                                            <td className="p-2 text-sm text-gray-900 dark:text-gray-100">
                                                {item.servico_nome}
                                            </td>
                                            <td className="p-2 text-sm text-center text-gray-900 dark:text-gray-100">
                                                {item.qtd}
                                            </td>
                                            <td className="p-2 text-sm text-right text-gray-900 dark:text-gray-100">
                                                {formatarMoeda(Number(item.servico_valor) * Number(item.qtd))}
                                            </td>
                                            <td className="p-2 text-sm flex justify-center gap-2">
                                                <DropdownActions actions={actions} />
                                            </td>
                                        </tr>
                                    );
                                })}

                            </tbody>
                        </table>
                    </>

                )}
            </div>


            {/* <div className="h-[100px] flex flex-col">
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
            </div> */}

            <QuantityDialog
                open={openDialogQtd}
                onOpenChange={setOpenDialogQtd}
                produtoNome={serviceSelected?.servico_nome}
                qtdInicial={String(serviceSelected?.qtd)}
                onConfirm={(valor) => updateQtdServiceContrato(Number(serviceSelected?.service_id), Number(valor))}
            />
        </div>

    )
}