'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { XCircle } from "lucide-react"

interface RejeitarSeguroViagemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (motivo: string) => void
  isLoading?: boolean
  clienteNome: string
}

export function RejeitarSeguroViagemDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  clienteNome,
}: RejeitarSeguroViagemDialogProps) {
  const [motivo, setMotivo] = useState('')

  const handleConfirm = () => {
    onConfirm(motivo)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            Rejeitar Solicitação
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja rejeitar a solicitação de seguro de viagem de{' '}
            <strong>{clienteNome}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-sm font-medium">Motivo da Rejeição</label>
          <Textarea
            placeholder="Descreva o motivo da rejeição..."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            rows={4}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading} variant="destructive">
            {isLoading ? 'Rejeitando...' : 'Sim, Rejeitar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
