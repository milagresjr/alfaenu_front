import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CheckCircle, Download, ExternalLink } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onDownload: () => void;
  onOpenPdf: () => void;
  filename?: string;
};

export default function ContractFinalizadoDialog({ open, onClose, onDownload, onOpenPdf, filename = "Contrato.pdf" }: Props) {
  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) onClose(); }}>
      <DialogContent className="sm:max-w-lg w-full p-6 z-9999">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <DialogHeader className="p-0 m-0">
                <DialogTitle className="text-lg font-semibold">Contrato Finalizado com sucesso</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">O que deseja fazer agora?</DialogDescription>
              </DialogHeader>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <p className="text-sm text-muted-foreground">Seu contrato foi finalizado e registrado com sucesso. Você pode baixar o PDF para armazenamento ou abrir diretamente para visualizar.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" className="w-full justify-center gap-2" onClick={onOpenPdf}>
              <ExternalLink className="h-4 w-4" />
              Abrir PDF
            </Button>

            <Button className="w-full justify-center gap-2" onClick={onDownload}>
              <Download className="h-4 w-4" />
              Baixar PDF
            </Button>
          </div>
        </div>

        <DialogFooter className="mt-6 p-0">
          <div className="flex items-center justify-end w-full">
            {/* <div className="text-xs text-muted-foreground">Arquivo: <span className="font-medium">{filename}</span></div> */}
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose}>Fechar</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
