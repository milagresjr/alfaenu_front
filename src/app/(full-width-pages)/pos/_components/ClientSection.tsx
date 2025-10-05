"use client";

import { usePOSStore } from "@/features/pos/store/usePOSStore";
import { useEffect, useState } from "react";
import { XCircle, CheckCircle2, PauseCircle, PlayCircle } from "lucide-react";
import { useMovimentosBySubconta } from "@/features/movimento-subconta/hooks/useMovimentosQuery";
import { useItensServiceContrato } from "@/features/pos/hooks/usePOSQuery";
import { toast } from "react-toastify";
import { alert } from "@/lib/alert";
import { formatarMoeda } from "@/lib/helpers";
import { gerarPdfMovimentoSubcontaByPOS } from "@/lib/utils";
import LoadingDialog from "./LoadingDialog";
import { useQueryClient } from "@tanstack/react-query";


export function ClientSection() {
    const {
        clienteContrato,
        setClienteContrato,
        setSubContaContrato,
        subContaContrato,
        setTotalPago,
        setTotalPorPagar,

        itensServicesContrato,
        setItensServicesContrato
    } = usePOSStore();

    const { data, isLoading, isError } = useMovimentosBySubconta({ idSubconta: String(subContaContrato?.id), page: 1, per_page: 1000, search: '', filters: {} });

    const saldoTotalSubconta = data?.saldo_total || 0;

    const { data: dataItensServiceContrato, isLoading: isLoadingItensServiceContrato } = useItensServiceContrato();

    const itensServicoContratoFiltrado = dataItensServiceContrato?.filter(
        (item) => (item.subconta_id === subContaContrato?.id && item.contract_id === clienteContrato?.id)
    );

    const [loadingDoc, setLoadingDoc] = useState(false);

    const totalValor = itensServicesContrato.reduce((acc, item) => (
        acc + Number(item?.servico_valor) * Number(item?.qtd)
    ), 0);

    useEffect(() => {
        if (!clienteContrato) return;

        setTotalPago(Number(clienteContrato?.valor_pago ?? 0));
        setTotalPorPagar(Number(clienteContrato?.valor_por_pagar ?? 0));
    }, [clienteContrato, setTotalPago, setTotalPorPagar]);

    const itensServico = itensServicoContratoFiltrado?.map((item) => ({
        id: item.id,
        qtd: item.qtd,
        service_id: item.service_id,
        servico_nome: item.servico_nome,
        servico_tipo: item.servico_tipo,
        servico_valor: item.servico_valor,
        servico_valor_externo: item.servico_valor_externo,
        subconta_id: item.subconta_id,
    })) || [];

    const idContrato = itensServicoContratoFiltrado?.[0]?.contract_id ?? null;
    const idSubconta = itensServicoContratoFiltrado?.[0]?.subconta_id ?? null;

    const queryClient = useQueryClient();

    async function clearItensServicesContrato() {
        const { setItensServicesContrato } = usePOSStore.getState();

        const confirmed = await alert.confirm("Cancelar Documento", "Deseja cancelar o documento?", "Sim", "Não");

        if (confirmed) {
            // Define a lista como vazia
            setItensServicesContrato([]);
            setClienteContrato(null);
            setSubContaContrato(null);
        }
    }


    async function handleFinalizarDocumento() {

        const confirmed = await alert.confirm("Finalizar Documento", "Deseja finalizar o documento?", "Sim", "Não");

        if (confirmed) {

            if (Number(totalValor) > saldoTotalSubconta) {
                toast.error(
                    <div>
                        Saldo da subconta insuficiente! <br />
                        Saldo atual: <strong>{formatarMoeda(Number(saldoTotalSubconta))}</strong>
                    </div>
                );
                return;
            }

            const data = {
                itens: itensServicesContrato,
                contract_id: idContrato,
                subconta_id: idSubconta,
            }

            console.log(data);

            try {
                setLoadingDoc(true);
                await gerarPdfMovimentoSubcontaByPOS(data);
            } finally {
                queryClient.invalidateQueries({
                    queryKey: ['movimentos-subconta'],
                    exact: false
                });
                setLoadingDoc(false);
            }

        }
    }

    if (loadingDoc) {
        return (
            <LoadingDialog />
        )
    }

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

            <div className="flex justify-end gap-2 mt-4">
                <button onClick={clearItensServicesContrato} className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition">
                    <XCircle className="w-5 h-5" />
                    Cancelar
                </button>

                <button
                    onClick={handleFinalizarDocumento}
                    className="flex items-center gap-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
                    <CheckCircle2 className="w-5 h-5" />
                    Finalizar
                </button>

                {/* <button className="flex-1 flex items-center gap-2 px-4 py-2 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition">
                    <PauseCircle className="w-5 h-5" />
                    Suspender
                </button>

                <button className="flex-1 flex items-center gap-2 px-4 py-2 rounded bg-green-100 text-green-700 hover:bg-green-200 transition">
                    <PlayCircle className="w-5 h-5" />
                    Ativar
                </button> */}
            </div>

            <hr />
        </div >
    );
}
