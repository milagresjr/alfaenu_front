'use client'

import { useState, useRef, useEffect } from "react"
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
import { Loader2, Upload, FileText, AlertCircle, Trash2, Eye, FolderOpen, MapPin, Home, Wallet, Printer, CheckCircle, Check } from "lucide-react"
import { toast } from "react-toastify"
import { cn } from "@/lib/utils"
import { MyClienteType } from "@/features/myClient/types"
import { useQuery } from "@tanstack/react-query"
import { getFinanciadorById } from "@/features/financiador/api/financiadorApi"
import { useCreateSolicitacaoReconhecimentoNotario, useGerarDeclaracaoAutonoma, useGetConfigReconhecimentoNotario } from "@/features/reconhecimento-notario/hooks/useReconhecimentoNotarioQuery"
import { useUploadDeclaracaoServico } from "@/features/documentos-profundo/hooks/useDocumentoProfundoQuery"

type Step = 'checklist' | 'formulario_declaracao' | 'reconhecimento'

interface ModalOutrosDocumentosImportantesProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cliente?: MyClienteType | null
  financiadorId?: number | string | null
  checklistExtrato?: boolean
  checklistDeclaracao?: boolean
  checklistRecibo?: boolean
  declaracaoServicoUrl?: string
  declaracaoServicoNome?: string
  onChecklistChange?: (key: 'checklist_extrato_bancario' | 'checklist_declaracao' | 'checklist_recibo_salarial', value: boolean) => void
  onSuccess?: () => void
}

function getUltimosTresMeses(): string[] {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  const hoje = new Date()
  const resultado: string[] = []
  for (let i = 1; i <= 3; i++) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
    resultado.push(`${meses[data.getMonth()]} ${data.getFullYear()}`)
  }
  return resultado
}

