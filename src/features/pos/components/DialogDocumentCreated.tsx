"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { gerarPdfMovimentoSubconta } from "@/lib/utils";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onOpenContract?: () => void;
    onPrintDocument?: () => void;
};

export default function DialogDocumentCreated({
    open,
    onOpenChange,
    onPrintDocument
}: Props) {


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* Se quiser ter um trigger dentro do componente, descomente:
          <DialogTrigger asChild>
            <Button>Show dialog</Button>
          </DialogTrigger>
      */}
            <DialogContent className="max-w-lg sm:rounded-2xl p-6">
                <DialogHeader className="text-center">
                    <div className="mx-auto mb-4 w-20 h-20 flex items-center justify-center rounded-full bg-green-50 dark:bg-green-900/30">
                        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>

                    <DialogTitle className="text-center text-lg font-semibold">
                        Documento gerado com sucesso
                    </DialogTitle>
                    <DialogDescription className="text-center mt-2 text-sm text-muted-foreground dark:text-gray-300">
                        {`Deseja imprimir o documento?`}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="text-center mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">

                    <Button
                        onClick={onPrintDocument}
                        className="w-full sm:w-auto"
                        aria-label="Abrir contrato"
                    >
                        Imprimir
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={() => {
                            onOpenChange(false);
                        }}
                        className="w-full sm:w-auto"
                        aria-label="Fechar Dialog"
                    >
                        Fechar
                    </Button>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
