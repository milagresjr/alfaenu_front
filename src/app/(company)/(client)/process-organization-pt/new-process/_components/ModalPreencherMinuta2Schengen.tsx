'use client'

import React, { useEffect, useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Loader2, FileText, Download, RefreshCw, Eye, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import { toast } from "react-toastify"
import { api } from "@/services/api"
import { cn } from "@/lib/utils"
import { MyClienteType } from "@/features/myClient/types"
import { SubtipoSchengen } from "@/types/processo"

interface ModalPreencherMinuta2SchengenProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (pdfUrl: string) => void
  cliente?: MyClienteType | null
  subtipo?: SubtipoSchengen | null
  subtipoOutroDescricao?: string
  initialValues?: Partial<MinutaFormValues>
}

interface MinutaFormValues {
  data_prevista_chegada: Date | undefined
  duracao_estadia: string
  local_hospedagem: string
}

const initialFormValues: MinutaFormValues = {
  data_prevista_chegada: undefined,
  duracao_estadia: "",
  local_hospedagem: "",
}

function formatDateForPayload(value: Date | undefined): string {
  return value ? format(value, "yyyy-MM-dd") : ""
}

export function ModalPreencherMinuta2Schengen({
  open,
  onOpenChange,
  onSuccess,
  cliente,
  subtipo,
  subtipoOutroDescricao,
  initialValues,
}: ModalPreencherMinuta2SchengenProps) {
  const [mode, setMode] = useState<'form' | 'preview' | 'approved'>('form')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [conteudoHtml, setConteudoHtml] = useState<string | null>(null)
  const [formData, setFormData] = useState<MinutaFormValues>({ ...initialFormValues, ...initialValues })
  const [errors, setErrors] = useState<Partial<Record<keyof MinutaFormValues, string>>>({})

  useEffect(() => {
    if (open) {
      setMode('form')
      setFormData({ ...initialFormValues, ...initialValues })
      setErrors({})
      setConteudoHtml(null)
    }
  }, [open, initialValues])

  const handleTextChange = (field: keyof MinutaFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleDateChange = (field: keyof MinutaFormValues, date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: date }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof MinutaFormValues, string>> = {}

    if (!formData.data_prevista_chegada) {
      newErrors.data_prevista_chegada = "Data prevista de chegada é obrigatória"
    }
    if (!formData.duracao_estadia?.trim() || Number(formData.duracao_estadia) < 1) {
      newErrors.duracao_estadia = "Duração da estadia é obrigatória (mín. 1 dia)"
    }
    if (!formData.local_hospedagem?.trim()) {
      newErrors.local_hospedagem = "Local de hospedagem é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const payload = {
    cliente_id: cliente?.id,
    data_prevista_chegada: formatDateForPayload(formData.data_prevista_chegada),
    duracao_estadia: formData.duracao_estadia,
    local_hospedagem: formData.local_hospedagem,
    subtipo: subtipo || 'turismo',
    subtipo_outro_descricao: subtipoOutroDescricao || '',
  }

  const handleGerarConteudo = async () => {
    if (!validateForm()) {
      toast.warning("Por favor, corrija os erros no formulário.")
      return
    }

    setIsLoading(true)

    try {
      const response = await api.post('minuta2-schengen/gerar-pdf', payload)

      if (!response.data?.conteudo_html) {
        throw new Error('Resposta inválida do servidor.')
      }

      setConteudoHtml(response.data.conteudo_html)
      setMode('preview')
    } catch (error: any) {
      console.error("Erro ao gerar conteúdo:", error)

      const msg = error?.response?.data?.message
        || error?.response?.data?.error
        || error.message
        || "Erro ao gerar carta de intenção. Tente novamente."

      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegenerar = async () => {
    setIsRegenerating(true)

    try {
      const response = await api.post('minuta2-schengen/gerar-pdf', payload)

      if (!response.data?.conteudo_html) {
        throw new Error('Resposta inválida do servidor.')
      }

      setConteudoHtml(response.data.conteudo_html)
    } catch (error: any) {
      console.error("Erro ao regenerar conteúdo:", error)

      const msg = error?.response?.data?.message
        || error?.response?.data?.error
        || error.message
        || "Erro ao regenerar carta de intenção. Tente novamente."

      toast.error(msg)
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleAprovar = () => {
    setMode('approved')
    toast.success("Carta de intenção aprovada!")
  }

  const handleDownloadPdf = async () => {
    if (!conteudoHtml) return

    setIsDownloading(true)

    try {
      const response = await api.post('minuta2-schengen/baixar-pdf', {
        cliente_id: cliente?.id,
        conteudo_html: conteudoHtml,
      }, {
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `carta_intencao_${cliente?.nome?.replace(/\s/g, "_") || "documento"}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("Carta de intenção gerada com sucesso!")
      onSuccess?.(url)
    } catch (error: any) {
      console.error("Erro ao baixar PDF:", error)

      if (error.response && error.response.data instanceof Blob) {
        try {
          const errorText = await error.response.data.text()
          const errorJson = JSON.parse(errorText)
          toast.error(errorJson.message || "Erro ao baixar carta de intenção")
        } catch {
          toast.error("Erro ao baixar carta de intenção. Tente novamente.")
        }
      } else {
        toast.error(error.message || "Erro ao baixar carta de intenção. Tente novamente.")
      }
    } finally {
      setIsDownloading(false)
    }
  }

  const modalWidthClass = mode !== 'form'
    ? 'max-w-[95vw] sm:max-w-[95vw] md:max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw]'
    : 'max-w-[95vw] sm:max-w-[90vw] md:max-w-[60vw] lg:max-w-[50vw] xl:max-w-[40vw]'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`w-full ${modalWidthClass} p-0 rounded-xl border border-gray-200 dark:border-white/5 max-h-[90vh] flex flex-col`}>
        {mode === 'form' ? (
          <div className="p-6 overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Carta de Intenção
              </DialogTitle>
              <DialogDescription>
                Insira os dados abaixo para gerar a carta de intenção para {subtipo ? (subtipo === 'outro' ? subtipoOutroDescricao || 'Schengen' : subtipo) : 'Schengen'}.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="data_prevista_chegada">
                  Data Prevista de Chegada *
                </Label>
                <input
                  type="date"
                  id="data_prevista_chegada"
                  value={formData.data_prevista_chegada ? format(formData.data_prevista_chegada, "yyyy-MM-dd") : ""}
                  onChange={(e) => handleDateChange("data_prevista_chegada", e.target.value ? new Date(e.target.value) : undefined)}
                  className={cn(
                    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                    "bg-transparent text-gray-800 dark:text-white/90",
                    "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20",
                    errors.data_prevista_chegada && "border-red-500 focus:border-red-500"
                  )}
                />
                {errors.data_prevista_chegada && <p className="text-sm text-red-500">{errors.data_prevista_chegada}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duracao_estadia">
                  Duração da Estadia (dias) *
                </Label>
                <Input
                  type="number"
                  id="duracao_estadia"
                  min={1}
                  value={formData.duracao_estadia}
                  onChange={(e) => handleTextChange("duracao_estadia", e.target.value)}
                  placeholder="10"
                  className={cn(errors.duracao_estadia ? "border-red-500" : "", "w-full")}
                />
                {errors.duracao_estadia && (
                  <p className="text-sm text-red-500">{errors.duracao_estadia}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="local_hospedagem">
                  Local de Hospedagem *
                </Label>
                <Textarea
                  id="local_hospedagem"
                  rows={3}
                  value={formData.local_hospedagem}
                  onChange={(e) => handleTextChange("local_hospedagem", e.target.value)}
                  placeholder="Hotel Central, Av. da Liberdade, Lisboa"
                  className={cn(errors.local_hospedagem ? "border-red-500" : "", "w-full")}
                />
                {errors.local_hospedagem && (
                  <p className="text-sm text-red-500">{errors.local_hospedagem}</p>
                )}
              </div>
            </div>

            <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleGerarConteudo}
                disabled={isLoading}
                className="gap-2 w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Gerando conteúdo...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Gerar Carta
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="flex flex-col h-full max-h-[90vh]">
            <div className="shrink-0 px-6 pt-6">
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  {mode === 'approved' ? 'Carta de Intenção Aprovada' : 'Pré-visualizar Carta de Intenção'}
                </DialogTitle>
                <DialogDescription>
                  {mode === 'approved'
                    ? 'A carta de intenção foi aprovada. Faça o download do PDF.'
                    : 'Revise o conteúdo gerado antes de aprovar.'}
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-4">
              <div className="max-w-[794px] mx-auto">
                {conteudoHtml && (
                    <iframe
                      sandbox="allow-scripts"
                      srcDoc={conteudoHtml}
                      className="w-full min-h-[70vh] border rounded-lg bg-white shadow-sm"
                      title="Pré-visualização da Carta de Intenção"
                    />
                  )}
              </div>
            </div>

            <div className="shrink-0 border-t px-6 py-4 bg-background">
              <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                {mode === 'preview' && (
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      className="w-full sm:w-auto"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRegenerar}
                      disabled={isRegenerating}
                      className="gap-2 w-full sm:w-auto"
                    >
                      {isRegenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      Regenerar
                    </Button>
                    <Button
                      type="button"
                      onClick={handleAprovar}
                      className="gap-2 w-full sm:w-auto"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Aprovar
                    </Button>
                  </div>
                )}
                {mode === 'approved' && (
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      className="w-full sm:w-auto"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      onClick={handleDownloadPdf}
                      disabled={isDownloading}
                      className="gap-2 w-full sm:w-auto"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Baixando...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Baixar
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </DialogFooter>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
