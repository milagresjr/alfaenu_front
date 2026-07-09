'use client'

import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, FileText, AlertCircle, Trash2, Eye, ShieldCheck } from "lucide-react"
import { toast } from "react-toastify"
import { cn } from "@/lib/utils"
import { MyClienteType } from "@/features/myClient/types"
import { useCreateSolicitacaoSeguroViagem, useGetDescricaoAtivaSeguroViagem } from "@/features/solicitacao-seguro-viagem/hooks/useSeguroViagemQuery"

interface ModalSolicitarSeguroViagemProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cliente?: MyClienteType | null
  onSuccess?: () => void
  dataPrevistaChegada?: string
  dataPrevistaSaida?: string
}

function formatDateToInput(dateStr?: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().split('T')[0]
}

export function ModalSolicitarSeguroViagem({
  open,
  onOpenChange,
  cliente,
  onSuccess,
  dataPrevistaChegada,
  dataPrevistaSaida,
}: ModalSolicitarSeguroViagemProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [dataIda, setDataIda] = useState('')
  const [dataVolta, setDataVolta] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [comprovativo, setComprovativo] = useState<File | null>(null)
  const [erro, setErro] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const createSolicitacaoSeguroViagem = useCreateSolicitacaoSeguroViagem()
  const { data: descricaoAtiva } = useGetDescricaoAtivaSeguroViagem()

  const descricaoTexto = Array.isArray(descricaoAtiva) ? descricaoAtiva[0]?.descricao : descricaoAtiva?.descricao

  useEffect(() => {
    if (open) {
      if (dataPrevistaChegada) setDataIda(formatDateToInput(dataPrevistaChegada))
      if (dataPrevistaSaida) setDataVolta(formatDateToInput(dataPrevistaSaida))
    }
  }, [open, dataPrevistaChegada, dataPrevistaSaida])

  const handleClose = () => {
    setDataIda('')
    setDataVolta('')
    setObservacoes('')
    setComprovativo(null)
    setErro('')
    onOpenChange(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png']
    if (!tiposPermitidos.includes(file.type)) {
      setErro('Apenas arquivos PDF, JPG ou PNG são permitidos.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setErro('O arquivo deve ter no máximo 2MB.')
      return
    }

    setErro('')
    setComprovativo(file)
  }

  const handleSubmit = async () => {
    if (!cliente?.id) {
      setErro('Cliente não encontrado.')
      return
    }

    if (!dataIda) {
      setErro('A data de ida é obrigatória.')
      return
    }

    if (!dataVolta) {
      setErro('A data de volta é obrigatória.')
      return
    }

    if (!comprovativo) {
      setErro('O comprovativo é obrigatório.')
      return
    }

    setErro('')
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('cliente_id', String(cliente.id))
      formData.append('data_ida', dataIda)
      formData.append('data_volta', dataVolta)
      formData.append('comprovativo', comprovativo)
      if (observacoes) {
        formData.append('observacoes', observacoes)
      }

      createSolicitacaoSeguroViagem.mutate(formData, {
        onSuccess: () => {
          toast.success('Solicitação de seguro de viagem enviada com sucesso!')
          handleClose()
          onSuccess?.()
        },
        onError: (error: Error) => {
          const err = error as unknown as { response?: { data?: { message?: string } } }
          const msg = err?.response?.data?.message || 'Erro ao enviar solicitação de seguro de viagem.'
          toast.error(msg)
          setErro(msg)
        },
        onSettled: () => {
          setIsLoading(false)
        },
      })
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error)
      toast.error('Erro ao enviar solicitação.')
      setErro('Erro ao enviar solicitação.')
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[65vw] lg:max-w-[55vw] max-h-[90vh] overflow-y-auto p-0 rounded-xl border border-gray-200 dark:border-white/5">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              Solicitar Seguro de Viagem
            </DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para solicitar o seguro de viagem.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {descricaoTexto && (
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300 whitespace-pre-line">
                  {descricaoTexto}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_ida">
                  Data de Ida <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="data_ida"
                  type="date"
                  value={dataIda}
                  onChange={(e) => setDataIda(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_volta">
                  Data de Volta <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="data_volta"
                  type="date"
                  value={dataVolta}
                  onChange={(e) => setDataVolta(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pais_origem">País de Origem</Label>
                <Input
                  id="pais_origem"
                  type="text"
                  value="Angola"
                  disabled
                  className="bg-gray-100 dark:bg-gray-800/50 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pais_destino">País de Destino</Label>
                <Input
                  id="pais_destino"
                  type="text"
                  value="Portugal"
                  disabled
                  className="bg-gray-100 dark:bg-gray-800/50 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações (opcional)</Label>
              <textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={3}
                className={cn(
                  "w-full rounded-lg border border-gray-300 dark:border-white/10 px-4 py-2.5 text-sm",
                  "focus:outline-none focus:border-brand-300 focus:ring-brand-500/20",
                  "bg-transparent text-gray-800 dark:text-white/90"
                )}
                placeholder="Informações adicionais sobre sua solicitação..."
              />
            </div>

            <div className="space-y-2">
              <Label>
                Comprovativo <span className="text-red-500">*</span>
              </Label>
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {comprovativo ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{comprovativo.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(URL.createObjectURL(comprovativo), '_blank')
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setComprovativo(null)
                          setErro('')
                        }}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Clique para selecionar o comprovativo
                    </span>
                    <span className="text-xs text-muted-foreground">
                      PDF, JPG ou PNG • Máximo 2MB
                    </span>
                  </div>
                )}
              </div>
            </div>

            {erro && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {erro}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="gap-2 w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Solicitar Seguro de Viagem
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
