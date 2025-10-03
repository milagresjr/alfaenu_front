"use client";

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
import { Edit2, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "react-toastify";

export function OrderSummary() {

    const {
        totalPago,
        subContaContrato,
        clienteContrato,
        setSaldoAtual,
        setClienteContrato,
        setSubContaContrato
    } = usePOSStore();

    const { data: dataContratos } = useContratos(1, 100000);


    const { data: dataItensServiceContrato, isLoading: isLoadingItensServiceContrato } = useItensServiceContrato();

    const { data, isLoading, isError } = useMovimentosBySubconta({ idSubconta: String(subContaContrato?.id), page: 1, per_page: 1000, search: '', filters: {} });

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

    const totalServicos = subContasFiltradas?.servicos?.reduce(
        (acc, servico: any) => acc + Number(servico.servico_valor),
        0
    );

    const saldoTotal = Number(totalPago) - Number(TotalsaidaPorSubConta);

    const deleteItemServico = useDeleteItensServiceContrato();

    const queryClient = useQueryClient();

    const handleDelete = async (service: ItemServicContratoType) => {
        // const confirmed = await alert.confirm('Confirmar', 'Tem certeza que deseja excluir este serviço da lista?', 'Sim', 'Não');

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

    };

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
                        {itensServicoContratoFiltrado && itensServicoContratoFiltrado.length > 0 && (
                            <div className="w-full flex items-center justify-end">
                                <div className="flex items-center gap-2 p-2">
                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                        Qtd Total:{" "}
                                        <span className="font-semibold">
                                            {itensServicoContratoFiltrado.reduce(
                                                (acc, item) => acc + Number(item.qtd || 0),
                                                0
                                            )}
                                        </span>
                                    </div>
                                    <span className="mx-1">|</span>
                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                        Total Geral:{" "}
                                        <span className="font-semibold">
                                            {formatarMoeda(
                                                itensServicoContratoFiltrado.reduce(
                                                    (acc, item) => acc + Number(item.total || 0),
                                                    0
                                                ) || 0
                                            )}
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
                                {itensServicoContratoFiltrado?.map((item) => (
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
                                            {formatarMoeda(Number(item.total))}
                                        </td>
                                        <td className="p-2 text-sm flex justify-center gap-2">
                                            <Trash2
                                                onClick={() => handleDelete(item)}
                                                className="text-red-500 cursor-pointer hover:text-red-600 transition"
                                                size={15}
                                            />
                                        </td>
                                    </tr>
                                ))}
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
        </div>

    )
}