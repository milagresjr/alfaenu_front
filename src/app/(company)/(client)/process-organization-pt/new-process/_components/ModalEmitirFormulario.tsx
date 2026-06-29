'use client'

import React, { useEffect, useState, useRef } from "react"
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
import { Loader2, FileText, Download, MapPin } from "lucide-react"
import { format } from "date-fns"
import { toast } from "react-toastify"
import { api } from "@/services/api"
import { cn } from "@/lib/utils"
import { MyClienteType } from "@/features/myClient/types"
import { ProcessoData } from "@/types/processo"

interface ModalEmitirFormularioProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValues?: Partial<FormularioFormValues>
  onSuccess?: (pdfUrl: string) => void
  cliente?: MyClienteType | null
  data?: ProcessoData
}

interface FormularioFormValues {
  residencia_outro_pais: boolean
  autorizacao_residencia: string
  num_autorizacao_residencia: string
  validade_autorizacao_residencia: Date | undefined
  data_prevista_chegada?: Date | undefined
  data_prevista_saida?: Date | undefined
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
  despesas_dinheiro_garante: boolean
  despesas_transporte_garante: boolean
  despesas_garante_outro_especificar: string
}

const initialFormValues: FormularioFormValues = {
  residencia_outro_pais: false,
  autorizacao_residencia: "",
  num_autorizacao_residencia: "",
  validade_autorizacao_residencia: undefined,
  despesas_proprio: false,
  despesas_garante: true,
  despesas_dinheiro: false,
  despesas_cheques: false,
  despesas_cartoes: false,
  despesas_alojamento: false,
  despesas_transporte: false,
  despesas_alojamento_fornecido: false,
  despesas_todas_cobertas: false,
  despesas_outro_especificar: "",
  despesas_dinheiro_garante: false,
  despesas_transporte_garante: false,
  despesas_garante_outro_especificar: "",
  data_prevista_chegada: undefined,
  data_prevista_saida: undefined,
}

function formatDateForPayload(value: Date | undefined): string {
  return value ? format(value, "yyyy-MM-dd") : ""
}

function getInitialValues(
  values?: Partial<FormularioFormValues>,
  cliente?: MyClienteType | null
): FormularioFormValues {
  return {
    ...initialFormValues,
    ...values,
  }
}

export function ModalEmitirFormulario({
  open,
  onOpenChange,
  initialValues,
  onSuccess,
  cliente,
  data,
}: ModalEmitirFormularioProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormularioFormValues>(
    getInitialValues(initialValues, cliente)
  )
  const [errors, setErrors] = useState<Partial<Record<keyof FormularioFormValues, string>>>({})

  const initialValuesRef = useRef(initialValues)
  const clienteRef = useRef(cliente)
  initialValuesRef.current = initialValues
  clienteRef.current = cliente

  useEffect(() => {
    if (open) {
      setFormData(getInitialValues(initialValuesRef.current, clienteRef.current))
      setErrors({})
    }
  }, [open])

  const handleTextChange = (field: keyof FormularioFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormularioFormValues, string>> = {}

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
        ...data,
        cliente: null,
        cliente_id: cliente?.id,
        residencia_outro_pais: formData.residencia_outro_pais,
        autorizacao_residencia: formData.autorizacao_residencia,
        num_autorizacao_residencia: formData.num_autorizacao_residencia,
        validade_autorizacao_residencia: formatDateForPayload(formData.validade_autorizacao_residencia),
        data_prevista_chegada: formatDateForPayload(formData.data_prevista_chegada),
        data_prevista_saida: formatDateForPayload(formData.data_prevista_saida),
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
        despesas_dinheiro_garante: formData.despesas_dinheiro_garante,
        despesas_transporte_garante: formData.despesas_transporte_garante,
        despesas_garante_outro_especificar: formData.despesas_garante_outro_especificar,
      }

      console.log(payload);
      return;

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
      link.download = `formulario.pdf`
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
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[75vw] lg:max-w-[65vw] xl:max-w-[55vw] max-h-[90vh] overflow-y-auto p-0 rounded-xl border border-gray-200 dark:border-white/5">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 py-4">


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



            {/* Seção: Viagem */}
            <div className="col-span-full mt-4 mb-2">
              <div className="flex items-center gap-2 pb-2 border-b">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="text-md font-semibold">Viagem</h3>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_prevista_chegada">Data Prevista de Chegada</Label>
              <input
                type="date"
                id="data_prevista_chegada"
                value={formData.data_prevista_chegada ? format(formData.data_prevista_chegada, "yyyy-MM-dd") : ""}
                onChange={(e) => handleDateChange("data_prevista_chegada", e.target.value ? new Date(e.target.value) : undefined)}
                className={inputDateClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_prevista_saida">Data Prevista de Saída</Label>
              <input
                type="date"
                id="data_prevista_saida"
                value={formData.data_prevista_saida ? format(formData.data_prevista_saida, "yyyy-MM-dd") : ""}
                onChange={(e) => handleDateChange("data_prevista_saida", e.target.value ? new Date(e.target.value) : undefined)}
                className={inputDateClass}
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

            <div className="col-span-full flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="responsavel_despesas"
                  checked={formData.despesas_proprio}
                  onChange={() => {
                    setFormData((prev) => ({
                      ...prev,
                      despesas_proprio: true,
                      despesas_garante: false,
                    }))
                  }}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <span className="text-sm font-medium">Próprio</span>
              </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="responsavel_despesas"
                    checked={formData.despesas_garante}
                    onChange={() => {
                      setFormData((prev) => ({
                        ...prev,
                        despesas_proprio: false,
                        despesas_garante: true,
                      }))
                    }}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span className="text-sm font-medium">Garante</span>
                </label>
            </div>

            {formData.despesas_proprio && (
              <>
                <div className="col-span-full mt-3 mb-2">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Meios Financeiros (Próprio)</h4>
                </div>

                <div className="col-span-full grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { field: "despesas_dinheiro" as const, label: "Dinheiro líquido" },
                    { field: "despesas_cheques" as const, label: "Cheques de viagem" },
                    { field: "despesas_cartoes" as const, label: "Cartões de crédito" },
                    { field: "despesas_alojamento" as const, label: "Alojamento pré-pago" },
                    { field: "despesas_transporte" as const, label: "Transporte pré-pago" },
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
              </>
            )}

            {formData.despesas_garante && (
              <>
                <div className="col-span-full mt-3 mb-2">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Meios Financeiros (Garante)</h4>
                </div>

                <div className="col-span-full grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { field: "despesas_dinheiro_garante" as const, label: "Dinheiro líquido" },
                    { field: "despesas_alojamento_fornecido" as const, label: "Alojamento fornecido" },
                    { field: "despesas_todas_cobertas" as const, label: "Todas as despesas cobertas durante a estada" },
                    { field: "despesas_transporte_garante" as const, label: "Transporte pré-pago" },
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
                  <Label htmlFor="despesas_garante_outro_especificar">Outro (especificar)</Label>
                  <Input
                    id="despesas_garante_outro_especificar"
                    value={formData.despesas_garante_outro_especificar}
                    onChange={(e) => handleTextChange("despesas_garante_outro_especificar", e.target.value)}
                    placeholder="Especifique"
                  />
                </div>
              </>
            )}
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
