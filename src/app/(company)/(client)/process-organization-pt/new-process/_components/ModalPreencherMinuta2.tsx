// components/processo/modais/ModalPreencherMinuta2.tsx
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

interface ModalPreencherMinuta2Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValues?: Partial<MinutaFormValues>
  onSuccess?: (pdfUrl: string) => void
  cliente?: MyClienteType | null
}

interface MinutaFormValues {
  nome: string
  data_nascimento: Date | undefined
  local_nascimento: string
  residencia_atual: string
  num_passaporte: string
  local_emissao: string
  data_emissao: Date | undefined
  data_validade: Date | undefined
  curso: string
  nome_escola: string
  local_escola: string
  data_prevista_chegada: Date | undefined
  local_hospedagem: string
}

const initialFormValues: MinutaFormValues = {
  nome: "",
  data_nascimento: undefined,
  local_nascimento: "",
  residencia_atual: "",
  num_passaporte: "",
  local_emissao: "",
  data_emissao: undefined,
  data_validade: undefined,
  curso: "",
  nome_escola: "",
  local_escola: "",
  data_prevista_chegada: undefined,
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
    nome: cliente?.nome ?? values?.nome ?? initialFormValues.nome,
    num_passaporte: cliente?.n_passaporte ?? cliente?.n_bi ?? values?.num_passaporte ?? initialFormValues.num_passaporte,
    local_emissao: cliente?.emitido_em ?? values?.local_emissao ?? initialFormValues.local_emissao,
    data_emissao: cliente?.data_emissao || cliente?.emitido_em
      ? parseClientDate(cliente?.data_emissao ?? cliente?.emitido_em)
      : values?.data_emissao ?? initialFormValues.data_emissao,
    data_validade: cliente?.valido_ate
      ? parseClientDate(cliente?.valido_ate)
      : values?.data_validade ?? initialFormValues.data_validade,
    data_nascimento: cliente?.data_nascimento 
      ? parseClientDate(cliente?.data_nascimento as any) 
      : values?.data_nascimento ?? initialFormValues.data_nascimento,
    local_nascimento: cliente?.naturalidade ?? values?.local_nascimento ?? initialFormValues.local_nascimento,
    residencia_atual: cliente?.endereco ?? values?.residencia_atual ?? initialFormValues.residencia_atual,
  }
}

