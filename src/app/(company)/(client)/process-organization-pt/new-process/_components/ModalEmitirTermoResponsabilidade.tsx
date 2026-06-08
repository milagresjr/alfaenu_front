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
import { Loader2, FileText, Download, Shield, AlertCircle, Home, Phone, MapPin } from "lucide-react"
import { format } from "date-fns"
import { toast } from "react-toastify"
import { api } from "@/services/api"
import { cn } from "@/lib/utils"
import { MyClienteType } from "@/features/myClient/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ModalEmitirTermoResponsabilidadeProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValues?: Partial<TermoFormValues>
  onSuccess?: (pdfUrl: string) => void
  cliente?: MyClienteType | null
}

interface TermoFormValues {
  // Dados pessoais
  nome_completo: string
  apelido: string
  data_nascimento: Date | undefined
  nacionalidade: string
  naturalidade: string
  genero: "M" | "F"
  
  // Residência e Endereço
  rua_bairro: string
  municipio: string
  provincia: string
  telefone: string
  
  // Documento de identidade
  tipo_doc_identidade: "bi" | "passaporte"
  num_doc: string
  data_emissao_doc: Date | undefined
  data_validade_doc: Date | undefined
  local_emissao_doc: string
  
  // Observações (opcional)
  observacoes: string
}

const initialFormValues: TermoFormValues = {
  nome_completo: "",
  apelido: "",
  data_nascimento: undefined,
  nacionalidade: "Angolana",
  naturalidade: "",
  genero: "M",
  rua_bairro: "",
  municipio: "",
  provincia: "",
  telefone: "",
  tipo_doc_identidade: "bi",
  num_doc: "",
  data_emissao_doc: undefined,
  data_validade_doc: undefined,
  local_emissao_doc: "",
  observacoes: "",
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
  values?: Partial<TermoFormValues>,
  cliente?: MyClienteType | null
): TermoFormValues {
  return {
    ...initialFormValues,
    ...values,
    nome_completo: cliente?.nome ?? values?.nome_completo ?? initialFormValues.nome_completo,
    data_nascimento: cliente?.data_nascimento 
      ? parseClientDate(cliente?.data_nascimento as any) 
      : values?.data_nascimento ?? initialFormValues.data_nascimento,
    naturalidade: cliente?.naturalidade ?? values?.naturalidade ?? initialFormValues.naturalidade,
    num_doc: cliente?.n_passaporte ?? cliente?.n_bi ?? values?.num_doc ?? initialFormValues.num_doc,
    data_emissao_doc: cliente?.data_emissao || cliente?.emitido_em
      ? parseClientDate(cliente?.data_emissao ?? cliente?.emitido_em)
      : values?.data_emissao_doc ?? initialFormValues.data_emissao_doc,
    data_validade_doc: cliente?.valido_ate
      ? parseClientDate(cliente?.valido_ate)
      : values?.data_validade_doc ?? initialFormValues.data_validade_doc,
    local_emissao_doc: cliente?.emitido_em ?? values?.local_emissao_doc ?? initialFormValues.local_emissao_doc,
    telefone: cliente?.telefone ?? values?.telefone ?? initialFormValues.telefone,
  }
}

