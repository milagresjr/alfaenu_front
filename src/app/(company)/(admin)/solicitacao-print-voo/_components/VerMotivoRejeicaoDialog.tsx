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
import { XCircle } from "lucide-react"

interface VerMotivoRejeicaoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  motivo: string
  clienteNome: string
}

export function VerMotivoRejeicaoDialog({
  open,
  onOpenChange,
  motivo,
  clienteNome,
}: VerMotivoRejeicaoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            Motivo da Rejeição
          </DialogTitle>
          <DialogDescription>
            Solicitação de print de voo de <strong>{clienteNome}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700 dark:text-red-300">
            {motivo || 'Nenhum motivo foi informado.'}
          </p>
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
