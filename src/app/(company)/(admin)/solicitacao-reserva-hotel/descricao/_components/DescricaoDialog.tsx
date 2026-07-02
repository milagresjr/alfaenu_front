'use client'

import { useState, useEffect } from "react"
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
import { FileText, Info } from "lucide-react"
import { SolicitacaoReservaHotelDescricaoType } from "@/features/solicitacao-reserva-hotel/types"

interface DescricaoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: { descricao: string; status: boolean }, id?: string) => void
  descricao?: SolicitacaoReservaHotelDescricaoType | null
  isLoading?: boolean
}

export function DescricaoDialog({
  open,
  onOpenChange,
  onSave,
  descricao,
  isLoading,
}: DescricaoDialogProps) {
  const [texto, setTexto] = useState('')
  const [status, setStatus] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (open) {
      if (descricao) {
        setTexto(descricao.descricao)
        setStatus(descricao.status)
      } else {
        setTexto('')
        setStatus(false)
      }
      setErro('')
    }
  }, [open, descricao])

  const handleSave = () => {
    if (!texto.trim()) {
      setErro('A descrição é obrigatória.')
      return
    }
    setErro('')
    onSave({ descricao: texto.trim(), status }, descricao?.id)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {descricao ? 'Editar Descrição' : 'Nova Descrição'}
          </DialogTitle>
          <DialogDescription>
            {descricao
              ? 'Edite a descrição que será exibida no formulário de solicitação de reserva de hotel.'
              : 'Crie uma descrição que será exibida no formulário de solicitação de reserva de hotel.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Descrição <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Descreva as informações sobre a reserva de hotel (ex: taxas, documentos necessários, etc.)"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={5}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="status"
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="status" className="text-sm font-medium cursor-pointer">
              Ativo (exibir no formulário)
            </label>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Apenas uma descrição pode estar ativa por vez. Se esta for ativada, as demais serão desativadas automaticamente.
            </p>
          </div>

          {erro && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{erro}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Salvando...' : descricao ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
