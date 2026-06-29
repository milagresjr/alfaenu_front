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
import { FileText } from "lucide-react"
import { toast } from "react-toastify"

interface VerComprovativoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comprovativoUrl?: string
  comprovativoNome?: string
  clienteNome: string
}

export function VerComprovativoDialog({
  open,
  onOpenChange,
  comprovativoUrl,
  comprovativoNome,
  clienteNome,
}: VerComprovativoDialogProps) {
  const handleDownload = () => {
    if (!comprovativoUrl) {
      toast.error('URL do comprovativo não disponível.')
      return
    }
    const a = document.createElement('a')
    a.href = comprovativoUrl
    a.download = comprovativoNome || 'comprovativo'
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Comprovativo
          </DialogTitle>
          <DialogDescription>
            Comprovativo da solicitação de <strong>{clienteNome}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <FileText className="h-12 w-12 text-primary" />
          <p className="text-sm font-medium">{comprovativoNome || 'Comprovativo'}</p>
          {comprovativoUrl && (
            <Button
              type="button"
              variant="outline"
              onClick={handleDownload}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Baixar Comprovativo
            </Button>
          )}
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
