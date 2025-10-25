"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Save, XCircle, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";

export function DiscountDialog({
    open,
    onOpenChange,
    produtoNome = "Produto",
    precoUnitario = 0,
    onConfirm,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    produtoNome?: string;
    precoUnitario?: number;
    onConfirm?: (valor: { tipo: "fixo" | "percentual"; desconto: number }) => void;
}) {
    const [tipoDesconto, setTipoDesconto] = useState<"fixo" | "percentual">("fixo");
    const [valor, setValor] = useState("");

    // Limpa o input ao trocar o tipo de desconto
    useEffect(() => {
        setValor("");
    }, [tipoDesconto]);

    const addNumero = (num: string) => {
        if (tipoDesconto === "percentual" && valor.length >= 3) return; // limite de 3 dígitos
        setValor((prev) => prev + num);
    };

    const limpar = () => setValor("");

    const aplicar = () => {
        const descontoNum = parseFloat(valor.replace(",", "."));
        if (isNaN(descontoNum) || descontoNum <= 0) {
            toast.warning("Valor de desconto inválido!");
            return;
        }

        if (tipoDesconto === "percentual" && (descontoNum < 1 || descontoNum > 100)) {
            toast.warning("Desconto percentual deve estar entre 1% e 100%");
            return;
        }

        //Se o desconto for maior que o preço unitário
        if (tipoDesconto === "fixo" && descontoNum > precoUnitario) {
            toast.warning("Desconto não pode ser maior que o total geral");
            return;
        }

        //se desconto for percentual converte para valor fixo e verifique se é maior que o preço unitário
        if (tipoDesconto === "percentual") {
            const descontoCalculado = (precoUnitario * descontoNum) / 100;
            if (descontoCalculado > precoUnitario) {
                toast.warning("Desconto não pode ser maior que o total geral");
                return;
            }
        }

        // ✅ Calcula valor fixo se for percentual
        const descontoFinal =
            tipoDesconto === "percentual"
                ? (precoUnitario * descontoNum) / 100
                : descontoNum;

        if (onConfirm)
            onConfirm({ tipo: tipoDesconto, desconto: Number(descontoFinal.toFixed(2)) });

        setValor("");
        onOpenChange(false);
    };

    const botoes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ",", "00"];

    const valorFixoKz =
        tipoDesconto === "percentual"
            ? ((precoUnitario * parseFloat(valor.replace(",", "."))) / 100 || 0).toFixed(2)
            : null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm rounded-2xl p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <DialogHeader className="text-center space-y-1">
                    <DialogTitle className="text-xl font-bold">
                        Aplicar Desconto
                    </DialogTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Selecione o tipo e insira o valor do desconto
                    </p>
                </DialogHeader>

                {/* Tipo de desconto */}
                <div className="flex justify-center gap-6 my-4">
                    <RadioGroup value={tipoDesconto} onValueChange={(v) => setTipoDesconto(v as any)}>
                        <div className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="fixo" id="fixo" />
                                <label htmlFor="fixo" className="cursor-pointer">
                                    Fixo (Kz)
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="percentual" id="percentual" />
                                <label htmlFor="percentual" className="cursor-pointer">
                                    Percentual (%)
                                </label>
                            </div>
                        </div>
                    </RadioGroup>
                </div>


                {/* Mostrar valor em Kz se percentual */}
                {tipoDesconto === "percentual" && (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 -m-6">
                        Valor equivalente:{" "}
                        <span className="font-semibold">{valorFixoKz} Kz</span>
                    </p>
                )}


                {/* Campo de valor */}
                <Input
                    value={valor}
                    placeholder={tipoDesconto === "fixo" ? "Desconto (Kz)" : "Desconto (%)"}
                    onChange={(e) => {
                        const val = e.target.value.replace(/[^\d,]/g, "");
                        if (tipoDesconto === "percentual" && val.replace(",", "").length > 3) return;
                        setValor(val);
                    }}
                    className="text-center text-lg font-medium mt-2 mb-1 border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                />

                {/* Teclado numérico */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    {botoes.map((num) => (
                        <Button
                            key={num}
                            onClick={() => addNumero(num)}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-lg py-6"
                        >
                            {num}
                        </Button>
                    ))}
                </div>

                {/* Botões de ação */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Button
                        onClick={aplicar}
                        className="bg-green-600 hover:bg-green-700 text-white flex flex-col items-center py-6"
                    >
                        <Save size={20} />
                        Aplicar
                    </Button>
                    <Button
                        onClick={limpar}
                        className=" bg-gray-500 hover:bg-gray-600 text-white font-semibold py-6 flex flex-col items-center"
                    >
                        <RotateCcw size={18} /> Limpar
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
