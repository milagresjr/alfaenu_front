// components/processo/modais/ModalPreencherMinuta.tsx
'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, Loader2, FileText, Download } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "react-toastify"

interface ModalPreencherMinutaProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cliente: any
  onSuccess?: (pdfUrl: string) => void
}

interface FormData {
  nomeCompleto: string
  nacionalidade: string
  estadoCivil: string
  profissao: string
  documentoIdentidade: string
  dataNascimento: Date | undefined
  nomePai: string
  nomeMae: string
  endereco: string
  telefone: string
  email: string
  cursoPretendido: string
  instituicao: string
  dataInicioCurso: Date | undefined
  dataFimCurso: Date | undefined
  valorCurso: string
  formaPagamento: string
  observacoes: string
}

export function ModalPreencherMinuta({ 
  open, 
  onOpenChange, 
  cliente,
  onSuccess 
}: ModalPreencherMinutaProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    nomeCompleto: cliente?.nome || "",
    nacionalidade: cliente?.nacionalidade || "",
    estadoCivil: cliente?.estado_civil || "",
    profissao: "",
    documentoIdentidade: cliente?.n_bi || cliente?.n_passaporte || "",
    dataNascimento: cliente?.data_nascimento ? new Date(cliente.data_nascimento) : undefined,
    nomePai: cliente?.nome_pai || "",
    nomeMae: cliente?.nome_mae || "",
    endereco: cliente?.endereco || "",
    telefone: cliente?.telefone || "",
    email: cliente?.email || "",
    cursoPretendido: "",
    instituicao: "",
    dataInicioCurso: undefined,
    dataFimCurso: undefined,
    valorCurso: "",
    formaPagamento: "",
    observacoes: "",
  })

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    // Validação básica
    if (!formData.cursoPretendido || !formData.instituicao) {
      toast.warning("Preencha o curso e a instituição")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/minuta/preencher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          tipoMinuta: "minuta1",
          clienteId: cliente?.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao gerar minuta")
      }

      // Receber o PDF como blob
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      
      // Criar link para download
      const link = document.createElement("a")
      link.href = url
      link.download = `minuta_${formData.nomeCompleto.replace(/\s/g, "_")}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Limpar URL
      URL.revokeObjectURL(url)
      
      toast.success("Minuta gerada com sucesso!")
      onSuccess?.(url)
      onOpenChange(false)
    } catch (error) {
      console.error("Erro:", error)
      toast.error("Erro ao gerar minuta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[60%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Preencher Minuta 1
          </DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para gerar a minuta personalizada
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Dados Pessoais */}
          <div className="space-y-4 col-span-2">
            <h3 className="font-semibold text-lg border-b pb-2">Dados Pessoais</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomeCompleto">Nome Completo *</Label>
            <Input
              id="nomeCompleto"
              value={formData.nomeCompleto}
              onChange={(e) => handleChange("nomeCompleto", e.target.value)}
              placeholder="Nome completo do requerente"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nacionalidade">Nacionalidade *</Label>
            <Input
              id="nacionalidade"
              value={formData.nacionalidade}
              onChange={(e) => handleChange("nacionalidade", e.target.value)}
              placeholder="Brasileiro"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estadoCivil">Estado Civil</Label>
            <Input
              id="estadoCivil"
              value={formData.estadoCivil}
              onChange={(e) => handleChange("estadoCivil", e.target.value)}
              placeholder="Solteiro, Casado, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profissao">Profissão</Label>
            <Input
              id="profissao"
              value={formData.profissao}
              onChange={(e) => handleChange("profissao", e.target.value)}
              placeholder="Sua profissão"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentoIdentidade">Documento de Identidade *</Label>
            <Input
              id="documentoIdentidade"
              value={formData.documentoIdentidade}
              onChange={(e) => handleChange("documentoIdentidade", e.target.value)}
              placeholder="RG, CPF ou Passaporte"
            />
          </div>

          <div className="space-y-2">
            <Label>Data de Nascimento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dataNascimento && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dataNascimento ? (
                    format(formData.dataNascimento, "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dataNascimento}
                  onSelect={(date) => handleChange("dataNascimento", date)}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomePai">Nome do Pai</Label>
            <Input
              id="nomePai"
              value={formData.nomePai}
              onChange={(e) => handleChange("nomePai", e.target.value)}
              placeholder="Nome completo do pai"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomeMae">Nome da Mãe</Label>
            <Input
              id="nomeMae"
              value={formData.nomeMae}
              onChange={(e) => handleChange("nomeMae", e.target.value)}
              placeholder="Nome completo da mãe"
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="endereco">Endereço Completo</Label>
            <Textarea
              id="endereco"
              value={formData.endereco}
              onChange={(e) => handleChange("endereco", e.target.value)}
              placeholder="Rua, número, bairro, cidade, estado, CEP"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => handleChange("telefone", e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="email@exemplo.com"
            />
          </div>

          {/* Dados do Curso */}
          <div className="space-y-4 col-span-2 mt-4">
            <h3 className="font-semibold text-lg border-b pb-2">Dados do Curso</h3>
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="cursoPretendido">Curso Pretendido *</Label>
            <Input
              id="cursoPretendido"
              value={formData.cursoPretendido}
              onChange={(e) => handleChange("cursoPretendido", e.target.value)}
              placeholder="Nome do curso desejado"
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="instituicao">Instituição de Ensino *</Label>
            <Input
              id="instituicao"
              value={formData.instituicao}
              onChange={(e) => handleChange("instituicao", e.target.value)}
              placeholder="Nome da instituição"
            />
          </div>

          <div className="space-y-2">
            <Label>Data de Início</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dataInicioCurso && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dataInicioCurso ? (
                    format(formData.dataInicioCurso, "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    <span>Selecione a data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dataInicioCurso}
                  onSelect={(date) => handleChange("dataInicioCurso", date)}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Data de Término</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dataFimCurso && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dataFimCurso ? (
                    format(formData.dataFimCurso, "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    <span>Selecione a data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dataFimCurso}
                  onSelect={(date) => handleChange("dataFimCurso", date)}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorCurso">Valor do Curso</Label>
            <Input
              id="valorCurso"
              value={formData.valorCurso}
              onChange={(e) => handleChange("valorCurso", e.target.value)}
              placeholder="R$ 0,00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
            <Input
              id="formaPagamento"
              value={formData.formaPagamento}
              onChange={(e) => handleChange("formaPagamento", e.target.value)}
              placeholder="Parcelado, à vista, bolsa, etc."
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="observacoes">Observações Adicionais</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleChange("observacoes", e.target.value)}
              placeholder="Informações adicionais relevantes..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="gap-2"
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
      </DialogContent>
    </Dialog>
  )
}