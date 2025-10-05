"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, XCircle, Save } from "lucide-react";

export function QuantityDialog({
    open,
    onOpenChange,
    produtoNome = "Produto",
    onConfirm,
    qtdInicial
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    produtoNome?: string;
    onConfirm?: (valor: string) => void;
    qtdInicial: string;
}) {
    const [valor, setValor] = useState("");

    const addNumero = (num: string) => setValor((prev) => prev + num);
    const limpar = () => setValor("");
    const gravar = () => {
        if (onConfirm) onConfirm(valor);
        setValor("");
        onOpenChange(false);
    };

    const botoes = [
        "1", "2", "3",
        "4", "5", "6",
        "7", "8", "9",
        "0", ",", "00",
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm rounded-2xl p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <DialogHeader className="text-center space-y-2">
                    <DialogTitle className="text-xl font-bold">
                        {produtoNome} - {qtdInicial}
                    </DialogTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Inserção de Quantidade
                    </p>
                </DialogHeader>

                {/* Campo de texto */}
                <Input
                    value={valor}
                    placeholder="Quantidade"
                    //   readOnly
                    onChange={(e) => setValor(e.target.value)}
                    className="text-center text-lg font-medium mt-2 mb-4 border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                />

                {/* Teclado numérico */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    {botoes.map((num) => (
                        <Button
                            key={num}
                            variant="default"
                            onClick={() => addNumero(num)}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-lg py-6"
                        >
                            {num}
                        </Button>
                    ))}
                </div>

                {/* Botões de ação */}
                <div className="grid grid-cols-3 gap-3">
                    <Button
                        onClick={gravar}
                        className="bg-green-600 hover:bg-green-700 text-white flex flex-col items-center py-8"
                    >
                        <Save size={20} />
                        Gravar
                    </Button>
                    <Button
                        onClick={limpar}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 flex flex-col items-center py-8"
                    >
                        <Trash2 size={20} />
                        Limpar
                    </Button>
                    <Button
                        onClick={() => onOpenChange(false)}
                        className="bg-red-600 hover:bg-red-700 text-white flex flex-col items-center py-8"
                    >
                        <XCircle size={20} />
                        Cancelar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
