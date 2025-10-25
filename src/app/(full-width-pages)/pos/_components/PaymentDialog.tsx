"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Save, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useCounts } from "@/features/count/hooks/useCountQuery";

interface PaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    subtotal: number;
    desconto: number;
    total: number;
    qtd?: number;
    onConfirm?: (dados: {
        forma_pagamento: string;
        conta_bancaria?: string;
        subtotal: number;
        desconto: number;
        total: number;
    }) => void;
}

export function PaymentDialog({
    open,
    onOpenChange,
    subtotal,
    desconto,
    total,
    qtd,
    onConfirm,
}: PaymentDialogProps) {
    const [formaPagamento, setFormaPagamento] = useState("numerario");
    const [valorRecebido, setValorRecebido] = useState("");
    const [contaBancaria, setContaBancaria] = useState("");

    const { data: dataContas } = useCounts();
    const contaCaixa = dataContas?.data.filter((item) => (
        item.tipo === "caixa"
    ))[0];


    // 👉 Função para lidar com a troca da forma de pagamento
    const handleFormaPagamentoChange = (valor: string) => {
        setFormaPagamento(valor);
        // Limpa a conta bancária se for numerário
        if (valor === "numerario") setContaBancaria("");
    };

    const aplicar = () => {

        if (formaPagamento !== "numerario" && !contaBancaria) {
            toast.warning("Selecione a conta bancária!");
            return;
        }

        if (onConfirm) {
            onConfirm({
                forma_pagamento: formaPagamento,
                conta_bancaria: contaBancaria || String(contaCaixa?.id),
                subtotal,
                desconto,
                total,
            });
        }

        // resetar
        // setValorRecebido("");
        // setContaBancaria("");
        // onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm rounded-2xl p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader className="text-center space-y-2">
                    <DialogTitle className="text-xl font-bold">
                        Finalizar Pagamento
                    </DialogTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Insira as informações do pagamento
                    </p>
                </DialogHeader>

                {/* Forma de Pagamento */}
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 block">
                        Forma de Pagamento
                    </label>
                    <Select value={formaPagamento} onValueChange={handleFormaPagamentoChange}>
                        <SelectTrigger className="w-full dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                            <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800">
                            <SelectItem value="numerario">Numerário</SelectItem>
                            <SelectItem value="transferencia">Transferência</SelectItem>
                            <SelectItem value="TPA">TPA</SelectItem>
                            <SelectItem value="deposito">Depósito Bancário</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Select de Conta Bancária */}
                {formaPagamento !== "numerario" && (
                    <div className="mb-4">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 block">
                            Conta Bancária
                        </label>
                        <Select value={contaBancaria} onValueChange={setContaBancaria}>
                            <SelectTrigger className="w-full dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                                <SelectValue placeholder="Selecione a conta..." />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-gray-800">
                                {
                                    dataContas?.data.map((item, index) => (
                                        <SelectItem key={index} value={String(item.id)}>{item.nome}</SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Totais */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">Quantidade</label>
                        <Input
                            value={qtd}
                            readOnly
                            className="dark:bg-gray-800 text-right"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">Subtotal</label>
                        <Input
                            value={subtotal.toFixed(2)}
                            readOnly
                            className="dark:bg-gray-800 text-right"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">Desconto</label>
                        <Input
                            value={desconto.toFixed(2)}
                            readOnly
                            className="dark:bg-gray-800 text-right"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">Total a Pagar</label>
                        <Input
                            value={total.toFixed(2)}
                            readOnly
                            className="dark:bg-gray-800 text-right font-semibold"
                        />
                    </div>
                    {/* <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">Valor Recebido</label>
                        <Input
                            value={valorRecebido}
                            // onChange={(e) => setValorRecebido(e.target.value)}
                            placeholder="0,00"
                            className="dark:bg-gray-800 text-right"
                        />
                    </div> */}
                </div>

                {/* Botões */}
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        onClick={aplicar}
                        className="bg-green-600 hover:bg-green-700 text-white flex flex-col items-center py-6"
                    >
                        <Save size={20} />
                        Concluir
                    </Button>
                    <Button
                        onClick={() => onOpenChange(false)}
                        className="bg-red-600 hover:bg-red-700 text-white flex flex-col items-center py-6"
                    >
                        <XCircle size={20} />
                        Cancelar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
