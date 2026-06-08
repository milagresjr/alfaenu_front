// components/processo/modais/ModalPreencherMinuta.tsx
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
import { Loader2, FileText, Download } from "lucide-react"
import { format } from "date-fns"
import { toast } from "react-toastify"
import { api } from "@/services/api"
import { cn } from "@/lib/utils"
import { MyClienteType } from "@/features/myClient/types"

interface ModalPreencherMinutaProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValues?: Partial<MinutaFormValues>
  onSuccess?: (pdfUrl: string) => void
  cliente?: MyClienteType | null
}

interface MinutaFormValues {
  nome_completo: string
  naturalidade: string
  nacionalidade: string
  num_passaporte: string
  data_emissao: Date | undefined
  data_validade: Date | undefined
  data_prevista_estadia: Date | undefined
  inicio_formacao_profissional: Date | undefined
  termino_formacao_profissional: Date | undefined
  escola_profissional: string
  curso: string
  duracao_curso: string
  duracao_estagio: string
  local_hospedagem: string
}

const initialFormValues: MinutaFormValues = {
  nome_completo: "",
  naturalidade: "",
  nacionalidade: "",
  num_passaporte: "",
  data_emissao: undefined,
  data_validade: undefined,
  data_prevista_estadia: undefined,
  inicio_formacao_profissional: undefined,
  termino_formacao_profissional: undefined,
  escola_profissional: "",
  curso: "",
  duracao_curso: "",
  duracao_estagio: "",
  local_hospedagem: "",
}

function parseClientDate(value?: string): Date | undefined {
  if (!value) return undefined

  const trimmed = value.trim()
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/)

  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10)
    const month = parseInt(isoMatch[2], 10) - 1
    const day = parseInt(isoMatch[3], 10)
    const date = new Date(year, month, day)

    if (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
    ) {
      return date
    }
  }

  const normalized = trimmed.replace(/[\/\.]/g, "-")
  const parts = normalized.split("-").map((part) => part.trim())

  if (parts.length !== 3) {
    return undefined
  }

  let year = 0
  let month = 0
  let day = 0

  if (parts[0].length === 4) {
    year = parseInt(parts[0], 10)
    month = parseInt(parts[1], 10) - 1
    day = parseInt(parts[2], 10)
  } else if (parts[2].length === 4) {
    day = parseInt(parts[0], 10)
    month = parseInt(parts[1], 10) - 1
    year = parseInt(parts[2], 10)
  } else {
    return undefined
  }

  const date = new Date(year, month, day)
  if (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  ) {
    return date
  }

  return undefined
}

function formatDateForPayload(value: Date | undefined): string {
  return value ? format(value, "yyyy-MM-dd") : ""
}

function getInitialValues(
  values?: Partial<MinutaFormValues>,
  cliente?: MyClienteType | null
): MinutaFormValues {
  return {
    ...initialFormValues,
    ...values,
    nome_completo: cliente?.nome ?? values?.nome_completo ?? initialFormValues.nome_completo,
    naturalidade: cliente?.naturalidade ?? values?.naturalidade ?? initialFormValues.naturalidade,
    nacionalidade: cliente?.nacionalidade ?? values?.nacionalidade ?? initialFormValues.nacionalidade,
    num_passaporte:
      cliente?.n_passaporte ?? cliente?.n_bi ?? values?.num_passaporte ?? initialFormValues.num_passaporte,
    data_emissao:
      cliente?.data_emissao || cliente?.emitido_em
        ? parseClientDate(cliente?.data_emissao ?? cliente?.emitido_em)
        : values?.data_emissao ?? initialFormValues.data_emissao,
    data_validade:
      cliente?.valido_ate
        ? parseClientDate(cliente?.valido_ate)
        : values?.data_validade ?? initialFormValues.data_validade,
  }
}

