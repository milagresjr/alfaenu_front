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
import { CheckCircle } from "lucide-react"

interface AprovarPrintVooDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isLoading?: boolean
  clienteNome: string
}

export function AprovarPrintVooDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  clienteNome,
}: AprovarPrintVooDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Confirmar Aprovação
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja aprovar a solicitação de print de voo de{' '}
            <strong>{clienteNome}</strong>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
            {isLoading ? 'Aprovando...' : 'Sim, Aprovar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