export function ModalEmitirTermoResponsabilidade({
  open,
  onOpenChange,
  initialValues,
  onSuccess,
  cliente,
}: ModalEmitirTermoResponsabilidadeProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<TermoFormValues>(
    getInitialValues(initialValues, cliente)
  )
  const [errors, setErrors] = useState<Partial<Record<keyof TermoFormValues, string>>>({})

  const clientePrefill = {
    nome_completo: Boolean(cliente?.nome),
    data_nascimento: Boolean(cliente?.data_nascimento),
    naturalidade: Boolean(cliente?.naturalidade),
    num_doc: Boolean(cliente?.n_passaporte || cliente?.n_bi),
    data_emissao_doc: Boolean(cliente?.data_emissao || cliente?.emitido_em),
    data_validade_doc: Boolean(cliente?.valido_ate),
    local_emissao_doc: Boolean(cliente?.emitido_em),
    telefone: Boolean(cliente?.telefone),
  }

  useEffect(() => {
    if (open) {
      setFormData(getInitialValues(initialValues, cliente))
      setErrors({})
    }
  }, [open, initialValues, cliente])

  const handleTextChange = (field: keyof TermoFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSelectChange = (field: keyof TermoFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value as any }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleDateChange = (field: keyof TermoFormValues, date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: date }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TermoFormValues, string>> = {}

    // Dados pessoais
    if (!formData.nome_completo?.trim()) {
      newErrors.nome_completo = "Nome completo é obrigatório"
    }
    if (!formData.apelido?.trim()) {
      newErrors.apelido = "Apelido é obrigatório"
    }
    if (!formData.data_nascimento) {
      newErrors.data_nascimento = "Data de nascimento é obrigatória"
    }
    if (!formData.nacionalidade?.trim()) {
      newErrors.nacionalidade = "Nacionalidade é obrigatória"
    }
    if (!formData.naturalidade?.trim()) {
      newErrors.naturalidade = "Naturalidade é obrigatória"
    }
    if (!formData.genero) {
      newErrors.genero = "Gênero é obrigatório"
    }

    // Residência e Endereço
    if (!formData.rua_bairro?.trim()) {
      newErrors.rua_bairro = "Rua/Bairro é obrigatório"
    }
    if (!formData.municipio?.trim()) {
      newErrors.municipio = "Município é obrigatório"
    }
    if (!formData.provincia?.trim()) {
      newErrors.provincia = "Província é obrigatória"
    }
    if (!formData.telefone?.trim()) {
      newErrors.telefone = "Telefone é obrigatório"
    }

    // Documento de identidade
    if (!formData.tipo_doc_identidade) {
      newErrors.tipo_doc_identidade = "Tipo de documento é obrigatório"
    }
    if (!formData.num_doc?.trim()) {
      newErrors.num_doc = "Número do documento é obrigatório"
    }
    if (!formData.data_emissao_doc) {
      newErrors.data_emissao_doc = "Data de emissão é obrigatória"
    }
    if (!formData.data_validade_doc) {
      newErrors.data_validade_doc = "Data de validade é obrigatória"
    }
    if (!formData.local_emissao_doc?.trim()) {
      newErrors.local_emissao_doc = "Local de emissão é obrigatório"
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
        nome_completo: formData.nome_completo,
        apelido: formData.apelido,
        data_nascimento: formatDateForPayload(formData.data_nascimento),
        nacionalidade: formData.nacionalidade,
        naturalidade: formData.naturalidade,
        genero: formData.genero,
        rua_bairro: formData.rua_bairro,
        municipio: formData.municipio,
        provincia: formData.provincia,
        telefone: formData.telefone,
        tipo_doc_identidade: formData.tipo_doc_identidade,
        num_doc: formData.num_doc,
        data_emissao_doc: formatDateForPayload(formData.data_emissao_doc),
        data_validade_doc: formatDateForPayload(formData.data_validade_doc),
        local_emissao_doc: formData.local_emissao_doc,
      }

      const response = await api.post('termo-responsabilidade/gerar-pdf', payload, {
        responseType: 'blob'
      })

      const contentType = String(response.headers['content-type']) || ''
      if (!contentType.includes('application/pdf')) {
        const text = await response.data.text()
        console.error('Resposta não é PDF:', text.substring(0, 500))
        throw new Error('Erro ao gerar termo de responsabilidade. Tente novamente.')
      }

      if (response.data.size === 0) {
        throw new Error('Erro ao gerar termo de responsabilidade. Tente novamente.')
      }

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `termo_responsabilidade_${formData.nome_completo.replace(/\s/g, "_")}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("Termo de responsabilidade gerado com sucesso!")
      onSuccess?.(url)
      onOpenChange(false)
    } catch (error: any) {
      console.error("Erro detalhado:", error)

      if (error.response && error.response.data instanceof Blob) {
        try {
          const errorText = await error.response.data.text()
          const errorJson = JSON.parse(errorText)
          toast.error(errorJson.message || "Erro ao gerar termo de responsabilidade")
        } catch {
          toast.error("Erro ao gerar termo de responsabilidade. Tente novamente.")
        }
      } else {
        toast.error(error.message || "Erro ao gerar termo de responsabilidade. Tente novamente.")
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
              <Shield className="h-6 w-6 text-primary" />
              Emitir Termo de Responsabilidade
            </DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para gerar o termo de responsabilidade do viajante.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 sm:gap-6 py-4">
            {/* Seção: Dados Pessoais */}
            <div className="col-span-full mb-2">
              <div className="flex items-center gap-2 pb-2 border-b">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="text-md font-semibold">Dados Pessoais</h3>
              </div>
            </div>

            {/* Nome Completo */}
            <div className="space-y-2 col-span-full md:col-span-2">
              <Label htmlFor="nome_completo">
                Nome Completo *
              </Label>
              <Input
                id="nome_completo"
                value={formData.nome_completo}
                onChange={(e) => handleTextChange("nome_completo", e.target.value)}
                placeholder="Nome completo do viajante"
                className={cn(errors.nome_completo ? "border-red-500" : "", "w-full")}
                // disabled={clientePrefill.nome_completo}
              />
              {errors.nome_completo && (
                <p className="text-sm text-red-500">{errors.nome_completo}</p>
              )}
            </div>

            {/* Apelido */}
            <div className="space-y-2 col-span-full md:col-span-2">
              <Label htmlFor="apelido">
                Apelido *
              </Label>
              <Input
                id="apelido"
                value={formData.apelido}
                onChange={(e) => handleTextChange("apelido", e.target.value)}
                placeholder="Apelido"
                className={cn(errors.apelido ? "border-red-500" : "", "w-full")}
              />
              {errors.apelido && (
                <p className="text-sm text-red-500">{errors.apelido}</p>
              )}
            </div>

            {/* Data de Nascimento */}
            <div className="space-y-2 col-span-full md:col-span-2">
              <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
              <input
                type="date"
                id="data_nascimento"
                value={formData.data_nascimento ? format(formData.data_nascimento, "yyyy-MM-dd") : ""}
                onChange={(e) => handleDateChange("data_nascimento", e.target.value ? new Date(e.target.value) : undefined)}
                // disabled={clientePrefill.data_nascimento}
                className={cn(
                  "h-9 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                  "bg-transparent text-gray-800 dark:text-white/90",
                  "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20",
                  errors.data_nascimento && "border-red-500"
                )}
              />
              {errors.data_nascimento && <p className="text-sm text-red-500">{errors.data_nascimento}</p>}
            </div>

            {/* Nacionalidade */}
            <div className="space-y-2 col-span-full md:col-span-2">
              <Label htmlFor="nacionalidade">Nacionalidade *</Label>
              <Input
                id="nacionalidade"
                value={formData.nacionalidade}
                onChange={(e) => handleTextChange("nacionalidade", e.target.value)}
                placeholder="Ex: Angolana"
                className={cn(errors.nacionalidade ? "border-red-500" : "", "w-full")}
              />
              {errors.nacionalidade && <p className="text-sm text-red-500">{errors.nacionalidade}</p>}
            </div>

            {/* Naturalidade */}
            <div className="space-y-2 col-span-full md:col-span-2">
              <Label htmlFor="naturalidade">Naturalidade *</Label>
              <Input
                id="naturalidade"
                value={formData.naturalidade}
                onChange={(e) => handleTextChange("naturalidade", e.target.value)}
                placeholder="Ex: Luanda"
                className={cn(errors.naturalidade ? "border-red-500" : "", "w-full")}
                // disabled={clientePrefill.naturalidade}
              />
              {errors.naturalidade && <p className="text-sm text-red-500">{errors.naturalidade}</p>}
            </div>

            {/* Gênero */}
            <div className="space-y-2 col-span-full md:col-span-2">
              <Label htmlFor="genero">Gênero *</Label>
              <Select
                value={formData.genero}
                onValueChange={(value) => handleSelectChange("genero", value)}
              >
                <SelectTrigger className={cn(errors.genero ? "border-red-500" : "", "w-full")}>
                  <SelectValue placeholder="Selecione o gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Feminino</SelectItem>
                </SelectContent>
              </Select>
              {errors.genero && <p className="text-sm text-red-500">{errors.genero}</p>}
            </div>

            {/* Seção: Residência e Endereço */}
            <div className="col-span-full mt-4 mb-2">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Home className="h-4 w-4 text-primary" />
                <h3 className="text-md font-semibold">Residência e Endereço</h3>
              </div>
            </div>

            {/* Rua/Bairro */}
            <div className="space-y-2 col-span-full md:col-span-3">
              <Label htmlFor="rua_bairro">Rua/Bairro *</Label>
              <Input
                id="rua_bairro"
                value={formData.rua_bairro}
                onChange={(e) => handleTextChange("rua_bairro", e.target.value)}
                placeholder="Nome da rua ou bairro"
                className={cn(errors.rua_bairro ? "border-red-500" : "", "w-full")}
              />
              {errors.rua_bairro && <p className="text-sm text-red-500">{errors.rua_bairro}</p>}
            </div>

            {/* Município */}
            <div className="space-y-2 col-span-full md:col-span-3">
              <Label htmlFor="municipio">Município *</Label>
              <Input
                id="municipio"
                value={formData.municipio}
                onChange={(e) => handleTextChange("municipio", e.target.value)}
                placeholder="Ex: Luanda"
                className={cn(errors.municipio ? "border-red-500" : "", "w-full")}
              />
              {errors.municipio && <p className="text-sm text-red-500">{errors.municipio}</p>}
            </div>

            {/* Província */}
            <div className="space-y-2 col-span-full md:col-span-3">
              <Label htmlFor="provincia">Província *</Label>
              <Input
                id="provincia"
                value={formData.provincia}
                onChange={(e) => handleTextChange("provincia", e.target.value)}
                placeholder="Ex: Luanda"
                className={cn(errors.provincia ? "border-red-500" : "", "w-full")}
              />
              {errors.provincia && <p className="text-sm text-red-500">{errors.provincia}</p>}
            </div>

            {/* Telefone */}
            <div className="space-y-2 col-span-full md:col-span-3">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleTextChange("telefone", e.target.value)}
                placeholder="Ex: 923456789"
                className={cn(errors.telefone ? "border-red-500" : "", "w-full")}
                // disabled={clientePrefill.telefone}
              />
              {errors.telefone && <p className="text-sm text-red-500">{errors.telefone}</p>}
            </div>

            {/* Seção: Documento de Identidade */}
            <div className="col-span-full mt-4 mb-2">
              <div className="flex items-center gap-2 pb-2 border-b">
                <AlertCircle className="h-4 w-4 text-primary" />
                <h3 className="text-md font-semibold">Documento de Identidade</h3>
              </div>
            </div>

            {/* Tipo de Documento */}
            <div className="space-y-2 col-span-full md:col-span-2">
              <Label htmlFor="tipo_doc_identidade">Tipo de Documento *</Label>
              <Select
                value={formData.tipo_doc_identidade}
                onValueChange={(value) => handleSelectChange("tipo_doc_identidade", value)}
              >
                <SelectTrigger className={cn(errors.tipo_doc_identidade ? "border-red-500" : "", "w-full")}>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bi">Bilhete de Identidade (BI)</SelectItem>
                  <SelectItem value="passaporte">Passaporte</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo_doc_identidade && <p className="text-sm text-red-500">{errors.tipo_doc_identidade}</p>}
            </div>

            {/* Número do Documento */}
            <div className="space-y-2 col-span-full md:col-span-2">
              <Label htmlFor="num_doc">Número do Documento *</Label>
              <Input
                id="num_doc"
                value={formData.num_doc}
                onChange={(e) => handleTextChange("num_doc", e.target.value)}
                placeholder={formData.tipo_doc_identidade === "bi" ? "Número do BI" : "Número do Passaporte"}
                className={cn(errors.num_doc ? "border-red-500" : "", "w-full")}
                // disabled={clientePrefill.num_doc}
              />
              {errors.num_doc && <p className="text-sm text-red-500">{errors.num_doc}</p>}
            </div>

            {/* Data de Emissão */}
            <div className="space-y-2 col-span-full md:col-span-2">
              <Label htmlFor="data_emissao_doc">Data de Emissão *</Label>
              <input
                type="date"
                id="data_emissao_doc"
                value={formData.data_emissao_doc ? format(formData.data_emissao_doc, "yyyy-MM-dd") : ""}
                onChange={(e) => handleDateChange("data_emissao_doc", e.target.value ? new Date(e.target.value) : undefined)}
                // disabled={clientePrefill.data_emissao_doc}
                className={cn(
                  "h-9 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                  "bg-transparent text-gray-800 dark:text-white/90",
                  "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20",
                  errors.data_emissao_doc && "border-red-500"
                )}
              />
              {errors.data_emissao_doc && <p className="text-sm text-red-500">{errors.data_emissao_doc}</p>}
            </div>

            {/* Data de Validade */}
            <div className="space-y-2 col-span-full md:col-span-2">
              <Label htmlFor="data_validade_doc">Data de Validade *</Label>
              <input
                type="date"
                id="data_validade_doc"
                value={formData.data_validade_doc ? format(formData.data_validade_doc, "yyyy-MM-dd") : ""}
                onChange={(e) => handleDateChange("data_validade_doc", e.target.value ? new Date(e.target.value) : undefined)}
                // disabled={clientePrefill.data_validade_doc}
                className={cn(
                  "h-9 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                  "bg-transparent text-gray-800 dark:text-white/90",
                  "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20",
                  errors.data_validade_doc && "border-red-500"
                )}
              />
              {errors.data_validade_doc && <p className="text-sm text-red-500">{errors.data_validade_doc}</p>}
            </div>

            {/* Local de Emissão */}
            <div className="space-y-2 col-span-full md:col-span-2">
              <Label htmlFor="local_emissao_doc">Local de Emissão *</Label>
              <Input
                id="local_emissao_doc"
                value={formData.local_emissao_doc}
                onChange={(e) => handleTextChange("local_emissao_doc", e.target.value)}
                placeholder="Ex: Luanda"
                className={cn(errors.local_emissao_doc ? "border-red-500" : "", "w-full")}
                // disabled={clientePrefill.local_emissao_doc}
              />
              {errors.local_emissao_doc && <p className="text-sm text-red-500">{errors.local_emissao_doc}</p>}
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
                  Emitir Termo
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}