export function ModalPreencherMinuta({
  open,
  onOpenChange,
  initialValues,
  onSuccess,
  cliente,
}: ModalPreencherMinutaProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<MinutaFormValues>(
    getInitialValues(initialValues, cliente)
  )
  const [errors, setErrors] = useState<Partial<Record<keyof MinutaFormValues, string>>>({})

  const clientePrefill = {
    nome_completo: Boolean(cliente?.nome),
    naturalidade: Boolean(cliente?.naturalidade),
    nacionalidade: Boolean(cliente?.nacionalidade),
    num_passaporte: Boolean(cliente?.n_passaporte || cliente?.n_bi),
    data_emissao: Boolean(cliente?.data_emissao || cliente?.emitido_em),
    data_validade: Boolean(cliente?.valido_ate),
  }

  useEffect(() => {
    if (open) {
      setFormData(getInitialValues(initialValues, cliente))
      setErrors({})
    }
  }, [open, initialValues, cliente])

  const handleTextChange = (field: keyof MinutaFormValues, value: string) => {
    setFormData((prev: MinutaFormValues) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev: Partial<Record<keyof MinutaFormValues, string>>) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleDateChange = (field: keyof MinutaFormValues, date: Date | undefined) => {
    setFormData((prev: MinutaFormValues) => ({ ...prev, [field]: date }))
    if (errors[field]) {
      setErrors((prev: Partial<Record<keyof MinutaFormValues, string>>) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof MinutaFormValues, string>> = {}

    if (!formData.nome_completo?.trim()) {
      newErrors.nome_completo = "Nome completo é obrigatório"
    }
    if (!formData.naturalidade?.trim()) {
      newErrors.naturalidade = "Naturalidade é obrigatória"
    }
    if (!formData.nacionalidade?.trim()) {
      newErrors.nacionalidade = "Nacionalidade é obrigatória"
    }
    if (!formData.num_passaporte?.trim()) {
      newErrors.num_passaporte = "Número do passaporte é obrigatório"
    }
    if (!formData.escola_profissional?.trim()) {
      newErrors.escola_profissional = "Escola profissional é obrigatória"
    }
    if (!formData.curso?.trim()) {
      newErrors.curso = "Curso é obrigatório"
    }
    if (!formData.duracao_curso?.trim()) {
      newErrors.duracao_curso = "Duração do curso é obrigatória"
    }
    if (!formData.duracao_estagio?.trim()) {
      newErrors.duracao_estagio = "Duração do estágio é obrigatória"
    }
    if (!formData.local_hospedagem?.trim()) {
      newErrors.local_hospedagem = "Local de hospedagem é obrigatório"
    }
    if (!formData.data_emissao) {
      newErrors.data_emissao = "Data de emissão é obrigatória"
    }
    if (!formData.data_validade) {
      newErrors.data_validade = "Data de validade é obrigatória"
    }
    if (!formData.data_prevista_estadia) {
      newErrors.data_prevista_estadia = "Data prevista de estadia é obrigatória"
    }
    if (!formData.inicio_formacao_profissional) {
      newErrors.inicio_formacao_profissional = "Início da formação é obrigatório"
    }
    if (!formData.termino_formacao_profissional) {
      newErrors.termino_formacao_profissional = "Término da formação é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.warning("Por favor, corrija os erros no formulário.")
      return
    }

    setIsLoading(true)

    try {
      const payload = {
        nome_completo: formData.nome_completo,
        naturalidade: formData.naturalidade,
        nacionalidade: formData.nacionalidade,
        num_passaporte: formData.num_passaporte,
        data_emissao: formatDateForPayload(formData.data_emissao),
        data_validade: formatDateForPayload(formData.data_validade),
        data_prevista_estadia: formatDateForPayload(formData.data_prevista_estadia),
        inicio_formacao_profissional: formatDateForPayload(formData.inicio_formacao_profissional),
        termino_formacao_profissional: formatDateForPayload(formData.termino_formacao_profissional),
        escola_profissional: formData.escola_profissional,
        curso: formData.curso,
        duracao_curso: formData.duracao_curso,
        duracao_estagio: formData.duracao_estagio,
        local_hospedagem: formData.local_hospedagem,
      }

      const response = await api.post('minuta1/gerar-pdf', payload, {
        responseType: 'blob'
      })

      const contentType = response.headers['content-type'] || ''
      if (!(contentType as any)?.includes('application/pdf')) {
        const text = await response.data.text()
        console.error('Resposta não é PDF:', text.substring(0, 500))
        throw new Error('Erro ao gerar minuta. Tente novamente.')
      }

      if (response.data.size === 0) {
        throw new Error('Erro ao gerar minuta. Tente novamente.')
      }

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `minuta_${formData.nome_completo.replace(/\s/g, "_")}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("Minuta gerada com sucesso!")
      onSuccess?.(url)
      onOpenChange(false)
    } catch (error: any) {
      console.error("Erro detalhado:", error)

      if (error.response && error.response.data instanceof Blob) {
        try {
          const errorText = await error.response.data.text()
          const errorJson = JSON.parse(errorText)
          toast.error(errorJson.message || "Erro ao gerar minuta")
        } catch {
          toast.error("Erro ao gerar minuta. Tente novamente.")
        }
      } else {
        toast.error(error.message || "Erro ao gerar minuta. Tente novamente.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] max-h-[90vh] overflow-y-auto p-0 rounded-xl border border-gray-200 dark:border-white/5">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Preencher Minuta
            </DialogTitle>
            <DialogDescription>
              Insira os dados abaixo para gerar a minuta do processo.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 py-4">
            {/* Seção: Dados do Requerente */}
            <div className="space-y-4 col-span-1 sm:col-span-2 lg:col-span-3">
              <h3 className="font-semibold text-lg border-b pb-2">Dados do Requerente</h3>
            </div>

            {/* Nome Completo - ocupa largura total em todas as telas */}
            <div className="space-y-2 col-span-1 sm:col-span-2 lg:col-span-3">
              <Label htmlFor="nome_completo">
                Nome Completo *
              </Label>
              <Input
                id="nome_completo"
                value={formData.nome_completo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange("nome_completo", e.target.value)}
                placeholder="João Silva Santos"
                className={cn(errors.nome_completo ? "border-red-500" : "", "w-full")}
                disabled={clientePrefill.nome_completo}
              />
              {errors.nome_completo && (
                <p className="text-sm text-red-500">{errors.nome_completo}</p>
              )}
            </div>

            {/* Naturalidade - largura total em mobile, meia tela em tablet/desktop */}
            <div className="space-y-2 col-span-1 sm:col-span-1 lg:col-span-1">
              <Label htmlFor="naturalidade">
                Naturalidade *
              </Label>
              <Input
                id="naturalidade"
                value={formData.naturalidade}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange("naturalidade", e.target.value)}
                placeholder="Luanda"
                className={cn(errors.naturalidade ? "border-red-500" : "", "w-full")}
                disabled={clientePrefill.naturalidade}
              />
              {errors.naturalidade && (
                <p className="text-sm text-red-500">{errors.naturalidade}</p>
              )}
            </div>

            {/* Nacionalidade */}
            <div className="space-y-2 col-span-1 sm:col-span-1 lg:col-span-1">
              <Label htmlFor="nacionalidade">
                Nacionalidade *
              </Label>
              <Input
                id="nacionalidade"
                value={formData.nacionalidade}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange("nacionalidade", e.target.value)}
                placeholder="Angolana"
                className={cn(errors.nacionalidade ? "border-red-500" : "", "w-full")}
                disabled={clientePrefill.nacionalidade}
              />
              {errors.nacionalidade && (
                <p className="text-sm text-red-500">{errors.nacionalidade}</p>
              )}
            </div>

            {/* Número do Passaporte */}
            <div className="space-y-2 col-span-1 sm:col-span-1 lg:col-span-1">
              <Label htmlFor="num_passaporte">
                Número do Passaporte *
              </Label>
              <Input
                id="num_passaporte"
                value={formData.num_passaporte}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange("num_passaporte", e.target.value)}
                placeholder="N3085414"
                className={cn(errors.num_passaporte ? "border-red-500" : "", "w-full")}
                disabled={clientePrefill.num_passaporte}
              />
              {errors.num_passaporte && (
                <p className="text-sm text-red-500">{errors.num_passaporte}</p>
              )}
            </div>

            {/* Data de Emissão */}
            <div className="space-y-2 col-span-1 sm:col-span-1 lg:col-span-1">
              <Label htmlFor="data_emissao">
                Data de Emissão *
              </Label>
              <input
                type="date"
                id="data_emissao"
                name="data_emissao"
                value={formData.data_emissao ? format(formData.data_emissao, "yyyy-MM-dd") : ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value
                  handleDateChange(
                    "data_emissao",
                    value ? new Date(value) : undefined
                  )
                }}
                disabled={clientePrefill.data_emissao}
                className={cn(
                  "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                  "bg-transparent text-gray-800 dark:text-white/90",
                  "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20",
                  errors.data_emissao && "border-red-500 focus:border-red-500"
                )}
              />
              {errors.data_emissao && <p className="text-sm text-red-500">{errors.data_emissao}</p>}
            </div>

            {/* Data de Validade */}
            <div className="space-y-2 col-span-1 sm:col-span-1 lg:col-span-1">
              <Label htmlFor="data_validade">
                Data de Validade *
              </Label>
              <input
                type="date"
                id="data_validade"
                name="data_validade"
                value={formData.data_validade ? format(formData.data_validade, "yyyy-MM-dd") : ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value
                  handleDateChange(
                    "data_validade",
                    value ? new Date(value) : undefined
                  )
                }}
                disabled={clientePrefill.data_validade}
                className={cn(
                  "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                  "bg-transparent text-gray-800 dark:text-white/90",
                  "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20",
                  errors.data_validade && "border-red-500 focus:border-red-500"
                )}
              />
              {errors.data_validade && <p className="text-sm text-red-500">{errors.data_validade}</p>}
            </div>

            {/* Data Prevista de Estadia - ocupa largura total em todas as telas (campo importante) */}
            <div className="space-y-2 col-span-1 sm:col-span-2 lg:col-span-1">
              <Label htmlFor="data_prevista_estadia">
                Data Prevista de Estadia *
              </Label>
              <input
                type="date"
                id="data_prevista_estadia"
                name="data_prevista_estadia"
                value={formData.data_prevista_estadia ? format(formData.data_prevista_estadia, "yyyy-MM-dd") : ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value
                  handleDateChange(
                    "data_prevista_estadia",
                    value ? new Date(value) : undefined
                  )
                }}
                className={cn(
                  "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                  "bg-transparent text-gray-800 dark:text-white/90",
                  "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20",
                  errors.data_prevista_estadia && "border-red-500 focus:border-red-500"
                )}
              />
              {errors.data_prevista_estadia && <p className="text-sm text-red-500">{errors.data_prevista_estadia}</p>}
            </div>

            {/* Seção: Dados da Formação */}
            <div className="space-y-4 col-span-1 sm:col-span-2 lg:col-span-3 mt-4">
              <h3 className="font-semibold text-lg border-b pb-2">Dados da Formação</h3>
            </div>

            {/* Escola Profissional - largura total em todas as telas */}
            <div className="space-y-2 col-span-1 sm:col-span-2 lg:col-span-3">
              <Label htmlFor="escola_profissional">
                Escola Profissional *
              </Label>
              <Input
                id="escola_profissional"
                value={formData.escola_profissional}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange("escola_profissional", e.target.value)}
                placeholder="Escola Profissional XYZ"
                className={cn(errors.escola_profissional ? "border-red-500" : "", "w-full")}
              />
              {errors.escola_profissional && (
                <p className="text-sm text-red-500">{errors.escola_profissional}</p>
              )}
            </div>

            {/* Curso */}
            <div className="space-y-2 col-span-1 sm:col-span-1 lg:col-span-1">
              <Label htmlFor="curso">
                Curso *
              </Label>
              <Input
                id="curso"
                value={formData.curso}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange("curso", e.target.value)}
                placeholder="Técnico de Recursos Humanos"
                className={cn(errors.curso ? "border-red-500" : "", "w-full")}
              />
              {errors.curso && (
                <p className="text-sm text-red-500">{errors.curso}</p>
              )}
            </div>

            {/* Duração do Curso */}
            <div className="space-y-2 col-span-1 sm:col-span-1 lg:col-span-1">
              <Label htmlFor="duracao_curso">
                Duração do Curso *
              </Label>
              <Input
                id="duracao_curso"
                value={formData.duracao_curso}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange("duracao_curso", e.target.value)}
                placeholder="125h (6 meses)"
                className={cn(errors.duracao_curso ? "border-red-500" : "", "w-full")}
              />
              {errors.duracao_curso && (
                <p className="text-sm text-red-500">{errors.duracao_curso}</p>
              )}
            </div>

            {/* Duração do Estágio */}
            <div className="space-y-2 col-span-1 sm:col-span-1 lg:col-span-1">
              <Label htmlFor="duracao_estagio">
                Duração do Estágio *
              </Label>
              <Input
                id="duracao_estagio"
                value={formData.duracao_estagio}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange("duracao_estagio", e.target.value)}
                placeholder="180h (6 meses)"
                className={cn(errors.duracao_estagio ? "border-red-500" : "", "w-full")}
              />
              {errors.duracao_estagio && (
                <p className="text-sm text-red-500">{errors.duracao_estagio}</p>
              )}
            </div>

            {/* Início da Formação */}
            <div className="space-y-2 col-span-1 sm:col-span-1 lg:col-span-1">
              <Label htmlFor="inicio_formacao_profissional">
                Início da Formação Profissional *
              </Label>
              <input
                type="date"
                id="inicio_formacao_profissional"
                name="inicio_formacao_profissional"
                value={formData.inicio_formacao_profissional ? format(formData.inicio_formacao_profissional, "yyyy-MM-dd") : ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value
                  handleDateChange(
                    "inicio_formacao_profissional",
                    value ? new Date(value) : undefined
                  )
                }}
                className={cn(
                  "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                  "bg-transparent text-gray-800 dark:text-white/90",
                  "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20",
                  errors.inicio_formacao_profissional && "border-red-500 focus:border-red-500"
                )}
              />
              {errors.inicio_formacao_profissional && <p className="text-sm text-red-500">{errors.inicio_formacao_profissional}</p>}
            </div>

            {/* Término da Formação */}
            <div className="space-y-2 col-span-1 sm:col-span-1 lg:col-span-1">
              <Label htmlFor="termino_formacao_profissional">
                Término da Formação Profissional *
              </Label>
              <input
                type="date"
                id="termino_formacao_profissional"
                name="termino_formacao_profissional"
                value={formData.termino_formacao_profissional ? format(formData.termino_formacao_profissional, "yyyy-MM-dd") : ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value
                  handleDateChange(
                    "termino_formacao_profissional",
                    value ? new Date(value) : undefined
                  )
                }}
                className={cn(
                  "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                  "bg-transparent text-gray-800 dark:text-white/90",
                  "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20",
                  errors.termino_formacao_profissional && "border-red-500 focus:border-red-500"
                )}
              />
              {errors.termino_formacao_profissional && <p className="text-sm text-red-500">{errors.termino_formacao_profissional}</p>}
            </div>

            {/* Local de Hospedagem - largura total em todas as telas */}
            <div className="space-y-2 col-span-1 sm:col-span-2 lg:col-span-3">
              <Label htmlFor="local_hospedagem">
                Local de Hospedagem *
              </Label>
              <Textarea
                id="local_hospedagem"
                rows={3}
                value={formData.local_hospedagem}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleTextChange("local_hospedagem", e.target.value)}
                placeholder="Avenida António Correia de Sá, N°14, Monte Abrão, 2745-301-Queluz"
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
              onClick={handleSubmit}
              disabled={isLoading}
              className="gap-2 w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Gerando PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Gerar Minuta
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}