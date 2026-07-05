'use client'

import { useState, useRef } from "react"
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
import { Loader2, Upload, FileText, AlertCircle, Trash2, Eye, FileSignature } from "lucide-react"
import { toast } from "react-toastify"
import { MyClienteType } from "@/features/myClient/types"
import { useCreateReconhecimentoConsulado } from "@/features/solicitacao-reconhecimento-consulado/hooks/useReconhecimentoConsuladoQuery"

interface ModalSolicitarReconhecimentoConsuladoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cliente?: MyClienteType | null
  onSuccess?: () => void
}

export function ModalSolicitarReconhecimentoConsulado({
  open,
  onOpenChange,
  cliente,
  onSuccess,
}: ModalSolicitarReconhecimentoConsuladoProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [dataDocumento, setDataDocumento] = useState('')
  const [comprovativo, setComprovativo] = useState<File | null>(null)
  const [erro, setErro] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const createReconhecimentoConsulado = useCreateReconhecimentoConsulado()

  const handleClose = () => {
    setDataDocumento('')
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

    if (!dataDocumento) {
      setErro('A data do documento é obrigatória.')
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
      formData.append('data_documento', dataDocumento)
      formData.append('comprovativo', comprovativo)

      createReconhecimentoConsulado.mutate(formData, {
        onSuccess: () => {
          toast.success('Reconhecimento de termo registado com sucesso!')
          handleClose()
          onSuccess?.()
        },
        onError: (error: Error) => {
          const err = error as unknown as { response?: { data?: { message?: string } } }
          const msg = err?.response?.data?.message || 'Erro ao registar reconhecimento de termo.'
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
              <FileSignature className="h-6 w-6 text-primary" />
              Reconhecer Termo no Consulado
            </DialogTitle>
            <DialogDescription>
              Envie o comprovativo de pagamento e a data do documento para reconhecimento no consulado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="data_documento">
                Data do Documento <span className="text-red-500">*</span>
              </Label>
              <Input
                id="data_documento"
                type="date"
                value={dataDocumento}
                onChange={(e) => setDataDocumento(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Comprovativo de Pagamento <span className="text-red-500">*</span>
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
                  <FileSignature className="h-4 w-4" />
                  Reconhecer no Consulado
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
