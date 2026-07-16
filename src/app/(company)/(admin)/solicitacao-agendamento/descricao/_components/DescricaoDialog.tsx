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
import { FileText, Loader2, Info } from "lucide-react"
import { SolicitacaoAgendamentoDescricaoType } from "@/features/solicitacao-agendamento/types"

interface DescricaoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: { descricao: string; tipo: string; status: boolean }, id?: string) => void
  descricao?: SolicitacaoAgendamentoDescricaoType | null
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
  const [tipo, setTipo] = useState('nacional')
  const [status, setStatus] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (open) {
      if (descricao) {
        setTexto(descricao.descricao)
        setTipo(descricao.tipo || 'nacional')
        setStatus(descricao.status)
      } else {
        setTexto('')
        setTipo('nacional')
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
    onSave({ descricao: texto.trim(), tipo, status }, descricao?.id)
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
              ? 'Edite a descrição que será exibida no formulário de solicitação de agendamento.'
              : 'Crie uma descrição que será exibida no formulário de solicitação de agendamento.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Descrição <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Descreva as informações sobre o agendamento (ex: taxas, documentos necessários, etc.)"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Tipo de Visto <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipo"
                  value="nacional"
                  checked={tipo === 'nacional'}
                  onChange={(e) => setTipo(e.target.value)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <span className="text-sm">Nacional</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipo"
                  value="schengen"
                  checked={tipo === 'schengen'}
                  onChange={(e) => setTipo(e.target.value)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <span className="text-sm">Schengen</span>
              </label>
            </div>
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
              Apenas uma descrição por tipo de visto pode estar ativa por vez. Se esta for ativada, as demais do mesmo tipo serão desativadas automaticamente.
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
          <Button onClick={handleSave} disabled={isLoading} className="gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                {descricao ? 'Atualizar' : 'Criar'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
