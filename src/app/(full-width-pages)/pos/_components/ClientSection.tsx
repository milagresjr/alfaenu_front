"use client";

import { usePOSStore } from "@/features/pos/store/usePOSStore";
import { useEffect, useState } from "react";
import { XCircle, CheckCircle2, PauseCircle, PlayCircle, Plus, PlusCircle } from "lucide-react";
import { useMovimentosBySubconta } from "@/features/movimento-subconta/hooks/useMovimentosQuery";
import { useItensServiceContrato } from "@/features/pos/hooks/usePOSQuery";
import { toast } from "react-toastify";
import { alert } from "@/lib/alert";
import { formatarMoeda } from "@/lib/helpers";
import { gerarPdfMovimentoSubcontaByPOS } from "@/lib/utils";
import LoadingDialog from "./LoadingDialog";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { PaymentDialog } from "./PaymentDialog";
import DialogDocumentCreated from "@/features/pos/components/DialogDocumentCreated";


export function ClientSection() {
    const {
        clienteContrato,
        setClienteContrato,
        setSubContaContrato,
        subContaContrato,
        setTotalPago,
        setTotalPorPagar,

        descontoAplicado,
        setDescontoAplicado,

        itensServicesContrato,
        setItensServicesContrato,

        setOpenSheetAddService
    } = usePOSStore();

    const { user } = useAuthStore();

    const [openDialogDocumentCreated, setOpenDialogDocumentCreated] = useState(false);
    const [documentData, setDocumentData] = useState<any>(null);

    const [openPayment, setOpenPayment] = useState(false);

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

    const qtd = itensServicesContrato.length;

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

    const idContrato = clienteContrato?.id ?? null;
    const idSubconta = subContaContrato?.id ?? null;



    const queryClient = useQueryClient();

    async function clearItensServicesContrato() {
        const { setItensServicesContrato } = usePOSStore.getState();

        const confirmed = await alert.confirm("Cancelar Documento", "Deseja cancelar o documento?", "Sim", "Não");

        if (confirmed) {
            // Define a lista como vazia
            setItensServicesContrato([]);
            setClienteContrato(null);
            setSubContaContrato(null);
            setDescontoAplicado({
                tipo: "fixo",
                desconto: 0
            });
        }
    }


    async function handleFinalizarDocumento() {

        if (clienteContrato !== null && (Number(totalValor) > saldoTotalSubconta)) {
            toast.error(
                <div>
                    Saldo da subconta insuficiente! <br />
                    Saldo atual: <strong>{formatarMoeda(Number(saldoTotalSubconta))}</strong>
                </div>
            );
            return;
        }

        setOpenPayment(true);
        return;


    }

    async function handleConfirmPayment(dados: any) {

        const confirmed = await alert.confirm("Finalizar Documento", "Deseja finalizar o documento?", "Sim", "Não");

        if (confirmed) {
            // console.log("Pagamento confirmado ✅", dados);
            // return;
            const data = {
                utilizador_id: user?.id,
                desconto: descontoAplicado?.desconto || 0,
                itens: itensServicesContrato,
                contract_id: idContrato,
                subconta_id: idSubconta,
                forma_pagamento: dados.forma_pagamento,
                conta_financeira_id: dados.conta_bancaria
            }

            setDocumentData(data);
            setOpenPayment(false);
            setOpenDialogDocumentCreated(true);

            // console.log(data);
            // return;

        }


    };

    async function handleOpenPDF() {
        try {
            setLoadingDoc(true);
            await gerarPdfMovimentoSubcontaByPOS(documentData);
        } finally {
            queryClient.invalidateQueries({
                queryKey: ['movimentos-subconta'],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: ['caixaAberto'],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: ['mov-financeiras'],
                exact: false
            });
            setItensServicesContrato([]);
            setLoadingDoc(false);
        }
    }

    if (loadingDoc) {
        return (
            <LoadingDialog />
        )
    }

    return (
        <div className="flex flex-col gap-2 px-4 pt-2 bg-white dark:bg-transparent rounded-t-md border border-gray-300 dark:border-gray-600 border-b-0">
            <div className="hidden md:flex gap-2 items-center justify-end">
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
                <div className="hidden md:flex gap-2">
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
                </div>

                <div className="md:hidden">
                    <div className="fixed bottom-0 left-0 right-0 border-t pb-1 px-1  md:relative md:p-0 md:border-none md:bg-transparent">
                        <div className="flex flex-col sm:flex-row gap-1 w-full md:w-auto">
                            <div className="flex gap-1">
                                <button
                                    onClick={clearItensServicesContrato}
                                    className="flex items-center justify-center gap-2 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition flex-1 md:flex-none"
                                >
                                    <XCircle className="w-5 h-5" />
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => setOpenSheetAddService(true)}
                                    className="flex items-center justify-center gap-2 px-4 py-2 rounded bg-green-700 text-white hover:bg-green-800 transition flex-1 md:flex-none"
                                >
                                    <PlusCircle className="w-5 h-5" />
                                    Add serviço
                                </button>
                            </div>

                            <button
                                onClick={handleFinalizarDocumento}
                                className="flex items-center justify-center gap-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition flex-1 md:flex-none"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                Finalizar
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            <DialogDocumentCreated
                open={openDialogDocumentCreated}
                onOpenChange={setOpenDialogDocumentCreated}
                onPrintDocument={handleOpenPDF}
            />

            <PaymentDialog
                open={openPayment}
                onOpenChange={setOpenPayment}
                subtotal={totalValor}
                desconto={descontoAplicado?.desconto || 0}
                total={Number(totalValor) - Number(descontoAplicado?.desconto)}
                qtd={qtd}
                onConfirm={handleConfirmPayment}
            />

        </div >
    );
}
