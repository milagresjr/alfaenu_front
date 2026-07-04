'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileText, Download } from "lucide-react"

interface DocumentosDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clienteNome: string
  cursoNome: string
  onDownloadComprovativo: () => void
  onDownloadCertificado: () => void
  onDownloadPassaporte: () => void
  isLoadingComprovativo: boolean
  isLoadingCertificado: boolean
  isLoadingPassaporte: boolean
}

export function DocumentosDialog({
  open,
  onOpenChange,
  clienteNome,
  cursoNome,
  onDownloadComprovativo,
  onDownloadCertificado,
  onDownloadPassaporte,
  isLoadingComprovativo,
  isLoadingCertificado,
  isLoadingPassaporte,
}: DocumentosDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Documentos da Matrícula
          </DialogTitle>
          <DialogDescription>
            Documentos enviados por <strong>{clienteNome}</strong> para o curso <strong>{cursoNome}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium">Comprovativo de Pagamento</p>
                <p className="text-xs text-muted-foreground">Documento do comprovativo de pagamento</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDownloadComprovativo}
              disabled={isLoadingComprovativo}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {isLoadingComprovativo ? 'Baixando...' : 'Baixar'}
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium">Certificado de Habilitações</p>
                <p className="text-xs text-muted-foreground">Documento do certificado de habilitações</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDownloadCertificado}
              disabled={isLoadingCertificado}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {isLoadingCertificado ? 'Baixando...' : 'Baixar'}
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium">Passaporte</p>
                <p className="text-xs text-muted-foreground">Documento do passaporte</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDownloadPassaporte}
              disabled={isLoadingPassaporte}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {isLoadingPassaporte ? 'Baixando...' : 'Baixar'}
            </Button>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
