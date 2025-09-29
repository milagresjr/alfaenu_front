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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { gerarPdfContrato } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenContract?: () => void;
  onPrintContract?: () => void;
  contractName?: string;
  idContract?: number;
};

export default function DialogContratoCreated({
  open,
  onOpenChange,
  onOpenContract,
  onPrintContract,
  contractName = "Contrato",
  idContract,
}: Props) {

  const [loading, setLoading] = useState(false);

  const handlePrint = async () => {
    try {
      setLoading(true);
      await gerarPdfContrato(idContract);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao imprimir contrato:", error);
    } finally {
      setLoading(false);
    }
  };

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
            Contrato criado com sucesso
          </DialogTitle>
          <DialogDescription className="text-center mt-2 text-sm text-muted-foreground dark:text-gray-300">
            {`Deseja imprimir o ${contractName}?`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="text-center mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">

          <Button
            onClick={handlePrint}
            className="w-full sm:w-auto"
            aria-label="Abrir contrato"
          >
            {loading ? "Imprimindo..." : "Imprimir"}
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
