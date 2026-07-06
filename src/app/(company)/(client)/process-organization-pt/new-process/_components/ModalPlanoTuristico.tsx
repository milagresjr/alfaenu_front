'use client'

import { useEffect, useState } from "react"
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
import { Loader2, MapPin, Eye, Download, RefreshCw, CheckCircle2 } from "lucide-react"
import { toast } from "react-toastify"
import { api } from "@/services/api"
import { cn } from "@/lib/utils"
import { MyClienteType } from "@/features/myClient/types"

interface ModalPlanoTuristicoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (pdfUrl: string) => void
  cliente?: MyClienteType | null
}

interface PlanoFormValues {
  data_prevista_chegada: string
  data_prevista_saida: string
  objetivos: string
}

const initialFormValues: PlanoFormValues = {
  data_prevista_chegada: "",
  data_prevista_saida: "",
  objetivos: "",
}

export function ModalPlanoTuristico({
  open,
  onOpenChange,
  onSuccess,
  cliente,
}: ModalPlanoTuristicoProps) {
  const [mode, setMode] = useState<'form' | 'preview' | 'approved'>('form')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [conteudoHtml, setConteudoHtml] = useState<string | null>(null)
  const [formData, setFormData] = useState<PlanoFormValues>({ ...initialFormValues })
  const [errors, setErrors] = useState<Partial<Record<keyof PlanoFormValues, string>>>({})

  useEffect(() => {
    if (open) {
      setMode('form')
      setFormData({ ...initialFormValues })
      setErrors({})
      setConteudoHtml(null)
    }
  }, [open])

  const handleTextChange = (field: keyof PlanoFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PlanoFormValues, string>> = {}

    if (!formData.data_prevista_chegada) {
      newErrors.data_prevista_chegada = "Data prevista de chegada é obrigatória"
    }
    if (!formData.data_prevista_saida) {
      newErrors.data_prevista_saida = "Data prevista de saída é obrigatória"
    }
    if (formData.data_prevista_chegada && formData.data_prevista_saida && formData.data_prevista_saida < formData.data_prevista_chegada) {
      newErrors.data_prevista_saida = "Data de saída não pode ser anterior à data de chegada"
    }
    if (!formData.objetivos?.trim()) {
      newErrors.objetivos = "Descrição dos objetivos é obrigatória"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const payload = {
    cliente_id: cliente?.id,
    data_prevista_chegada: formData.data_prevista_chegada,
    data_prevista_saida: formData.data_prevista_saida,
    objetivos: formData.objetivos,
  }

  const handleGerarConteudo = async () => {
    if (!validateForm()) {
      toast.warning("Por favor, corrija os erros no formulário.")
      return
    }

    setIsLoading(true)

    try {
      const response = await api.post('plano-turistico/gerar-pdf', payload)

      if (!response.data?.conteudo_html) {
        throw new Error('Resposta inválida do servidor.')
      }

      setConteudoHtml(response.data.conteudo_html)
      setMode('preview')
    } catch (error: any) {
      console.error("Erro ao gerar plano turístico:", error)

      const msg = error?.response?.data?.message
        || error?.response?.data?.error
        || error.message
        || "Erro ao gerar plano turístico. Tente novamente."

      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegenerar = async () => {
    setIsRegenerating(true)

    try {
      const response = await api.post('plano-turistico/gerar-pdf', payload)

      if (!response.data?.conteudo_html) {
        throw new Error('Resposta inválida do servidor.')
      }

      setConteudoHtml(response.data.conteudo_html)
    } catch (error: any) {
      console.error("Erro ao regenerar plano turístico:", error)

      const msg = error?.response?.data?.message
        || error?.response?.data?.error
        || error.message
        || "Erro ao regenerar plano turístico. Tente novamente."

      toast.error(msg)
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleAprovar = () => {
    setMode('approved')
    toast.success("Plano turístico aprovado!")
  }

  const handleDownloadPdf = async () => {
    if (!conteudoHtml) return

    setIsDownloading(true)

    try {
      const response = await api.post('plano-turistico/baixar-pdf', {
        cliente_id: cliente?.id,
        conteudo_html: conteudoHtml,
      }, {
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `plano_turistico_${cliente?.nome?.replace(/\s/g, "_") || "documento"}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("Plano turístico gerado com sucesso!")
      onSuccess?.(url)
      onOpenChange(false)
    } catch (error: any) {
      console.error("Erro ao baixar PDF:", error)

      if (error.response && error.response.data instanceof Blob) {
        try {
          const errorText = await error.response.data.text()
          const errorJson = JSON.parse(errorText)
          toast.error(errorJson.message || "Erro ao baixar plano turístico")
        } catch {
          toast.error("Erro ao baixar plano turístico. Tente novamente.")
        }
      } else {
        toast.error(error.message || "Erro ao baixar plano turístico. Tente novamente.")
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
                <MapPin className="h-6 w-6 text-primary" />
                Plano Turístico
              </DialogTitle>
              <DialogDescription>
                Insira os dados abaixo para gerar o plano turístico.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="data_prevista_chegada">
                  Data Prevista de Chegada *
                </Label>
                <input
                  type="date"
                  id="data_prevista_chegada"
                  value={formData.data_prevista_chegada}
                  onChange={(e) => handleTextChange("data_prevista_chegada", e.target.value)}
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
                <Label htmlFor="data_prevista_saida">
                  Data Prevista de Saída *
                </Label>
                <input
                  type="date"
                  id="data_prevista_saida"
                  value={formData.data_prevista_saida}
                  onChange={(e) => handleTextChange("data_prevista_saida", e.target.value)}
                  className={cn(
                    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                    "bg-transparent text-gray-800 dark:text-white/90",
                    "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20",
                    errors.data_prevista_saida && "border-red-500 focus:border-red-500"
                  )}
                />
                {errors.data_prevista_saida && <p className="text-sm text-red-500">{errors.data_prevista_saida}</p>}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="objetivos">
                  Objetivos do Plano Turístico *
                </Label>
                <Textarea
                  id="objetivos"
                  rows={4}
                  value={formData.objetivos}
                  onChange={(e) => handleTextChange("objetivos", e.target.value)}
                  placeholder="Descreva os objetivos do plano turístico, locais a visitar, atividades planeadas..."
                  className={cn(errors.objetivos ? "border-red-500" : "", "w-full")}
                />
                {errors.objetivos && (
                  <p className="text-sm text-red-500">{errors.objetivos}</p>
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
                    Gerar Plano Turístico
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
                  <MapPin className="h-6 w-6 text-primary" />
                  {mode === 'approved' ? 'Plano Turístico Aprovado' : 'Pré-visualizar Plano Turístico'}
                </DialogTitle>
                <DialogDescription>
                  {mode === 'approved'
                    ? 'O plano turístico foi aprovado. Faça o download do PDF.'
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
                    title="Pré-visualização do Plano Turístico"
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
