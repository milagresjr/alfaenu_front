"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useAbrirCaixa, useFecharCaixa } from "../hooks/useCaixaQuery";
import { gerarPdfAberturaCaixa, gerarPdfFechoCaixa } from "@/lib/utils";
import LoadingDialog from "@/app/(full-width-pages)/pos/_components/LoadingDialog";
import { useAuthStore } from "@/store/useAuthStore";

interface CaixaDialogProps {
    acao: "abrir" | "fechar";
    open: boolean;
    onOpenChange: (open: boolean) => void;
    dataCaixa?: any; // Pode tipar conforme seu modelo
}

export default function CaixaDialog({
    acao,
    open,
    onOpenChange,
    dataCaixa,
}: CaixaDialogProps) {

    const [formData, setFormData] = useState({ saldo: "", descricao: "" });
    const [loadingPdfCaixa, setLoadingPdfCaixa] = useState(false);

    const { user } = useAuthStore();

    const userId = user?.id;

    const caixaId = dataCaixa?.id;

    const openCaixa = useAbrirCaixa();
    const closeCaixa = useFecharCaixa();
    const queryClient = useQueryClient();

    const handleConfirm = () => {
        if (!formData.saldo) {
            toast.error("Informe o valor do saldo!");
            return;
        }

        if (acao === "abrir") {
            const data = {
                utilizador_id: userId,
                saldo_inicial: formData.saldo,
                descricao_abertura: formData.descricao,
            };
            openCaixa.mutate(data, {
                onSuccess: async (response: any) => {
                    toast.success("Caixa aberto com sucesso!");
                    const idCaixa = response.id;
                    await handleGerarPdfAberturaCaixa(idCaixa);
                    queryClient.invalidateQueries({ queryKey: ["caixaAberto"] });
                    onOpenChange(false);
                },
                onError: () => toast.error("Erro ao abrir o caixa!"),
            });
        } else {
            const data = {
                id: caixaId,
                utilizador_id: userId,
                saldo_final: formData.saldo,
                descricao_fecho: formData.descricao,
            };

            closeCaixa.mutate(
                { id: caixaId || 0, itensCaixa: data },
                {
                    onSuccess: async () => {
                        toast.success("Caixa fechado com sucesso!");
                        await handleGerarPdfFechoCaixa();
                        queryClient.invalidateQueries({ queryKey: ["caixaAberto"] });
                        onOpenChange(false);
                    },
                    onError: () => toast.error("Erro ao fechar o caixa!"),
                }
            );
        }
    };

    async function handleGerarPdfFechoCaixa() {
        try {
            setLoadingPdfCaixa(true);
            await gerarPdfFechoCaixa(caixaId);
        } finally {
            setLoadingPdfCaixa(false);
        }
    }

    async function handleGerarPdfAberturaCaixa(idCaixa: number | string) {
        try {
            setLoadingPdfCaixa(true);
            await gerarPdfAberturaCaixa(Number(idCaixa));
        } finally {
            setLoadingPdfCaixa(false);
        }
    }

    if (loadingPdfCaixa) return <LoadingDialog />;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md dark:bg-gray-900 dark:text-gray-100">
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
                            onChange={(e) =>
                                setFormData({ ...formData, descricao: e.target.value })
                            }
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirm}>
                        {acao === "abrir" ? "Abrir" : "Fechar"} Caixa
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
