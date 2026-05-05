"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    CalendarDays,
    User,
    DollarSign,
    FileText,
    ArrowDownCircle,
    ArrowUpCircle,
    File,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { abrirCaixa } from "@/features/caixa/api/caixaApi";
import { useAbrirCaixa, useFecharCaixa, useGetCaixaAbertoByUser } from "@/features/caixa/hooks/useCaixaQuery";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { formatarDataHora, formatarMoeda } from "@/lib/helpers";
import { gerarPdfFechoCaixa } from "@/lib/utils";
import LoadingDialog from "@/app/(full-width-pages)/pos/_components/LoadingDialog";
import CaixaDialog from "@/features/caixa/components/CaixaDialog";
import CaixaTable from "./CaixaTable";

export function MeuCaixa() {

    const [openModalCaixa, setOpenModalCaixa] = useState(false);
    const [acao, setAcao] = useState<"abrir" | "fechar">("abrir");
    const [formData, setFormData] = useState({
        saldo: "",
        descricao: "",
    });

    const { user } = useAuthStore();

    const openCaixa = useAbrirCaixa();
    const closeCaixa = useFecharCaixa();

    const { data: dataCaixa } = useGetCaixaAbertoByUser(Number(user?.id) || 0);

    const [loadingPdfCaixa, setLoadingPdfCaixa] = useState(false);
    const movimentacoesCaixa = dataCaixa?.movimentacoes || [];

    // Calcular totais
    const totalEntradas = movimentacoesCaixa
        .filter((mov) => mov.tipo === "entrada")
        .reduce((sum, mov) => sum + Number(mov.valor), 0);

    const totalSaidas = movimentacoesCaixa
        .filter((mov) => mov.tipo === "saida")
        .reduce((sum, mov) => sum + Number(mov.valor), 0);

    const totalFaturado = 0; // Implementar se necessário

    const caixa = {
        utilizador: user?.nome, // "Milagres Marques",
        data_abertura: dataCaixa?.data_abertura, // "2025-10-10 09:30",
        data_fecho: dataCaixa?.data_fecho,
        saldo_inicial: dataCaixa?.saldo_inicial,
        saldo_final: dataCaixa?.saldo_final,
        estado: dataCaixa?.status === "aberto" ? "Aberto" : "Fechado", // "Fechado", // Ou "Aberto"
        total_faturado: 0,
        total_entradas: totalEntradas,
        total_saidas: totalSaidas,
    };

    const handleOpenModal = (tipo: "abrir" | "fechar") => {
        setAcao(tipo);
        setFormData({ saldo: "", descricao: "" });
        setOpenModalCaixa(true);
    };

    const queryClient = useQueryClient();

    const handleConfirm = () => {
        // if (acao === "abrir") {
        //     const data = {
        //         utilizador_id: user?.id,
        //         saldo_inicial: formData.saldo,
        //         descricao_abertura: formData.descricao
        //     }
        //     openCaixa.mutate(data, {
        //         onSuccess: () => {
        //             toast.success("Caixa aberto com sucesso!");
        //             queryClient.invalidateQueries({
        //                 queryKey: ["caixaAberto"],
        //                 exact: false
        //             });
        //         },
        //         onError: (error) => {
        //             toast.error("Erro ao abrir o caixa!");
        //             console.log(error);
        //         }
        //     })
        // } else {

        //     const data = {
        //         id: dataCaixa?.id,
        //         utilizador_id: user?.id,
        //         saldo_final: formData.saldo,
        //         descricao_fecho: formData.descricao
        //     }

        //     closeCaixa.mutate({ id: dataCaixa?.id || 0, itensCaixa: data }, {
        //         onSuccess: () => {
        //             toast.success("Caixa fechado com sucesso!");
        //             const idCaixa = dataCaixa?.id; // response?.data?.id;
        //             handleGerarPdfFechoCaixa(idCaixa);
        //             queryClient.invalidateQueries({
        //                 queryKey: ['caixaAberto'],
        //                 exact: false
        //             });
        //         },
        //         onError: (error) => {
        //             toast.error("Erro ao fechar o caixa!");
        //             console.log(error);
        //         }
        //     });

        // }

        setOpenModalCaixa(false);
    };

    return (
        <div className="dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="w-full ">
                <Card className="shadow-lg border dark:border-gray-800 bg-white dark:bg-gray-900 rounded-2xl">
                    {/* HEADER */}
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b dark:border-gray-700">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <div className="flex items-center">
                                <DollarSign className="w-6 h-6 text-green-500" />
                                Detalhes do Caixa
                            </div>
                            <Badge
                                variant="outline"
                                className={`px-3 py-1 text-sm ${caixa.estado === "Aberto"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                                    }`}
                            >
                                {caixa.estado}
                            </Badge>
                        </CardTitle>

                        <div className="flex items-center gap-3">


                            <Button
                                onClick={() =>
                                    handleOpenModal(
                                        caixa.estado === "Aberto" ? "fechar" : "abrir"
                                    )
                                }
                                variant={caixa.estado === "Aberto" ? "destructive" : "default"}
                                className="font-semibold"
                            >
                                {caixa.estado === "Aberto" ? "Fechar Caixa" : "Abrir Caixa"}
                            </Button>
                            <button>
                                <File />
                            </button>
                        </div>
                    </CardHeader>

                    {/* CONTENT */}
                    <CardContent className="mt-4 space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InfoBox
                                icon={<CalendarDays className="w-4 h-4" />}
                                label="Data de Abertura"
                                value={formatarDataHora(String(caixa.data_abertura))}
                            />
                            <InfoBox
                                icon={<CalendarDays className="w-4 h-4" />}
                                label="Data de Fecho"
                                value={formatarDataHora(String(caixa.data_fecho)) ?? "—"}
                            />
                            <InfoBox
                                icon={<DollarSign className="w-4 h-4" />}
                                label="Saldo Inicial"
                                value={caixa.saldo_inicial ? formatarMoeda(Number(caixa.saldo_inicial)) : "—"}
                            />
                            <InfoBox
                                icon={<DollarSign className="w-4 h-4" />}
                                label="Saldo Final"
                                value={
                                    caixa.saldo_final
                                        ? formatarMoeda(caixa.saldo_final)
                                        : "—"
                                }
                            />
                            {/* <InfoBox
                                icon={<FileText className="w-4 h-4" />}
                                label="Total Faturado"
                                value={formatCurrency(caixa.total_faturado)}
                            /> */}
                            <InfoBox
                                icon={<ArrowDownCircle className="w-4 h-4 text-green-500" />}
                                label="Total de Entradas"
                                value={formatarMoeda(Number(caixa.total_entradas))}
                            />
                            <InfoBox
                                icon={<ArrowUpCircle className="w-4 h-4 text-red-500" />}
                                label="Total de Saídas"
                                value={formatarMoeda(Number(caixa.total_saidas))}
                            />
                        </div>

                        <Separator className="dark:bg-gray-700" />

                        {/* <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Utilizador Responsável
                                </p>
                                <p className="text-lg font-semibold">{caixa.utilizador}</p>
                            </div>
                        </div> */}

                        <CaixaTable />

                    </CardContent>
                </Card>
            </div>

            {/* MODAL */}
            {/* <Dialog open={openModalCaixa} onOpenChange={setOpenModalCaixa}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {acao === "abrir" ? "Abrir Caixa" : "Fechar Caixa"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="saldo">
                                {acao === "abrir" ? "Saldo Inicial" : "Saldo Final"}
                            </Label>
                            <Input
                                id="saldo"
                                type="number"
                                placeholder="Insira o valor"
                                value={formData.saldo}
                                onChange={(e) =>
                                    setFormData({ ...formData, saldo: e.target.value })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descricao">Descrição</Label>
                            <Textarea
                                id="descricao"
                                placeholder={
                                    acao === "abrir"
                                        ? "Ex: Abertura do caixa do turno da manhã"
                                        : "Ex: Fecho do caixa do dia"
                                }
                                value={formData.descricao}
                                onChange={(e: any) =>
                                    setFormData({ ...formData, descricao: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenModalCaixa(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleConfirm}>
                            {acao === "abrir" ? "Abrir" : "Fechar"} Caixa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog> */}



            <CaixaDialog
                acao={acao}
                open={openModalCaixa}
                onOpenChange={setOpenModalCaixa}
                dataCaixa={dataCaixa}
            />
        </div>
    );
}

// COMPONENTE DE INFO REUTILIZÁVEL
function InfoBox({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}) {
    return (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-1 text-sm text-gray-500 dark:text-gray-300">
                {icon}
                {label}
            </div>
            <p className="text-lg font-semibold">{value}</p>
        </div>
    );
}

// FORMATAÇÃO DE MOEDA
function formatCurrency(value: number) {
    return value.toLocaleString("pt-AO", {
        style: "currency",
        currency: "AOA",
    });
}
