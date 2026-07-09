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
import { Label } from "@/components/ui/label"
import { Loader2, Upload, FileText, AlertCircle, Trash2, Eye, Fingerprint, MapPin, Home, Wallet } from "lucide-react"
import { toast } from "react-toastify"
import { cn } from "@/lib/utils"
import { MyClienteType } from "@/features/myClient/types"
import { useCreateSolicitacaoReconhecimentoRegistoCriminal, useGetConfigReconhecimentoCriminal } from "@/features/solicitacao-reconhecimento-registo-criminal/hooks/useReconhecimentoRegistoCriminalQuery"

interface ModalSolicitarReconhecimentoRegistoCriminalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cliente?: MyClienteType | null
  onSuccess?: () => void
}

export function ModalSolicitarReconhecimentoRegistoCriminal({
  open,
  onOpenChange,
  cliente,
  onSuccess,
}: ModalSolicitarReconhecimentoRegistoCriminalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [tipoEntrega, setTipoEntrega] = useState<'domicilio' | 'presencial' | null>(null)
  const [enderecoEntrega, setEnderecoEntrega] = useState('')
  const [comprovativo, setComprovativo] = useState<File | null>(null)
  const [erro, setErro] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const createSolicitacao = useCreateSolicitacaoReconhecimentoRegistoCriminal()
  const { data: config } = useGetConfigReconhecimentoCriminal()

  const handleClose = () => {
    setTipoEntrega(null)
    setEnderecoEntrega('')
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

    if (!tipoEntrega) {
      setErro('Selecione o tipo de entrega.')
      return
    }

    if (tipoEntrega === 'domicilio' && !enderecoEntrega.trim()) {
      setErro('Informe o endereço para entrega ao domicílio.')
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
      formData.append('tipo_entrega', tipoEntrega)
      if (tipoEntrega === 'domicilio') {
        formData.append('endereco_entrega', enderecoEntrega)
      }
      formData.append('comprovativo', comprovativo)

      createSolicitacao.mutate(formData, {
        onSuccess: () => {
          toast.success('Solicitação de reconhecimento de registo criminal enviada com sucesso!')
          handleClose()
          onSuccess?.()
        },
        onError: (error: Error) => {
          const err = error as unknown as { response?: { data?: { message?: string } } }
          const msg = err?.response?.data?.message || 'Erro ao enviar solicitação.'
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

  const precoTotal = tipoEntrega === 'domicilio' && config
    ? Number(config.preco_base) + Number(config.taxa_domicilio)
    : Number(config?.preco_base)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[65vw] lg:max-w-[55vw] max-h-[90vh] overflow-y-auto p-0 rounded-xl border border-gray-200 dark:border-white/5">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Fingerprint className="h-6 w-6 text-primary" />
              Reconhecimento de Registo Criminal
            </DialogTitle>
            <DialogDescription>
              Solicite o reconhecimento do seu registo criminal.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label>Tipo de Recolha <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTipoEntrega('domicilio')}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all",
                    tipoEntrega === 'domicilio'
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-gray-200 dark:border-white/10 hover:border-primary/50"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg shrink-0",
                    tipoEntrega === 'domicilio' ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800"
                  )}>
                    <Home className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Ao Domicílio</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      recolha e envio do registo criminal à sua residência
                    </p>
                    {config && (
                      <p className="text-xs font-semibold text-primary mt-1">
                        +{config.taxa_domicilio.toLocaleString()} Kz (taxa adicional)
                      </p>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTipoEntrega('presencial')}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all",
                    tipoEntrega === 'presencial'
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-gray-200 dark:border-white/10 hover:border-primary/50"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg shrink-0",
                    tipoEntrega === 'presencial' ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800"
                  )}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Presencial</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recolha do registo criminal na agência
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {tipoEntrega === 'domicilio' && (
              <div className="space-y-2">
                <Label htmlFor="endereco_entrega">
                  Endereço de Recolha <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="endereco_entrega"
                  value={enderecoEntrega}
                  onChange={(e) => setEnderecoEntrega(e.target.value)}
                  rows={3}
                  className={cn(
                    "w-full rounded-lg border border-gray-300 dark:border-white/10 px-4 py-2.5 text-sm",
                    "focus:outline-none focus:border-brand-300 focus:ring-brand-500/20",
                    "bg-transparent text-gray-800 dark:text-white/90"
                  )}
                  placeholder="Informe o seu endereço atual para recolha..."
                />
              </div>
            )}

            {tipoEntrega === 'presencial' && config?.endereco_agencia && (
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Endereço da Agência</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 whitespace-pre-line">
                      {config.endereco_agencia}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {config && (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Wallet className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Valor do Serviço</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      {tipoEntrega === 'domicilio' ? (
                        <>
                          Preço base: <strong>{config.preco_base.toLocaleString()} Kz</strong>
                          {' + '}Taxa de entrega: <strong>{config.taxa_domicilio.toLocaleString()} Kz</strong>
                          {' = '}Total: <strong className="text-lg">{precoTotal?.toLocaleString()} Kz</strong>
                        </>
                      ) : (
                        <>
                          Total: <strong className="text-lg">{config.preco_base.toLocaleString()} Kz</strong>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                  <Fingerprint className="h-4 w-4" />
                  Solicitar Reconhecimento
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