export function ModalOutrosDocumentosImportantes({
  open,
  onOpenChange,
  cliente,
  financiadorId,
  checklistExtrato = false,
  checklistDeclaracao = false,
  checklistRecibo = false,
  declaracaoServicoUrl: propDeclaracaoServicoUrl,
  declaracaoServicoNome: propDeclaracaoServicoNome,
  onChecklistChange,
  onSuccess,
}: ModalOutrosDocumentosImportantesProps) {
  const [step, setStep] = useState<Step>('checklist')
  const [extratoChecked, setExtratoChecked] = useState(false)
  const [declaracaoChecked, setDeclaracaoChecked] = useState(false)
  const [reciboChecked, setReciboChecked] = useState(false)
  const [declaracaoAutonomaUrl, setDeclaracaoAutonomaUrl] = useState<string | null>(null)
  const [isGerandoDeclaracao, setIsGerandoDeclaracao] = useState(false)
  const [declaracaoServicoUrl, setDeclaracaoServicoUrl] = useState<string | null>(null)
  const [declaracaoServicoNome, setDeclaracaoServicoNome] = useState<string | null>(null)
  const [isUploadingDeclaracao, setIsUploadingDeclaracao] = useState(false)

  const [rendimentoMin, setRendimentoMin] = useState('')
  const [rendimentoMax, setRendimentoMax] = useState('')
  const [parentesco, setParentesco] = useState('')
  const [parentescoOutro, setParentescoOutro] = useState('')
  const [parentescoGenero, setParentescoGenero] = useState<'M' | 'F' | null>(null)

  const parentescoOptions = [
    { label: 'Pai', value: 'Pai', genero: 'M' as const },
    { label: 'Mãe', value: 'Mãe', genero: 'F' as const },
    { label: 'Irmão', value: 'Irmão', genero: 'M' as const },
    { label: 'Irmã', value: 'Irmã', genero: 'F' as const },
    { label: 'Tio', value: 'Tio', genero: 'M' as const },
    { label: 'Tia', value: 'Tia', genero: 'F' as const },
    { label: 'Cônjuge', value: 'Cônjuge', genero: 'M' as const },
    { label: 'Outro', value: 'Outro', genero: null },
  ]

  const getParentescoPreposicao = () => {
    if (parentesco === 'Outro') {
      return parentescoGenero === 'F' ? 'da minha' : 'do meu'
    }
    const opt = parentescoOptions.find(o => o.value === parentesco)
    return opt?.genero === 'F' ? 'da minha' : 'do meu'
  }

  const formatKz = (value: string) => {
    const numeric = value.replace(/\D/g, '')
    if (!numeric) return ''
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const unformatKz = (value: string) => value.replace(/\./g, '')

  const [tipoEntrega, setTipoEntrega] = useState<'domicilio' | 'presencial' | null>(null)
  const [enderecoEntrega, setEnderecoEntrega] = useState('')
  const [comprovativo, setComprovativo] = useState<File | null>(null)
  const [erro, setErro] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const declaracaoServicoInputRef = useRef<HTMLInputElement>(null)
  const uploadDeclaracaoMutation = useUploadDeclaracaoServico()

  const { data: financiador } = useQuery({
    queryKey: ["financiador", financiadorId],
    queryFn: () => getFinanciadorById(Number(financiadorId)),
    enabled: !!financiadorId,
  })
  const createSolicitacao = useCreateSolicitacaoReconhecimentoNotario()
  const gerarDeclaracao = useGerarDeclaracaoAutonoma()
  const { data: config } = useGetConfigReconhecimentoNotario()
  const isPorContaPropria = financiador?.tipo_trabalho === 'por_conta_propria'
  const ultimosTresMeses = getUltimosTresMeses()

  useEffect(() => {
    if (open) {
      setExtratoChecked(checklistExtrato)
      setDeclaracaoChecked(checklistDeclaracao)
      setReciboChecked(checklistRecibo)
      setDeclaracaoServicoUrl(propDeclaracaoServicoUrl ?? null)
      setDeclaracaoServicoNome(propDeclaracaoServicoNome ?? null)
    }
  }, [open, checklistExtrato, checklistDeclaracao, checklistRecibo, propDeclaracaoServicoUrl, propDeclaracaoServicoNome])

  useEffect(() => {
    if (!open) {
      setStep('checklist')
      setDeclaracaoAutonomaUrl(null)
      setRendimentoMin('')
      setRendimentoMax('')
      setParentesco('')
      setParentescoOutro('')
      setParentescoGenero(null)
      setTipoEntrega(null)
      setEnderecoEntrega('')
      setComprovativo(null)
      setErro('')
    }
  }, [open])

  const allChecked = extratoChecked && declaracaoChecked && (isPorContaPropria || reciboChecked)

  const handleClose = () => {
    onOpenChange(false)
  }

  const handleGerarDeclaracaoAutonoma = async () => {
    if (!cliente?.id || !financiadorId) {
      toast.error('Dados do cliente/financiador não encontrados.')
      return
    }

    const rendimentoMinNum = unformatKz(rendimentoMin)
    const rendimentoMaxNum = unformatKz(rendimentoMax)
    const parentescoValue = parentesco === 'Outro' ? parentescoOutro : parentesco

    if (!rendimentoMinNum || Number(rendimentoMinNum) <= 0) {
      toast.error('Informe o rendimento mínimo.')
      return
    }
    if (!rendimentoMaxNum || Number(rendimentoMaxNum) <= 0) {
      toast.error('Informe o rendimento máximo.')
      return
    }
    if (Number(rendimentoMaxNum) <= Number(rendimentoMinNum)) {
      toast.error('O rendimento máximo deve ser maior que o mínimo.')
      return
    }
    if (!parentescoValue) {
      toast.error('Selecione o parentesco com o cliente.')
      return
    }

    if (parentesco === 'Outro' && !parentescoGenero) {
      toast.error('Selecione o género do parentesco.')
      return
    }

    setIsGerandoDeclaracao(true)
    try {
      const result = await gerarDeclaracao.mutateAsync({
        cliente_id: cliente.id,
        financiador_id: Number(financiadorId),
        estado_civil: 'Solteiro(a)',
        profissao: '',
        rendimento_min: Number(rendimentoMinNum),
        rendimento_max: Number(rendimentoMaxNum),
        parentesco: parentescoValue,
        parentesco_preposicao: getParentescoPreposicao(),
      })

      if (result.declaracao_autonoma_url) {
        setDeclaracaoAutonomaUrl(result.declaracao_autonoma_url)
        setDeclaracaoChecked(true)
        onChecklistChange?.('checklist_declaracao', true)
        toast.success('Declaração autónoma gerada com sucesso!')
        setStep('checklist')
      }
    } catch {
      toast.error('Erro ao gerar declaração autónoma.')
    } finally {
      setIsGerandoDeclaracao(false)
    }
  }

  const handleImprimir = () => {
    if (declaracaoAutonomaUrl) {
      window.open(declaracaoAutonomaUrl, '_blank')
    }
  }

  const handleUploadDeclaracaoServico = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !cliente?.id) return

    const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png']
    if (!tiposPermitidos.includes(file.type)) {
      toast.error('Apenas ficheiros PDF, JPG ou PNG são permitidos.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('O ficheiro deve ter no máximo 2MB.')
      return
    }

    setIsUploadingDeclaracao(true)
    try {
      const result = await uploadDeclaracaoMutation.mutateAsync({
        clienteId: String(cliente.id),
        file,
      })
      setDeclaracaoServicoUrl(result.declaracao_servico_url)
      setDeclaracaoServicoNome(result.declaracao_servico_nome)
      if (!declaracaoChecked) {
        setDeclaracaoChecked(true)
        onChecklistChange?.('checklist_declaracao', true)
      }
      toast.success('Declaração de serviço enviada com sucesso!')
    } catch(error: any) {
      const msg = error?.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(', ')
        : error?.response?.data?.message || 'Erro ao enviar declaração de serviço.';
      toast.error(msg);
      console.error("Erro ao enviar declaração de serviço.", error?.response?.data || error);
    } finally {
      setIsUploadingDeclaracao(false)
    }
    if (declaracaoServicoInputRef.current) {
      declaracaoServicoInputRef.current.value = ''
    }
  }

  const handleVerDeclaracaoServico = () => {
    if (declaracaoServicoUrl) {
      window.open(declaracaoServicoUrl, '_blank')
    }
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

  const handleSubmitReconhecimento = async () => {
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
    setIsSubmitting(true)

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
          toast.success('Solicitação de reconhecimento notário enviada com sucesso!')
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
          setIsSubmitting(false)
        },
      })
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error)
      toast.error('Erro ao enviar solicitação.')
      setErro('Erro ao enviar solicitação.')
      setIsSubmitting(false)
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
              <FolderOpen className="h-6 w-6 text-primary" />
              Outros Documentos Importantes
            </DialogTitle>
            <DialogDescription>
              Confirme os documentos necessários para o processo.
            </DialogDescription>
          </DialogHeader>

          {step === 'checklist' && (
            <div className="space-y-6 py-4">
              <p className="text-sm text-muted-foreground">
                Marque os documentos que já possui em sua posse:
              </p>

              <div className="space-y-3">
                <label className={cn(
                  "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  extratoChecked ? "border-primary bg-primary/5" : "border-gray-200 dark:border-white/10 hover:border-primary/50"
                )}>
                  <div className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
                    extratoChecked ? "bg-primary border-primary text-white" : "border-gray-400"
                  )}>
                    {extratoChecked && <Check className="h-3.5 w-3.5" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={extratoChecked}
                    onChange={() => {
                      const newVal = !extratoChecked
                      setExtratoChecked(newVal)
                      onChecklistChange?.('checklist_extrato_bancario', newVal)
                    }}
                    className="hidden"
                  />
                  <div>
                    <p className="font-medium text-sm">
                      Extrato bancário do financiador dos últimos 3 meses
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {ultimosTresMeses.join(', ')}
                    </p>
                  </div>
                </label>

                {isPorContaPropria ? (
                  <div className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border-2 transition-all",
                    declaracaoChecked ? "border-primary bg-primary/5" : "border-gray-200 dark:border-white/10"
                  )}>
                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5",
                      declaracaoChecked ? "bg-primary border-primary text-white" : "border-gray-400"
                    )}>
                      {declaracaoChecked && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Declaração Autónoma</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Gere a sua declaração autónoma para reconhecimento notário
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => setStep('formulario_declaracao')}
                        >
                          {declaracaoChecked ? 'Regenerar' : 'Gerar Declaração Autónoma'}
                        </Button>
                        {declaracaoChecked && (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleImprimir}
                            >
                              <Printer className="h-4 w-4 mr-1" />
                              Imprimir
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => setStep('reconhecimento')}
                            >
                              Reconhecer no Notário
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    declaracaoChecked ? "border-primary bg-primary/5" : "border-gray-200 dark:border-white/10 hover:border-primary/50"
                  )}>
                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
                      declaracaoChecked ? "bg-primary border-primary text-white" : "border-gray-400"
                    )}>
                      {declaracaoChecked && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={declaracaoChecked}
                      onChange={() => {
                        const newVal = !declaracaoChecked
                        setDeclaracaoChecked(newVal)
                        onChecklistChange?.('checklist_declaracao', newVal)
                      }}
                      className="hidden"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Declaração de Serviço</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Faça upload da declaração de serviço do financiador (opcional)
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          ref={declaracaoServicoInputRef}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleUploadDeclaracaoServico}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => declaracaoServicoInputRef.current?.click()}
                          disabled={isUploadingDeclaracao}
                        >
                          {isUploadingDeclaracao ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : (
                            <Upload className="h-4 w-4 mr-1" />
                          )}
                          {declaracaoServicoUrl ? 'Substituir Declaração' : 'Upload Declaração'}
                        </Button>
                        {declaracaoServicoUrl && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleVerDeclaracaoServico}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            {declaracaoServicoNome ?? 'Ver'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </label>
                )}

                {!isPorContaPropria && (
                  <label className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    reciboChecked ? "border-primary bg-primary/5" : "border-gray-200 dark:border-white/10 hover:border-primary/50"
                  )}>
                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5",
                      reciboChecked ? "bg-primary border-primary text-white" : "border-gray-400"
                    )}>
                      {reciboChecked && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={reciboChecked}
                      onChange={() => {
                        const newVal = !reciboChecked
                        setReciboChecked(newVal)
                        onChecklistChange?.('checklist_recibo_salarial', newVal)
                      }}
                      className="hidden"
                    />
                    <div>
                      <p className="font-medium text-sm">
                        Recibo salarial dos últimos 3 meses
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {ultimosTresMeses.join(', ')}
                      </p>
                    </div>
                  </label>
                )}
              </div>

              {erro && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {erro}
                  </p>
                </div>
              )}

              <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="w-full sm:w-auto"
                >
                  Fechar
                </Button>
                {isPorContaPropria && !declaracaoChecked ? null : (
                  <Button
                    type="button"
                    onClick={() => {
                      if (!allChecked) {
                        setExtratoChecked(true)
                        setDeclaracaoChecked(true)
                        onChecklistChange?.('checklist_extrato_bancario', true)
                        onChecklistChange?.('checklist_declaracao', true)
                        if (!isPorContaPropria) {
                          setReciboChecked(true)
                          onChecklistChange?.('checklist_recibo_salarial', true)
                        }
                        return
                      }
                      setErro('')
                      if (isPorContaPropria) {
                        setStep('reconhecimento')
                      } else {
                        toast.success('Checklist concluída com sucesso!')
                        handleClose()
                        onSuccess?.()
                      }
                    }}
                    className="gap-2 w-full sm:w-auto"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {allChecked ? 'Concluir' : 'Marcar todos'}
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}

          {step === 'formulario_declaracao' && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-2 mb-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep('checklist')}
                  className="p-0 h-auto text-sm"
                >
                  ← Voltar
                </Button>
              </div>

              <p className="text-sm font-medium">Dados da Declaração Autónoma</p>
              <p className="text-sm text-muted-foreground">
                Preencha os dados para gerar a declaração autónoma do financiador.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Rendimento Mínimo (Kz) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Kz</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={rendimentoMin ? formatKz(rendimentoMin) : rendimentoMin}
                      onChange={(e) => setRendimentoMin(unformatKz(e.target.value))}
                      placeholder="300.000"
                      className={cn(
                        "w-full rounded-lg border border-gray-300 dark:border-white/10 pl-10 pr-4 py-2.5 text-sm",
                        "focus:outline-none focus:border-brand-300 focus:ring-brand-500/20",
                        "bg-transparent text-gray-800 dark:text-white/90"
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    Rendimento Máximo (Kz) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Kz</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={rendimentoMax ? formatKz(rendimentoMax) : rendimentoMax}
                      onChange={(e) => setRendimentoMax(unformatKz(e.target.value))}
                      placeholder="450.000"
                      className={cn(
                        "w-full rounded-lg border border-gray-300 dark:border-white/10 pl-10 pr-4 py-2.5 text-sm",
                        "focus:outline-none focus:border-brand-300 focus:ring-brand-500/20",
                        "bg-transparent text-gray-800 dark:text-white/90"
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Parentesco com o Cliente <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {parentescoOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setParentesco(option.value)
                        if (option.value !== 'Outro') setParentescoGenero(null)
                      }}
                      className={cn(
                        "px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all",
                        parentesco === option.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 dark:border-white/10 text-muted-foreground hover:border-primary/50"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {parentesco === 'Outro' && (
                  <div className="space-y-3 mt-2">
                    <input
                      type="text"
                      value={parentescoOutro}
                      onChange={(e) => setParentescoOutro(e.target.value)}
                      placeholder="Especifique o parentesco..."
                      className={cn(
                        "w-full rounded-lg border border-gray-300 dark:border-white/10 px-4 py-2.5 text-sm",
                        "focus:outline-none focus:border-brand-300 focus:ring-brand-500/20",
                        "bg-transparent text-gray-800 dark:text-white/90"
                      )}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setParentescoGenero('M')}
                        className={cn(
                          "flex-1 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                          parentescoGenero === 'M'
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-200 dark:border-white/10 text-muted-foreground hover:border-primary/50"
                        )}
                      >
                        Masculino
                      </button>
                      <button
                        type="button"
                        onClick={() => setParentescoGenero('F')}
                        className={cn(
                          "flex-1 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                          parentescoGenero === 'F'
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-200 dark:border-white/10 text-muted-foreground hover:border-primary/50"
                        )}
                      >
                        Feminino
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {erro && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {erro}
                  </p>
                </div>
              )}

              <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('checklist')}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleGerarDeclaracaoAutonoma}
                  disabled={isGerandoDeclaracao}
                  className="gap-2 w-full sm:w-auto"
                >
                  {isGerandoDeclaracao ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      Gerar Declaração
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}

          {step === 'reconhecimento' && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-2 mb-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep('checklist')}
                  className="p-0 h-auto text-sm"
                >
                  ← Voltar
                </Button>
              </div>

              <p className="text-sm font-medium">Reconhecer Declaração Autónoma no Notário</p>

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
                        Envio do documento à sua residência
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
                        Recolha do documento na agência
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

              <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('checklist')}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmitReconhecimento}
                  disabled={isSubmitting}
                  className="gap-2 w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      Solicitar Reconhecimento
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
