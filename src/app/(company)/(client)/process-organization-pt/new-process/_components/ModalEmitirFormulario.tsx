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
import { Loader2, FileText, Download, Shield, Home, MapPin, Phone, AlertCircle, 
  UserPlus, Building, Target, Info, Briefcase, Users, Plus, X } from "lucide-react"
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

interface ModalEmitirFormularioProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValues?: Partial<FormularioFormValues>
  onSuccess?: (pdfUrl: string) => void
  cliente?: MyClienteType | null
}

interface FormularioFormValues {
  nome_completo: string
  data_nascimento: Date | undefined
  local_nascimento: string
  pais_nascimento: string
  nacionalidade_atual: string
  nacionalidade_a_nascenca: string
  outra_nacionalidade1: string
  outra_nacionalidade2: string
  sexo: "M" | "F"
  estado_civil: string
  outro_estado_civil: string
  autoridade_parental: string
  endereco_autoridade: string
  telefone_autoridade: string
  email_autoridade: string
  nacionalidade_autoridade: string
  num_identidade_nacional: string
  tipo_documento: string
  outro_tipo_documento: string
  num_documento: string
  data_emissao: Date | undefined
  data_validade: Date | undefined
  pais_emissao: string
  endereco: string
  endereco_linha2: string
  endereco_linha3: string
  endereco_linha4: string
  telefone: string[]
  residencia_outro_pais: boolean
  autorizacao_residencia: string
  num_autorizacao_residencia: string
  validade_autorizacao_residencia: Date | undefined
  actividade_profissional_atual: string
  nome_empregador: string
  endereco_empregador: string
  telefone_empregador: string
  nome_estabelecimento_ensino: string
  endereco_estabelecimento_ensino: string
  objetivo_estudo: boolean
  objetivo_formacao: boolean
  objetivo_trabalho: boolean
  objetivo_reagrupamento: boolean
  objetivo_mobilidade_jovem: boolean
  objetivo_tratamento_medico: boolean
  objetivo_reformados: boolean
  objetivo_estagio: boolean
  objetivo_outros: boolean
  outro_objectivo_viagem: string
  info_suplementar1: string
  info_suplementar2: string
  info_suplementar3: string
  estado_membro_destino: string
  estado_membro_entrada: string
  tipo_entrada: string
  data_prevista_chegada: Date | undefined
  data_prevista_saida: Date | undefined
  pessoa_convite_nome: string
  pessoa_convite_nome2: string
  pessoa_convite_morada1: string
  pessoa_convite_morada2: string
  pessoa_convite_morada3: string
  pessoa_convite_morada4: string
  empresa_convite_nome: string
  empresa_convite_endereco: string
  empresa_convite_contacto_nome: string
  empresa_convite_contacto_telefone: string
  empresa_convite_contacto_email: string
  empresa_convite_contacto_endereco: string
  despesas_proprio: boolean
  despesas_garante: boolean
  despesas_dinheiro: boolean
  despesas_cheques: boolean
  despesas_cartoes: boolean
  despesas_alojamento: boolean
  despesas_transporte: boolean
  despesas_alojamento_fornecido: boolean
  despesas_todas_cobertas: boolean
  despesas_outro_especificar: string
  despesas_referido_campo30_31: boolean
  despesas_dinheiro_garante: boolean
  despesas_transporte_garante: boolean
  despesas_garante_outro: string
  despesas_garante_outro_especificar: string
}

const initialFormValues: FormularioFormValues = {
  nome_completo: "",
  data_nascimento: undefined,
  local_nascimento: "",
  pais_nascimento: "",
  nacionalidade_atual: "",
  nacionalidade_a_nascenca: "",
  outra_nacionalidade1: "",
  outra_nacionalidade2: "",
  sexo: "M",
  estado_civil: "",
  outro_estado_civil: "",
  autoridade_parental: "",
  endereco_autoridade: "",
  telefone_autoridade: "",
  email_autoridade: "",
  nacionalidade_autoridade: "",
  num_identidade_nacional: "",
  tipo_documento: "",
  outro_tipo_documento: "",
  num_documento: "",
  data_emissao: undefined,
  data_validade: undefined,
  pais_emissao: "",
  endereco: "",
  endereco_linha2: "",
  endereco_linha3: "",
  endereco_linha4: "",
  telefone: [""],
  residencia_outro_pais: false,
  autorizacao_residencia: "",
  num_autorizacao_residencia: "",
  validade_autorizacao_residencia: undefined,
  actividade_profissional_atual: "",
  nome_empregador: "",
  endereco_empregador: "",
  telefone_empregador: "",
  nome_estabelecimento_ensino: "",
  endereco_estabelecimento_ensino: "",
  objetivo_estudo: false,
  objetivo_formacao: false,
  objetivo_trabalho: false,
  objetivo_reagrupamento: false,
  objetivo_mobilidade_jovem: false,
  objetivo_tratamento_medico: false,
  objetivo_reformados: false,
  objetivo_estagio: false,
  objetivo_outros: false,
  outro_objectivo_viagem: "",
  info_suplementar1: "",
  info_suplementar2: "",
  info_suplementar3: "",
  estado_membro_destino: "",
  estado_membro_entrada: "",
  tipo_entrada: "",
  data_prevista_chegada: undefined,
  data_prevista_saida: undefined,
  pessoa_convite_nome: "",
  pessoa_convite_nome2: "",
  pessoa_convite_morada1: "",
  pessoa_convite_morada2: "",
  pessoa_convite_morada3: "",
  pessoa_convite_morada4: "",
  empresa_convite_nome: "",
  empresa_convite_endereco: "",
  empresa_convite_contacto_nome: "",
  empresa_convite_contacto_telefone: "",
  empresa_convite_contacto_email: "",
  empresa_convite_contacto_endereco: "",
  despesas_proprio: false,
  despesas_garante: false,
  despesas_dinheiro: false,
  despesas_cheques: false,
  despesas_cartoes: false,
  despesas_alojamento: false,
  despesas_transporte: false,
  despesas_alojamento_fornecido: false,
  despesas_todas_cobertas: false,
  despesas_outro_especificar: "",
  despesas_referido_campo30_31: false,
  despesas_dinheiro_garante: false,
  despesas_transporte_garante: false,
  despesas_garante_outro: "",
  despesas_garante_outro_especificar: "",
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
  return value ? format(value, "dd/MM/yyyy") : ""
}

