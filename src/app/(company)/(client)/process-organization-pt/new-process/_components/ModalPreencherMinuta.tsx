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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, FileText, Download, RefreshCw, Eye, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import { toast } from "react-toastify"
import { api } from "@/services/api"
import { cn } from "@/lib/utils"
import { MyClienteType } from "@/features/myClient/types"

interface ModalPreencherMinutaProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (pdfUrl: string) => void
  cliente?: MyClienteType | null
  initialValues?: Partial<MinutaFormValues>
}

interface MinutaFormValues {
  data_prevista_estadia: Date | undefined
  inicio_formacao_profissional: Date | undefined
  termino_formacao_profissional: Date | undefined
  duracao_estagio: string
  local_hospedagem: string
}

const initialFormValues: MinutaFormValues = {
  data_prevista_estadia: undefined,
  inicio_formacao_profissional: undefined,
  termino_formacao_profissional: undefined,
  duracao_estagio: "",
  local_hospedagem: "",
}

function formatDateForPayload(value: Date | undefined): string {
  return value ? format(value, "yyyy-MM-dd") : ""
}

export function ModalPreencherMinuta({
  open,
  onOpenChange,
  onSuccess,
  cliente,
  initialValues,
}: ModalPreencherMinutaProps) {
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

    if (!formData.data_prevista_estadia) {
      newErrors.data_prevista_estadia = "Data prevista de estadia é obrigatória"
    }
    if (!formData.inicio_formacao_profissional) {
      newErrors.inicio_formacao_profissional = "Início da formação é obrigatório"
    }
    if (!formData.termino_formacao_profissional) {
      newErrors.termino_formacao_profissional = "Término da formação é obrigatório"
    }
    if (!formData.duracao_estagio?.trim()) {
      newErrors.duracao_estagio = "Duração do estágio é obrigatória"
    }
    if (!formData.local_hospedagem?.trim()) {
      newErrors.local_hospedagem = "Local de hospedagem é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const payload = {
    cliente_id: cliente?.id,
    data_prevista_estadia: formatDateForPayload(formData.data_prevista_estadia),
    inicio_formacao_profissional: formatDateForPayload(formData.inicio_formacao_profissional),
    termino_formacao_profissional: formatDateForPayload(formData.termino_formacao_profissional),
    duracao_estagio: formData.duracao_estagio,
    local_hospedagem: formData.local_hospedagem,
  }

  const handleGerarConteudo = async () => {
    if (!validateForm()) {
      toast.warning("Por favor, corrija os erros no formulário.")
      return
    }

    setIsLoading(true)

    try {
      const response = await api.post('minuta1/gerar-pdf', payload)

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
        || "Erro ao gerar minuta. Tente novamente."

      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegenerar = async () => {
    setIsRegenerating(true)

    try {
      const response = await api.post('minuta1/gerar-pdf', payload)

      if (!response.data?.conteudo_html) {
        throw new Error('Resposta inválida do servidor.')
      }

      setConteudoHtml(response.data.conteudo_html)
    } catch (error: any) {
      console.error("Erro ao regenerar conteúdo:", error)

      const msg = error?.response?.data?.message
        || error?.response?.data?.error
        || error.message
        || "Erro ao regenerar minuta. Tente novamente."

      toast.error(msg)
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleAprovar = () => {
    setMode('approved')
    toast.success("Minuta aprovada!")
  }

  const handleDownloadPdf = async () => {
    if (!conteudoHtml) return

    setIsDownloading(true)

    try {
      const response = await api.post('minuta1/baixar-pdf', {
        cliente_id: cliente?.id,
        conteudo_html: conteudoHtml,
      }, {
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `minuta_${cliente?.nome?.replace(/\s/g, "_") || "documento"}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("Minuta gerada com sucesso!")
      onSuccess?.(url)
    } catch (error: any) {
      console.error("Erro ao baixar PDF:", error)

      if (error.response && error.response.data instanceof Blob) {
        try {
          const errorText = await error.response.data.text()
          const errorJson = JSON.parse(errorText)
          toast.error(errorJson.message || "Erro ao baixar minuta")
        } catch {
          toast.error("Erro ao baixar minuta. Tente novamente.")
        }
      } else {
        toast.error(error.message || "Erro ao baixar minuta. Tente novamente.")
      }
    } finally {
      setIsDownloading(false)
    }
  }

  const modalWidthClass = mode !== 'form'
    ? 'max-w-[95vw] sm:max-w-[95vw] md:max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw]'
    : 'max-w-[95vw] sm:max-w-[90vw] md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[50vw]'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`w-full ${modalWidthClass} p-0 rounded-xl border border-gray-200 dark:border-white/5 max-h-[90vh] flex flex-col`}>
        {mode === 'form' ? (
          <div className="p-6 overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Preencher Minuta
              </DialogTitle>
              <DialogDescription>
                Insira os dados abaixo para gerar a minuta do processo.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="data_prevista_estadia">
                  Data Prevista de Estadia *
                </Label>
                <input
                  type="date"
                  id="data_prevista_estadia"
                  value={formData.data_prevista_estadia ? format(formData.data_prevista_estadia, "yyyy-MM-dd") : ""}
                  onChange={(e) => handleDateChange("data_prevista_estadia", e.target.value ? new Date(e.target.value) : undefined)}
                  className={cn(
                    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                    "bg-transparent text-gray-800 dark:text-white/90",
                    "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20",
                    errors.data_prevista_estadia && "border-red-500 focus:border-red-500"
                  )}
                />
                {errors.data_prevista_estadia && <p className="text-sm text-red-500">{errors.data_prevista_estadia}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="inicio_formacao_profissional">
                  Início da Formação Profissional *
                </Label>
                <input
                  type="date"
                  id="inicio_formacao_profissional"
                  value={formData.inicio_formacao_profissional ? format(formData.inicio_formacao_profissional, "yyyy-MM-dd") : ""}
                  onChange={(e) => handleDateChange("inicio_formacao_profissional", e.target.value ? new Date(e.target.value) : undefined)}
                  className={cn(
                    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                    "bg-transparent text-gray-800 dark:text-white/90",
                    "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20",
                    errors.inicio_formacao_profissional && "border-red-500 focus:border-red-500"
                  )}
                />
                {errors.inicio_formacao_profissional && <p className="text-sm text-red-500">{errors.inicio_formacao_profissional}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="termino_formacao_profissional">
                  Término da Formação Profissional *
                </Label>
                <input
                  type="date"
                  id="termino_formacao_profissional"
                  value={formData.termino_formacao_profissional ? format(formData.termino_formacao_profissional, "yyyy-MM-dd") : ""}
                  onChange={(e) => handleDateChange("termino_formacao_profissional", e.target.value ? new Date(e.target.value) : undefined)}
                  className={cn(
                    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                    "bg-transparent text-gray-800 dark:text-white/90",
                    "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20",
                    errors.termino_formacao_profissional && "border-red-500 focus:border-red-500"
                  )}
                />
                {errors.termino_formacao_profissional && <p className="text-sm text-red-500">{errors.termino_formacao_profissional}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duracao_estagio">
                  Duração do Estágio *
                </Label>
                <Input
                  id="duracao_estagio"
                  value={formData.duracao_estagio}
                  onChange={(e) => handleTextChange("duracao_estagio", e.target.value)}
                  placeholder="3 meses"
                  className={cn(errors.duracao_estagio ? "border-red-500" : "", "w-full")}
                />
                {errors.duracao_estagio && (
                  <p className="text-sm text-red-500">{errors.duracao_estagio}</p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="local_hospedagem">
                  Local de Hospedagem *
                </Label>
                <Textarea
                  id="local_hospedagem"
                  rows={3}
                  value={formData.local_hospedagem}
                  onChange={(e) => handleTextChange("local_hospedagem", e.target.value)}
                  placeholder="Rua das Flores, nº 45, Lisboa"
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
                    Gerar Minuta
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
                  {mode === 'approved' ? 'Minuta Aprovada' : 'Pré-visualizar Minuta'}
                </DialogTitle>
                <DialogDescription>
                  {mode === 'approved'
                    ? 'A minuta foi aprovada. Faça o download do PDF.'
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
                      title="Pré-visualização da Minuta"
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
