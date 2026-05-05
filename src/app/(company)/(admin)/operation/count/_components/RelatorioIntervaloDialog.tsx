"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, FileText } from "lucide-react";
import { toast } from "react-toastify";

export function RelatorioIntervaloDialog({
    open,
    onOpenChange,
    onGerarRelatorio,
    isLoading
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onGerarRelatorio?: (datas: { data_inicial: string; data_final: string }) => void;
    isLoading?: boolean;
}) {
    const [intervalo, setIntervalo] = useState("hoje");
    const [dataInicial, setDataInicial] = useState("");
    const [dataFinal, setDataFinal] = useState("");

    const handleGerar = () => {
        // validação simples
        if (intervalo === "outro" && (!dataInicial || !dataFinal)) {
            toast.warning("Selecione as datas inicial e final!");
            return;
        }

        // define datas automaticamente se não for "outro"
        let inicio = dataInicial;
        let fim = dataFinal;
        const hoje = new Date();

        if (intervalo !== "outro") {
            switch (intervalo) {
                case "hoje":
                    inicio = fim = hoje.toISOString().slice(0, 10);
                    break;
                case "semanal": {
                    const inicioSemana = new Date(hoje);
                    inicioSemana.setDate(hoje.getDate() - 6);
                    inicio = inicioSemana.toISOString().slice(0, 10);
                    fim = hoje.toISOString().slice(0, 10);
                    break;
                }
                case "mensal": {
                    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
                    inicio = inicioMes.toISOString().slice(0, 10);
                    fim = hoje.toISOString().slice(0, 10);
                    break;
                }
                case "semestral": {
                    const inicioSem = new Date(hoje);
                    inicioSem.setMonth(hoje.getMonth() - 5);
                    inicio = inicioSem.toISOString().slice(0, 10);
                    fim = hoje.toISOString().slice(0, 10);
                    break;
                }
                case "anual": {
                    const inicioAno = new Date(hoje.getFullYear(), 0, 1);
                    inicio = inicioAno.toISOString().slice(0, 10);
                    fim = hoje.toISOString().slice(0, 10);
                    break;
                }
            }
        }

        if (onGerarRelatorio) {
            onGerarRelatorio({ data_inicial: inicio, data_final: fim });
        }

    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm rounded-2xl p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <DialogHeader className="text-center space-y-2">
                    <DialogTitle className="text-xl font-bold flex items-center justify-center gap-2">
                        <FileText className="w-5 h-5 text-cyan-600" />
                        Gerar Relatório de Conta
                    </DialogTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Selecione o intervalo de datas
                    </p>
                </DialogHeader>

                {/* SELECT DO INTERVALO */}
                <div className="space-y-2 mb-4">
                    <label className="text-sm font-medium">Intervalo</label>
                    <Select value={intervalo} onValueChange={setIntervalo}>
                        <SelectTrigger className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800">
                            <SelectValue placeholder="Selecione o intervalo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="hoje">Hoje / Diário</SelectItem>
                            <SelectItem value="semanal">Semanal</SelectItem>
                            <SelectItem value="mensal">Mensal</SelectItem>
                            <SelectItem value="semestral">Semestral</SelectItem>
                            <SelectItem value="anual">Anual</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* CAMPOS DE DATA SE "OUTRO" */}
                {intervalo === "outro" && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                            <label className="text-sm font-medium">Data Inicial</label>
                            <Input
                                type="date"
                                value={dataInicial}
                                onChange={(e) => setDataInicial(e.target.value)}
                                className="dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Data Final</label>
                            <Input
                                type="date"
                                value={dataFinal}
                                onChange={(e) => setDataFinal(e.target.value)}
                                className="dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                            />
                        </div>
                    </div>
                )}

                {/* BOTÃO DE GERAR RELATÓRIO */}
                <Button
                    onClick={handleGerar}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2 py-6 rounded-xl mt-2"
                    disabled={isLoading}
                >
                    <Calendar size={20} />
                    {isLoading ? "Gerando..." : "Gerar Relatório"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