export function ModalPreencherMinuta2({
  open,
  onOpenChange,
  initialValues,
  onSuccess,
  cliente,
}: ModalPreencherMinuta2Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<MinutaFormValues>(
    getInitialValues(initialValues, cliente)
  )
  const [errors, setErrors] = useState<Partial<Record<keyof MinutaFormValues, string>>>({})

  const clientePrefill = {
    nome: Boolean(cliente?.nome),
    num_passaporte: Boolean(cliente?.n_passaporte || cliente?.n_bi),
    data_emissao: Boolean(cliente?.data_emissao || cliente?.emitido_em),
    data_validade: Boolean(cliente?.valido_ate),
    data_nascimento: Boolean(cliente?.data_nascimento),
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

    if (!formData.nome?.trim()) {
      newErrors.nome = "Nome é obrigatório"
    }
    if (!formData.num_passaporte?.trim()) {
      newErrors.num_passaporte = "Número do passaporte é obrigatório"
    }
    if (!formData.curso?.trim()) {
      newErrors.curso = "Curso é obrigatório"
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
    if (!formData.data_prevista_chegada) {
      newErrors.data_prevista_chegada = "Data prevista de chegada é obrigatória"
    }
    if (!formData.residencia_atual?.trim()) {
      newErrors.residencia_atual = "Residência atual é obrigatória"
    }

    if(!formData.nome_escola?.trim()){
      newErrors.nome_escola = "Campo obrigatorio";
    }

    if(!formData.local_escola?.trim()){
      newErrors.local_escola = "Campo obrigatorio";
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
        cliente_id: cliente?.id,
        nome: formData.nome,
        data_nascimento: formatDateForPayload(formData.data_nascimento),
        local_nascimento: formData.local_nascimento,
        residencia_atual: formData.residencia_atual,
        num_passaporte: formData.num_passaporte,
        local_emissao: formData.local_emissao,
        data_emissao: formatDateForPayload(formData.data_emissao),
        data_validade: formatDateForPayload(formData.data_validade),
        curso: formData.curso,
        nome_escola: formData.nome_escola,
        local_escola: formData.local_escola,
        data_prevista_chegada: formatDateForPayload(formData.data_prevista_chegada),
        local_hospedagem: formData.local_hospedagem,
      }

      // console.log("Enviando payload para API:", payload)
      const response = await api.post('minuta2/gerar-pdf', payload, {
        responseType: 'blob'
      });

      const contentType = String(response.headers['content-type']) || ''
      if (!contentType.includes('application/pdf')) {
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
      link.download = `minuta2_${formData.nome.replace(/\s/g, "_")}.pdf`
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
              Preencher Minuta 2
            </DialogTitle>
            <DialogDescription>
              Insira os dados abaixo para gerar a minuta do processo.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 py-4">
            {/* Nome */}
            <div className="space-y-2 col-span-1 sm:col-span-2 lg:col-span-3">
              <Label htmlFor="nome">
                Nome * 
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange("nome", e.target.value)}
                placeholder="Helena Manuel"
                className={cn(errors.nome ? "border-red-500" : "", "w-full")}
                disabled={clientePrefill.nome}
              />
              {errors.nome && (
                <p className="text-sm text-red-500">{errors.nome}</p>
              )}
            </div>

            {/* Data de Nascimento */}
            <div className="space-y-2 col-span-1 sm:col-span-1 lg:col-span-1">
              <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
              <input
                type="date"
                id="data_nascimento"
                name="data_nascimento"
                value={formData.data_nascimento ? format(formData.data_nascimento, "yyyy-MM-dd") : ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value
                  handleDateChange("data_nascimento", value ? new Date(value) : undefined)
                }}
                disabled={clientePrefill.data_nascimento}
                className={cn(
                  "h-9 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                  "bg-transparent text-gray-800 dark:text-white/90",
                  "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                )}
              />
            </div>

            {/* Local de Nascimento */}
            <div className="space-y-2 col-span-1 sm:col-span-1 lg:col-span-1">
              <Label htmlFor="local_nascimento">Local de Nascimento *</Label>
              <Input
                id="local_nascimento"
                value={formData.local_nascimento}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange("local_nascimento", e.target.value)}
                placeholder="Luanda"
                className="w-full"
              />
            </div>

            {/* Residência Atual */}
            <div className="space-y-2 col-span-1 sm:col-span-1 lg:col-span-1">
              <Label htmlFor="residencia_atual">Residência Atual * </Label>
              <Input
                id="residencia_atual"
                value={formData.residencia_atual}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange("residencia_atual", e.target.value)}
                placeholder="Endereço atual"
                className="w-full"
              />
              {
                errors.residencia_atual && (
                  <p className="text-sm text-red-500">{errors.residencia_atual}</p>
                )
              }
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
                placeholder="235325"
                className={cn(errors.num_passaporte ? "border-red-500" : "", "w-full")}
                disabled={clientePrefill.num_passaporte}
              />
              {errors.num_passaporte && (
                <p className="text-sm text-red-500">{errors.num_passaporte}</p>
              )}
            </div>

            {/* Local de Emissão */}
            <div className="space-y-2 col-span-1 sm:col-span-1 lg:col-span-1">
              <Label htmlFor="local_emissao">Local de Emissão *</Label>
              <Input
                id="local_emissao"
                value={formData.local_emissao}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange("local_emissao", e.target.value)}
                placeholder="Luanda"
                className="w-full"
              />
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
                  handleDateChange("data_emissao", value ? new Date(value) : undefined)
                }}
                disabled={clientePrefill.data_emissao}
                className={cn(
                  "h-9 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
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
                  handleDateChange("data_validade", value ? new Date(value) : undefined)
                }}
                disabled={clientePrefill.data_validade}
                className={cn(
                  "h-9 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                  "bg-transparent text-gray-800 dark:text-white/90",
                  "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20",
                  errors.data_validade && "border-red-500 focus:border-red-500"
                )}
              />
              {errors.data_validade && <p className="text-sm text-red-500">{errors.data_validade}</p>}
            </div>

            {/* Curso */}
            <div className="space-y-2 col-span-1 sm:col-span-2 lg:col-span-2">
              <Label htmlFor="curso">
                Curso *
              </Label>
              <Input
                id="curso"
                value={formData.curso}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange("curso", e.target.value)}
                placeholder="Informática"
                className={cn(errors.curso ? "border-red-500" : "", "w-full")}
              />
              {errors.curso && (
                <p className="text-sm text-red-500">{errors.curso}</p>
              )}
            </div>

            {/* Nome da Escola */}
            <div className="space-y-2 col-span-1 sm:col-span-1 lg:col-span-1">
              <Label htmlFor="nome_escola">Nome da Escola *</Label>
              <Input
                id="nome_escola"
                value={formData.nome_escola}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange("nome_escola", e.target.value)}
                placeholder="Escola Nova Vida"
                className="w-full"
              />
            </div>

            {/* Local da Escola */}
            <div className="space-y-2 col-span-1 sm:col-span-1 lg:col-span-1">
              <Label htmlFor="local_escola">Local da Escola *</Label>
              <Input
                id="local_escola"
                value={formData.local_escola}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange("local_escola", e.target.value)}
                placeholder="Lisboa"
                className="w-full"
              />
            </div>

            {/* Data Prevista de Chegada */}
            <div className="space-y-2 col-span-1 sm:col-span-2 lg:col-span-1">
              <Label htmlFor="data_prevista_chegada">
                Data Prevista de Chegada *
              </Label>
              <input
                type="date"
                id="data_prevista_chegada"
                name="data_prevista_chegada"
                value={formData.data_prevista_chegada ? format(formData.data_prevista_chegada, "yyyy-MM-dd") : ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value
                  handleDateChange("data_prevista_chegada", value ? new Date(value) : undefined)
                }}
                className={cn(
                  "h-9 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                  "bg-transparent text-gray-800 dark:text-white/90",
                  "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20",
                  errors.data_prevista_chegada && "border-red-500 focus:border-red-500"
                )}
              />
              {errors.data_prevista_chegada && <p className="text-sm text-red-500">{errors.data_prevista_chegada}</p>}
            </div>

            {/* Local de Hospedagem */}
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