function getInitialValues(
  values?: Partial<FormularioFormValues>,
  cliente?: MyClienteType | null
): FormularioFormValues {
  return {
    ...initialFormValues,
  }
}

export function ModalEmitirFormulario({
  open,
  onOpenChange,
  initialValues,
  onSuccess,
  cliente,
}: ModalEmitirFormularioProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormularioFormValues>(
    getInitialValues(initialValues, cliente)
  )
  const [errors, setErrors] = useState<Partial<Record<keyof FormularioFormValues, string>>>({})

  useEffect(() => {
    if (open) {
      setFormData(getInitialValues(initialValues, cliente))
      setErrors({})
    }
  }, [open, initialValues, cliente])

  const handleTextChange = (field: keyof FormularioFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSelectChange = (field: keyof FormularioFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value as any }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleDateChange = (field: keyof FormularioFormValues, date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: date }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleCheckboxChange = (field: keyof FormularioFormValues, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: checked }))
  }

  const handleTelefoneChange = (index: number, value: string) => {
    setFormData((prev) => {
      const telefone = [...prev.telefone]
      telefone[index] = value
      return { ...prev, telefone }
    })
  }

  const addTelefone = () => {
    setFormData((prev) => ({
      ...prev,
      telefone: [...prev.telefone, ""],
    }))
  }

  const removeTelefone = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      telefone: prev.telefone.filter((_, i) => i !== index),
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormularioFormValues, string>> = {}

    if (!formData.nome_completo?.trim()) {
      newErrors.nome_completo = "Nome completo é obrigatório"
    }
    if (!formData.data_nascimento) {
      newErrors.data_nascimento = "Data de nascimento é obrigatória"
    }
    if (!formData.local_nascimento?.trim()) {
      newErrors.local_nascimento = "Local de nascimento é obrigatório"
    }
    if (!formData.pais_nascimento?.trim()) {
      newErrors.pais_nascimento = "País de nascimento é obrigatório"
    }
    if (!formData.nacionalidade_atual?.trim()) {
      newErrors.nacionalidade_atual = "Nacionalidade atual é obrigatória"
    }
    if (!formData.nacionalidade_a_nascenca?.trim()) {
      newErrors.nacionalidade_a_nascenca = "Nacionalidade à nascença é obrigatória"
    }
    if (!formData.sexo) {
      newErrors.sexo = "Sexo é obrigatório"
    }
    if (!formData.estado_civil?.trim()) {
      newErrors.estado_civil = "Estado civil é obrigatório"
    }
    if (!formData.num_documento?.trim()) {
      newErrors.num_documento = "Número do documento é obrigatório"
    }
    if (!formData.data_emissao) {
      newErrors.data_emissao = "Data de emissão é obrigatória"
    }
    if (!formData.data_validade) {
      newErrors.data_validade = "Data de validade é obrigatória"
    }
    if (!formData.endereco?.trim()) {
      newErrors.endereco = "Endereço é obrigatório"
    }
    if (!formData.telefone[0]?.trim()) {
      newErrors.telefone = "Pelo menos um telefone é obrigatório"
    }
    if (!formData.estado_membro_destino?.trim()) {
      newErrors.estado_membro_destino = "Estado membro de destino é obrigatório"
    }
    if (!formData.estado_membro_entrada?.trim()) {
      newErrors.estado_membro_entrada = "Estado membro de entrada é obrigatório"
    }
    if (!formData.data_prevista_chegada) {
      newErrors.data_prevista_chegada = "Data prevista de chegada é obrigatória"
    }
    if (!formData.data_prevista_saida) {
      newErrors.data_prevista_saida = "Data prevista de saída é obrigatória"
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
        data_nascimento: formatDateForPayload(formData.data_nascimento),
        local_nascimento: formData.local_nascimento,
        pais_nascimento: formData.pais_nascimento,
        nacionalidade_atual: formData.nacionalidade_atual,
        nacionalidade_a_nascenca: formData.nacionalidade_a_nascenca,
        outra_nacionalidade1: formData.outra_nacionalidade1,
        outra_nacionalidade2: formData.outra_nacionalidade2,
        sexo: formData.sexo,
        estado_civil: formData.estado_civil,
        outro_estado_civil: formData.outro_estado_civil,
        autoridade_parental: formData.autoridade_parental,
        endereco_autoridade: formData.endereco_autoridade,
        telefone_autoridade: formData.telefone_autoridade,
        email_autoridade: formData.email_autoridade,
        nacionalidade_autoridade: formData.nacionalidade_autoridade,
        num_identidade_nacional: formData.num_identidade_nacional,
        tipo_documento: formData.tipo_documento,
        outro_tipo_documento: formData.outro_tipo_documento,
        num_documento: formData.num_documento,
        data_emissao: formatDateForPayload(formData.data_emissao),
        data_validade: formatDateForPayload(formData.data_validade),
        pais_emissao: formData.pais_emissao,
        endereco: formData.endereco,
        endereco_linha2: formData.endereco_linha2,
        endereco_linha3: formData.endereco_linha3,
        endereco_linha4: formData.endereco_linha4,
        telefone: formData.telefone.filter((t) => t.trim() !== ""),
        residencia_outro_pais: formData.residencia_outro_pais,
        autorizacao_residencia: formData.autorizacao_residencia,
        num_autorizacao_residencia: formData.num_autorizacao_residencia,
        validade_autorizacao_residencia: formatDateForPayload(formData.validade_autorizacao_residencia),
        actividade_profissional_atual: formData.actividade_profissional_atual,
        nome_empregador: formData.nome_empregador,
        endereco_empregador: formData.endereco_empregador,
        telefone_empregador: formData.telefone_empregador,
        nome_estabelecimento_ensino: formData.nome_estabelecimento_ensino,
        endereco_estabelecimento_ensino: formData.endereco_estabelecimento_ensino,
        objetivo_estudo: formData.objetivo_estudo,
        objetivo_formacao: formData.objetivo_formacao,
        objetivo_trabalho: formData.objetivo_trabalho,
        objetivo_reagrupamento: formData.objetivo_reagrupamento,
        objetivo_mobilidade_jovem: formData.objetivo_mobilidade_jovem,
        objetivo_tratamento_medico: formData.objetivo_tratamento_medico,
        objetivo_reformados: formData.objetivo_reformados,
        objetivo_estagio: formData.objetivo_estagio,
        objetivo_outros: formData.objetivo_outros,
        outro_objectivo_viagem: formData.outro_objectivo_viagem,
        info_suplementar1: formData.info_suplementar1,
        info_suplementar2: formData.info_suplementar2,
        info_suplementar3: formData.info_suplementar3,
        estado_membro_destino: formData.estado_membro_destino,
        estado_membro_entrada: formData.estado_membro_entrada,
        tipo_entrada: formData.tipo_entrada,
        data_prevista_chegada: formatDateForPayload(formData.data_prevista_chegada),
        data_prevista_saida: formatDateForPayload(formData.data_prevista_saida),
        pessoa_convite_nome: formData.pessoa_convite_nome,
        pessoa_convite_nome2: formData.pessoa_convite_nome2,
        pessoa_convite_morada1: formData.pessoa_convite_morada1,
        pessoa_convite_morada2: formData.pessoa_convite_morada2,
        pessoa_convite_morada3: formData.pessoa_convite_morada3,
        pessoa_convite_morada4: formData.pessoa_convite_morada4,
        empresa_convite_nome: formData.empresa_convite_nome,
        empresa_convite_endereco: formData.empresa_convite_endereco,
        empresa_convite_contacto_nome: formData.empresa_convite_contacto_nome,
        empresa_convite_contacto_telefone: formData.empresa_convite_contacto_telefone,
        empresa_convite_contacto_email: formData.empresa_convite_contacto_email,
        empresa_convite_contacto_endereco: formData.empresa_convite_contacto_endereco,
        despesas_proprio: formData.despesas_proprio,
        despesas_garante: formData.despesas_garante,
        despesas_dinheiro: formData.despesas_dinheiro,
        despesas_cheques: formData.despesas_cheques,
        despesas_cartoes: formData.despesas_cartoes,
        despesas_alojamento: formData.despesas_alojamento,
        despesas_transporte: formData.despesas_transporte,
        despesas_alojamento_fornecido: formData.despesas_alojamento_fornecido,
        despesas_todas_cobertas: formData.despesas_todas_cobertas,
        despesas_outro_especificar: formData.despesas_outro_especificar,
        despesas_referido_campo30_31: formData.despesas_referido_campo30_31,
        despesas_dinheiro_garante: formData.despesas_dinheiro_garante,
        despesas_transporte_garante: formData.despesas_transporte_garante,
        despesas_garante_outro: formData.despesas_garante_outro,
        despesas_garante_outro_especificar: formData.despesas_garante_outro_especificar,
      }

      // console.log(payload);
      // return;

      const response = await api.post('formulario/gerar-pdf', payload, {
        responseType: 'blob'
      })

      const contentType = String(response.headers['content-type']) || ''
      if (!contentType.includes('application/pdf')) {
        const text = await response.data.text()
        console.error('Resposta não é PDF:', text.substring(0, 500))
        throw new Error('Erro ao gerar formulário. Tente novamente.')
      }

      if (response.data.size === 0) {
        throw new Error('Erro ao gerar formulário. Tente novamente.')
      }

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `formulario_${formData.nome_completo.replace(/\s/g, "_")}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("Formulário gerado com sucesso!")
      onSuccess?.(url)
      onOpenChange(false)
    } catch (error: any) {
      console.error("Erro detalhado:", error)

      if (error.response && error.response.data instanceof Blob) {
        try {
          const errorText = await error.response.data.text()
          const errorJson = JSON.parse(errorText)
          toast.error(errorJson.message || "Erro ao gerar formulário")
        } catch {
          toast.error("Erro ao gerar formulário. Tente novamente.")
        }
      } else {
        toast.error(error.message || "Erro ao gerar formulário. Tente novamente.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const inputDateClass = cn(
    "h-9 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
    "bg-transparent text-gray-800 dark:text-white/90",
    "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw] xl:max-w-[80vw] max-h-[90vh] overflow-y-auto p-0 rounded-xl border border-gray-200 dark:border-white/5">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Emitir Formulário
            </DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para gerar o formulário do viajante.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 py-4">
            {/* Seção: Dados Pessoais */}
            <div className="col-span-full mb-2">
              <div className="flex items-center gap-2 pb-2 border-b">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="text-md font-semibold">Dados Pessoais</h3>
              </div>
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="nome_completo">Nome Completo *</Label>
              <Input
                id="nome_completo"
                value={formData.nome_completo}
                onChange={(e) => handleTextChange("nome_completo", e.target.value)}
                placeholder="Nome completo do viajante"
                className={cn(errors.nome_completo ? "border-red-500" : "", "w-full")}
              />
              {errors.nome_completo && <p className="text-sm text-red-500">{errors.nome_completo}</p>}
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
              <input
                type="date"
                id="data_nascimento"
                value={formData.data_nascimento ? format(formData.data_nascimento, "yyyy-MM-dd") : ""}
                onChange={(e) => handleDateChange("data_nascimento", e.target.value ? new Date(e.target.value) : undefined)}
                className={cn(inputDateClass, errors.data_nascimento && "border-red-500")}
              />
              {errors.data_nascimento && <p className="text-sm text-red-500">{errors.data_nascimento}</p>}
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="local_nascimento">Local de Nascimento *</Label>
              <Input
                id="local_nascimento"
                value={formData.local_nascimento}
                onChange={(e) => handleTextChange("local_nascimento", e.target.value)}
                placeholder="Ex: Luanda"
                className={cn(errors.local_nascimento ? "border-red-500" : "", "w-full")}
              />
              {errors.local_nascimento && <p className="text-sm text-red-500">{errors.local_nascimento}</p>}
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="pais_nascimento">País de Nascimento *</Label>
              <Input
                id="pais_nascimento"
                value={formData.pais_nascimento}
                onChange={(e) => handleTextChange("pais_nascimento", e.target.value)}
                placeholder="Ex: Angola"
                className={cn(errors.pais_nascimento ? "border-red-500" : "", "w-full")}
              />
              {errors.pais_nascimento && <p className="text-sm text-red-500">{errors.pais_nascimento}</p>}
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="nacionalidade_atual">Nacionalidade Atual *</Label>
              <Input
                id="nacionalidade_atual"
                value={formData.nacionalidade_atual}
                onChange={(e) => handleTextChange("nacionalidade_atual", e.target.value)}
                placeholder="Ex: Angolana"
                className={cn(errors.nacionalidade_atual ? "border-red-500" : "", "w-full")}
              />
              {errors.nacionalidade_atual && <p className="text-sm text-red-500">{errors.nacionalidade_atual}</p>}
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="nacionalidade_a_nascenca">Nacionalidade à Nascença *</Label>
              <Input
                id="nacionalidade_a_nascenca"
                value={formData.nacionalidade_a_nascenca}
                onChange={(e) => handleTextChange("nacionalidade_a_nascenca", e.target.value)}
                placeholder="Ex: Angolana"
                className={cn(errors.nacionalidade_a_nascenca ? "border-red-500" : "", "w-full")}
              />
              {errors.nacionalidade_a_nascenca && <p className="text-sm text-red-500">{errors.nacionalidade_a_nascenca}</p>}
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="outra_nacionalidade1">Outra Nacionalidade (1)</Label>
              <Input
                id="outra_nacionalidade1"
                value={formData.outra_nacionalidade1}
                onChange={(e) => handleTextChange("outra_nacionalidade1", e.target.value)}
                placeholder="Ex: Portuguesa"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="outra_nacionalidade2">Outra Nacionalidade (2)</Label>
              <Input
                id="outra_nacionalidade2"
                value={formData.outra_nacionalidade2}
                onChange={(e) => handleTextChange("outra_nacionalidade2", e.target.value)}
                placeholder="Ex: Brasileira"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="sexo">Sexo *</Label>
              <Select
                value={formData.sexo}
                onValueChange={(value) => handleSelectChange("sexo", value)}
              >
                <SelectTrigger className={cn(errors.sexo ? "border-red-500" : "", "w-full")}>
                  <SelectValue placeholder="Selecione o sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Feminino</SelectItem>
                </SelectContent>
              </Select>
              {errors.sexo && <p className="text-sm text-red-500">{errors.sexo}</p>}
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="estado_civil">Estado Civil *</Label>
              <Select
                value={formData.estado_civil}
                onValueChange={(value) => handleSelectChange("estado_civil", value)}
              >
                <SelectTrigger className={cn(errors.estado_civil ? "border-red-500" : "", "w-full")}>
                  <SelectValue placeholder="Selecione o estado civil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                  <SelectItem value="casado">Casado(a)</SelectItem>
                  <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                  <SelectItem value="separado">Separado(a)</SelectItem>
                  <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              {errors.estado_civil && <p className="text-sm text-red-500">{errors.estado_civil}</p>}
            </div>

            {formData.estado_civil === "outro" && (
              <div className="space-y-2 ">
                <Label htmlFor="outro_estado_civil">Outro Estado Civil</Label>
                <Input
                  id="outro_estado_civil"
                  value={formData.outro_estado_civil}
                  onChange={(e) => handleTextChange("outro_estado_civil", e.target.value)}
                  placeholder="Especifique o estado civil"
                />
              </div>
            )}

            {/* Seção: Autoridade Parental */}
            <div className="col-span-full mt-4 mb-2">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="text-md font-semibold">Autoridade Parental</h3>
              </div>
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="autoridade_parental">Autoridade Parental</Label>
              <Input
                id="autoridade_parental"
                value={formData.autoridade_parental}
                onChange={(e) => handleTextChange("autoridade_parental", e.target.value)}
                placeholder="Nome da autoridade parental"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="endereco_autoridade">Endereço da Autoridade</Label>
              <Input
                id="endereco_autoridade"
                value={formData.endereco_autoridade}
                onChange={(e) => handleTextChange("endereco_autoridade", e.target.value)}
                placeholder="Endereço completo"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="telefone_autoridade">Telefone da Autoridade</Label>
              <Input
                id="telefone_autoridade"
                value={formData.telefone_autoridade}
                onChange={(e) => handleTextChange("telefone_autoridade", e.target.value)}
                placeholder="+244 923 456 789"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="email_autoridade">Email da Autoridade</Label>
              <Input
                id="email_autoridade"
                type="email"
                value={formData.email_autoridade}
                onChange={(e) => handleTextChange("email_autoridade", e.target.value)}
                placeholder="autoridade@email.com"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="nacionalidade_autoridade">Nacionalidade da Autoridade</Label>
              <Input
                id="nacionalidade_autoridade"
                value={formData.nacionalidade_autoridade}
                onChange={(e) => handleTextChange("nacionalidade_autoridade", e.target.value)}
                placeholder="Ex: Angolana"
              />
            </div>

            {/* Seção: Documento de Identidade */}
            <div className="col-span-full mt-4 mb-2">
              <div className="flex items-center gap-2 pb-2 border-b">
                <AlertCircle className="h-4 w-4 text-primary" />
                <h3 className="text-md font-semibold">Documento de Identidade</h3>
              </div>
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="num_identidade_nacional">Nº Identidade Nacional</Label>
              <Input
                id="num_identidade_nacional"
                value={formData.num_identidade_nacional}
                onChange={(e) => handleTextChange("num_identidade_nacional", e.target.value)}
                placeholder="Número do documento nacional"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="tipo_documento">Tipo de Documento</Label>
              <Select
                value={formData.tipo_documento}
                onValueChange={(value) => handleSelectChange("tipo_documento", value)}
              >
                <SelectTrigger className={cn(errors.tipo_documento ? "border-red-500" : "", "w-full")}>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passaporte">Passaporte</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo_documento && <p className="text-sm text-red-500">{errors.tipo_documento}</p>}
            </div>

            {formData.tipo_documento === "outro" && (
              <div className="space-y-2 ">
                <Label htmlFor="outro_tipo_documento">Outro Tipo de Documento</Label>
                <Input
                  id="outro_tipo_documento"
                  value={formData.outro_tipo_documento}
                  onChange={(e) => handleTextChange("outro_tipo_documento", e.target.value)}
                  placeholder="Especifique o tipo"
                />
              </div>
            )}

            <div className="space-y-2 ">
              <Label htmlFor="num_documento">Nº do Documento *</Label>
              <Input
                id="num_documento"
                value={formData.num_documento}
                onChange={(e) => handleTextChange("num_documento", e.target.value)}
                placeholder="Número do documento"
                className={cn(errors.num_documento ? "border-red-500" : "", "w-full")}
              />
              {errors.num_documento && <p className="text-sm text-red-500">{errors.num_documento}</p>}
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="data_emissao">Data de Emissão *</Label>
              <input
                type="date"
                id="data_emissao"
                value={formData.data_emissao ? format(formData.data_emissao, "yyyy-MM-dd") : ""}
                onChange={(e) => handleDateChange("data_emissao", e.target.value ? new Date(e.target.value) : undefined)}
                className={cn(inputDateClass, errors.data_emissao && "border-red-500")}
              />
              {errors.data_emissao && <p className="text-sm text-red-500">{errors.data_emissao}</p>}
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="data_validade">Data de Validade *</Label>
              <input
                type="date"
                id="data_validade"
                value={formData.data_validade ? format(formData.data_validade, "yyyy-MM-dd") : ""}
                onChange={(e) => handleDateChange("data_validade", e.target.value ? new Date(e.target.value) : undefined)}
                className={cn(inputDateClass, errors.data_validade && "border-red-500")}
              />
              {errors.data_validade && <p className="text-sm text-red-500">{errors.data_validade}</p>}
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="pais_emissao">País de Emissão</Label>
              <Input
                id="pais_emissao"
                value={formData.pais_emissao}
                onChange={(e) => handleTextChange("pais_emissao", e.target.value)}
                placeholder="Ex: Angola"
              />
            </div>

            {/* Seção: Endereço */}
            <div className="col-span-full mt-4 mb-2">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Home className="h-4 w-4 text-primary" />
                <h3 className="text-md font-semibold">Endereço</h3>
              </div>
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="endereco">Endereço *</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => handleTextChange("endereco", e.target.value)}
                placeholder="Rua Principal, 123"
                className={cn(errors.endereco ? "border-red-500" : "", "w-full")}
              />
              {errors.endereco && <p className="text-sm text-red-500">{errors.endereco}</p>}
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="endereco_linha2">Endereço (Linha 2)</Label>
              <Input
                id="endereco_linha2"
                value={formData.endereco_linha2}
                onChange={(e) => handleTextChange("endereco_linha2", e.target.value)}
                placeholder="Bairro Central"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="endereco_linha3">Endereço (Linha 3)</Label>
              <Input
                id="endereco_linha3"
                value={formData.endereco_linha3}
                onChange={(e) => handleTextChange("endereco_linha3", e.target.value)}
                placeholder="Cidade"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="endereco_linha4">Endereço (Linha 4)</Label>
              <Input
                id="endereco_linha4"
                value={formData.endereco_linha4}
                onChange={(e) => handleTextChange("endereco_linha4", e.target.value)}
                placeholder="País"
              />
            </div>

            {/* Telefones */}
            <div className="space-y-2 col-span-full">
              <Label>Telefones *</Label>
              {formData.telefone.map((tel, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={tel}
                    onChange={(e) => handleTelefoneChange(index, e.target.value)}
                    placeholder={index === 0 ? "Telefone principal" : `Telefone ${index + 1}`}
                    className={cn(index === 0 && errors.telefone ? "border-red-500" : "", "flex-1")}
                  />
                  {formData.telefone.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTelefone(index)}
                      className="h-9 w-9 shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {errors.telefone && <p className="text-sm text-red-500">{errors.telefone}</p>}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTelefone}
                className="gap-1 mt-1"
              >
                <Plus className="h-4 w-4" />
                Adicionar telefone
              </Button>
            </div>

            {/* Seção: Residência */}
            <div className="col-span-full mt-4 mb-2">
              <div className="flex items-center gap-2 pb-2 border-b">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="text-md font-semibold">Residência</h3>
              </div>
            </div>

            <div className="space-y-2 ">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="residencia_outro_pais"
                  checked={formData.residencia_outro_pais}
                  onChange={(e) => handleCheckboxChange("residencia_outro_pais", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="residencia_outro_pais" className="cursor-pointer">
                  Residência noutro país
                </Label>
              </div>
            </div>

            {formData.residencia_outro_pais && (
              <>
                <div className="space-y-2 ">
                  <Label htmlFor="autorizacao_residencia">Autorização de Residência</Label>
                  <Input
                    id="autorizacao_residencia"
                    value={formData.autorizacao_residencia}
                    onChange={(e) => handleTextChange("autorizacao_residencia", e.target.value)}
                    placeholder="Autorização de Residência nº"
                  />
                </div>

                <div className="space-y-2 ">
                  <Label htmlFor="num_autorizacao_residencia">Nº Autorização</Label>
                  <Input
                    id="num_autorizacao_residencia"
                    value={formData.num_autorizacao_residencia}
                    onChange={(e) => handleTextChange("num_autorizacao_residencia", e.target.value)}
                    placeholder="AR-2020-12345"
                  />
                </div>

                <div className="space-y-2 ">
                  <Label htmlFor="validade_autorizacao_residencia">Validade</Label>
                  <input
                    type="date"
                    id="validade_autorizacao_residencia"
                    value={formData.validade_autorizacao_residencia ? format(formData.validade_autorizacao_residencia, "yyyy-MM-dd") : ""}
                    onChange={(e) => handleDateChange("validade_autorizacao_residencia", e.target.value ? new Date(e.target.value) : undefined)}
                    className={inputDateClass}
                  />
                </div>
              </>
            )}

            {/* Seção: Atividade Profissional */}
            <div className="col-span-full mt-4 mb-2">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Briefcase className="h-4 w-4 text-primary" />
                <h3 className="text-md font-semibold">Atividade Profissional / Ensino</h3>
              </div>
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="actividade_profissional_atual">Atividade Profissional Atual</Label>
              <Input
                id="actividade_profissional_atual"
                value={formData.actividade_profissional_atual}
                onChange={(e) => handleTextChange("actividade_profissional_atual", e.target.value)}
                placeholder="Ex: Engenheiro de Software"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="nome_empregador">Nome do Empregador</Label>
              <Input
                id="nome_empregador"
                value={formData.nome_empregador}
                onChange={(e) => handleTextChange("nome_empregador", e.target.value)}
                placeholder="Nome da empresa"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="endereco_empregador">Endereço do Empregador</Label>
              <Input
                id="endereco_empregador"
                value={formData.endereco_empregador}
                onChange={(e) => handleTextChange("endereco_empregador", e.target.value)}
                placeholder="Endereço completo"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="telefone_empregador">Telefone do Empregador</Label>
              <Input
                id="telefone_empregador"
                value={formData.telefone_empregador}
                onChange={(e) => handleTextChange("telefone_empregador", e.target.value)}
                placeholder="+244 222 333 444"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="nome_estabelecimento_ensino">Estabelecimento de Ensino</Label>
              <Input
                id="nome_estabelecimento_ensino"
                value={formData.nome_estabelecimento_ensino}
                onChange={(e) => handleTextChange("nome_estabelecimento_ensino", e.target.value)}
                placeholder="Nome da instituição de ensino"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="endereco_estabelecimento_ensino">Endereço do Estabelecimento</Label>
              <Input
                id="endereco_estabelecimento_ensino"
                value={formData.endereco_estabelecimento_ensino}
                onChange={(e) => handleTextChange("endereco_estabelecimento_ensino", e.target.value)}
                placeholder="Endereço da instituição"
              />
            </div>

            {/* Seção: Objetivo da Viagem */}
            <div className="col-span-full mt-4 mb-2">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Target className="h-4 w-4 text-primary" />
                <h3 className="text-md font-semibold">Objetivo da Viagem</h3>
              </div>
            </div>

            <div className="col-span-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { field: "objetivo_estudo" as const, label: "Estudo" },
                { field: "objetivo_formacao" as const, label: "Formação" },
                { field: "objetivo_trabalho" as const, label: "Trabalho" },
                { field: "objetivo_reagrupamento" as const, label: "Reagrupamento" },
                { field: "objetivo_mobilidade_jovem" as const, label: "Mobilidade Jovem" },
                { field: "objetivo_tratamento_medico" as const, label: "Tratamento Médico" },
                { field: "objetivo_reformados" as const, label: "Reformados" },
                { field: "objetivo_estagio" as const, label: "Estágio" },
                { field: "objetivo_outros" as const, label: "Outros" },
              ].map(({ field, label }) => (
                <div key={field} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={field}
                    checked={formData[field] as boolean}
                    onChange={(e) => handleCheckboxChange(field, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor={field} className="cursor-pointer text-sm">
                    {label}
                  </Label>
                </div>
              ))}
            </div>

            {formData.objetivo_outros && (
              <div className="space-y-2 ">
                <Label htmlFor="outro_objectivo_viagem">Outro Objetivo</Label>
                <Input
                  id="outro_objectivo_viagem"
                  value={formData.outro_objectivo_viagem}
                  onChange={(e) => handleTextChange("outro_objectivo_viagem", e.target.value)}
                  placeholder="Descreva outro objetivo"
                />
              </div>
            )}

            {/* Seção: Informações Suplementares */}
            <div className="col-span-full mt-4 mb-2">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Info className="h-4 w-4 text-primary" />
                <h3 className="text-md font-semibold">Informações Suplementares</h3>
              </div>
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="info_suplementar1">Informação Suplementar 1</Label>
              <Input
                id="info_suplementar1"
                value={formData.info_suplementar1}
                onChange={(e) => handleTextChange("info_suplementar1", e.target.value)}
                placeholder="Ex: Curso de especialização"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="info_suplementar2">Informação Suplementar 2</Label>
              <Input
                id="info_suplementar2"
                value={formData.info_suplementar2}
                onChange={(e) => handleTextChange("info_suplementar2", e.target.value)}
                placeholder="Ex: Universidade de Coimbra"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="info_suplementar3">Informação Suplementar 3</Label>
              <Input
                id="info_suplementar3"
                value={formData.info_suplementar3}
                onChange={(e) => handleTextChange("info_suplementar3", e.target.value)}
                placeholder="Ex: Duração prevista: 12 meses"
              />
            </div>

            {/* Seção: Dados da Viagem */}
            <div className="col-span-full mt-4 mb-2">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Shield className="h-4 w-4 text-primary" />
                <h3 className="text-md font-semibold">Dados da Viagem</h3>
              </div>
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="estado_membro_destino">Estado Membro de Destino *</Label>
              <Input
                id="estado_membro_destino"
                value={formData.estado_membro_destino}
                onChange={(e) => handleTextChange("estado_membro_destino", e.target.value)}
                placeholder="Ex: PORTUGAL"
                className={cn(errors.estado_membro_destino ? "border-red-500" : "", "w-full")}
              />
              {errors.estado_membro_destino && <p className="text-sm text-red-500">{errors.estado_membro_destino}</p>}
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="estado_membro_entrada">Estado Membro de Entrada *</Label>
              <Input
                id="estado_membro_entrada"
                value={formData.estado_membro_entrada}
                onChange={(e) => handleTextChange("estado_membro_entrada", e.target.value)}
                placeholder="Ex: PORTUGAL"
                className={cn(errors.estado_membro_entrada ? "border-red-500" : "", "w-full")}
              />
              {errors.estado_membro_entrada && <p className="text-sm text-red-500">{errors.estado_membro_entrada}</p>}
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="tipo_entrada">Tipo de Entrada</Label>
              <Select
                value={formData.tipo_entrada}
                onValueChange={(value) => handleSelectChange("tipo_entrada", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dupla">Dupla</SelectItem>
                  <SelectItem value="multiplas">Múltiplas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="data_prevista_chegada">Data Prevista de Chegada *</Label>
              <input
                type="date"
                id="data_prevista_chegada"
                value={formData.data_prevista_chegada ? format(formData.data_prevista_chegada, "yyyy-MM-dd") : ""}
                onChange={(e) => handleDateChange("data_prevista_chegada", e.target.value ? new Date(e.target.value) : undefined)}
                className={cn(inputDateClass, errors.data_prevista_chegada && "border-red-500")}
              />
              {errors.data_prevista_chegada && <p className="text-sm text-red-500">{errors.data_prevista_chegada}</p>}
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="data_prevista_saida">Data Prevista de Saída *</Label>
              <input
                type="date"
                id="data_prevista_saida"
                value={formData.data_prevista_saida ? format(formData.data_prevista_saida, "yyyy-MM-dd") : ""}
                onChange={(e) => handleDateChange("data_prevista_saida", e.target.value ? new Date(e.target.value) : undefined)}
                className={cn(inputDateClass, errors.data_prevista_saida && "border-red-500")}
              />
              {errors.data_prevista_saida && <p className="text-sm text-red-500">{errors.data_prevista_saida}</p>}
            </div>

            {/* Seção: Pessoa de Convite */}
            <div className="col-span-full mt-4 mb-2">
              <div className="flex items-center gap-2 pb-2 border-b">
                <UserPlus className="h-4 w-4 text-primary" />
                <h3 className="text-md font-semibold">Pessoa de Convite</h3>
              </div>
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="pessoa_convite_nome">Nome da Pessoa de Convite</Label>
              <Input
                id="pessoa_convite_nome"
                value={formData.pessoa_convite_nome}
                onChange={(e) => handleTextChange("pessoa_convite_nome", e.target.value)}
                placeholder="Nome completo"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="pessoa_convite_nome2">Nome (2ª pessoa)</Label>
              <Input
                id="pessoa_convite_nome2"
                value={formData.pessoa_convite_nome2}
                onChange={(e) => handleTextChange("pessoa_convite_nome2", e.target.value)}
                placeholder="Nome da segunda pessoa"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="pessoa_convite_morada1">Morada (Linha 1)</Label>
              <Input
                id="pessoa_convite_morada1"
                value={formData.pessoa_convite_morada1}
                onChange={(e) => handleTextChange("pessoa_convite_morada1", e.target.value)}
                placeholder="Rua das Flores, 100"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="pessoa_convite_morada2">Morada (Linha 2)</Label>
              <Input
                id="pessoa_convite_morada2"
                value={formData.pessoa_convite_morada2}
                onChange={(e) => handleTextChange("pessoa_convite_morada2", e.target.value)}
                placeholder="3º Esquerdo"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="pessoa_convite_morada3">Morada (Linha 3)</Label>
              <Input
                id="pessoa_convite_morada3"
                value={formData.pessoa_convite_morada3}
                onChange={(e) => handleTextChange("pessoa_convite_morada3", e.target.value)}
                placeholder="3000-000 Coimbra"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="pessoa_convite_morada4">Morada (Linha 4)</Label>
              <Input
                id="pessoa_convite_morada4"
                value={formData.pessoa_convite_morada4}
                onChange={(e) => handleTextChange("pessoa_convite_morada4", e.target.value)}
                placeholder="Portugal"
              />
            </div>

            {/* Seção: Empresa de Convite */}
            <div className="col-span-full mt-4 mb-2">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Building className="h-4 w-4 text-primary" />
                <h3 className="text-md font-semibold">Empresa / Instituição de Convite</h3>
              </div>
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="empresa_convite_nome">Nome da Empresa</Label>
              <Input
                id="empresa_convite_nome"
                value={formData.empresa_convite_nome}
                onChange={(e) => handleTextChange("empresa_convite_nome", e.target.value)}
                placeholder="Nome da instituição"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="empresa_convite_endereco">Endereço da Empresa</Label>
              <Input
                id="empresa_convite_endereco"
                value={formData.empresa_convite_endereco}
                onChange={(e) => handleTextChange("empresa_convite_endereco", e.target.value)}
                placeholder="Endereço completo"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="empresa_convite_contacto_nome">Nome do Contacto</Label>
              <Input
                id="empresa_convite_contacto_nome"
                value={formData.empresa_convite_contacto_nome}
                onChange={(e) => handleTextChange("empresa_convite_contacto_nome", e.target.value)}
                placeholder="Nome do responsável"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="empresa_convite_contacto_telefone">Telefone do Contacto</Label>
              <Input
                id="empresa_convite_contacto_telefone"
                value={formData.empresa_convite_contacto_telefone}
                onChange={(e) => handleTextChange("empresa_convite_contacto_telefone", e.target.value)}
                placeholder="+351 239 123 456"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="empresa_convite_contacto_email">Email do Contacto</Label>
              <Input
                id="empresa_convite_contacto_email"
                type="email"
                value={formData.empresa_convite_contacto_email}
                onChange={(e) => handleTextChange("empresa_convite_contacto_email", e.target.value)}
                placeholder="contacto@empresa.pt"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="empresa_convite_contacto_endereco">Endereço do Contacto</Label>
              <Input
                id="empresa_convite_contacto_endereco"
                value={formData.empresa_convite_contacto_endereco}
                onChange={(e) => handleTextChange("empresa_convite_contacto_endereco", e.target.value)}
                placeholder="Departamento, Polo"
              />
            </div>

            {/* Seção: Despesas */}
            <div className="col-span-full mt-4 mb-2">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Download className="h-4 w-4 text-primary" />
                <h3 className="text-md font-semibold">Despesas</h3>
              </div>
            </div>

            <div className="col-span-full mb-2">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Responsável pelas Despesas</h4>
            </div>

            <div className="col-span-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[
                { field: "despesas_proprio" as const, label: "Próprio" },
                { field: "despesas_garante" as const, label: "Garante" },
                { field: "despesas_referido_campo30_31" as const, label: "Referido (Campo 30/31)" },
              ].map(({ field, label }) => (
                <div key={field} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={field}
                    checked={formData[field] as boolean}
                    onChange={(e) => handleCheckboxChange(field, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor={field} className="cursor-pointer text-sm">
                    {label}
                  </Label>
                </div>
              ))}
            </div>

            <div className="col-span-full mt-3 mb-2">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Meios Financeiros (Próprio)</h4>
            </div>

            <div className="col-span-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[
                { field: "despesas_dinheiro" as const, label: "Dinheiro" },
                { field: "despesas_cheques" as const, label: "Cheques" },
                { field: "despesas_cartoes" as const, label: "Cartões" },
                { field: "despesas_alojamento" as const, label: "Alojamento" },
                { field: "despesas_transporte" as const, label: "Transporte" },
                { field: "despesas_alojamento_fornecido" as const, label: "Alojamento Fornecido" },
                { field: "despesas_todas_cobertas" as const, label: "Todas Cobertas" },
              ].map(({ field, label }) => (
                <div key={field} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={field}
                    checked={formData[field] as boolean}
                    onChange={(e) => handleCheckboxChange(field, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor={field} className="cursor-pointer text-sm">
                    {label}
                  </Label>
                </div>
              ))}
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="despesas_outro_especificar">Outro (especificar)</Label>
              <Input
                id="despesas_outro_especificar"
                value={formData.despesas_outro_especificar}
                onChange={(e) => handleTextChange("despesas_outro_especificar", e.target.value)}
                placeholder="Especifique outro meio"
              />
            </div>

            <div className="col-span-full mt-3 mb-2">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Meios Financeiros (Garante)</h4>
            </div>

            <div className="col-span-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[
                { field: "despesas_dinheiro_garante" as const, label: "Dinheiro" },
                { field: "despesas_transporte_garante" as const, label: "Transporte" },
              ].map(({ field, label }) => (
                <div key={field} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={field}
                    checked={formData[field] as boolean}
                    onChange={(e) => handleCheckboxChange(field, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor={field} className="cursor-pointer text-sm">
                    {label}
                  </Label>
                </div>
              ))}
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="despesas_garante_outro">Garante Outro</Label>
              <Input
                id="despesas_garante_outro"
                value={formData.despesas_garante_outro}
                onChange={(e) => handleTextChange("despesas_garante_outro", e.target.value)}
                placeholder="Especifique"
              />
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="despesas_garante_outro_especificar">Garante Outro (especificar)</Label>
              <Input
                id="despesas_garante_outro_especificar"
                value={formData.despesas_garante_outro_especificar}
                onChange={(e) => handleTextChange("despesas_garante_outro_especificar", e.target.value)}
                placeholder="Detalhe"
              />
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
                  Emitir Formulário
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
