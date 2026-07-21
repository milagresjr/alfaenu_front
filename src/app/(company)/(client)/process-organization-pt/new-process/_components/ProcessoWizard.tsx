// components/processo/ProcessoWizard.tsx
'use client'

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { ProcessoData } from "@/types/processo"
import { StepProgress } from "@/components/ui/StepProgress"
import StepCliente from "../_steps/StepCliente"
import StepTipoVisto from "../_steps/StepTipoVisto"
import StepSubtipo from "../_steps/StepSubtipo"
import StepDetalhes from "../_steps/StepDetalhes"
import StepFinanciamentoOrigem from "../_steps/StepFinanciamentoOrigem"
import StepMinutas from "../_steps/StepMinutas"
import { Button } from "@/components/ui/button"
import { Save, ArrowLeft, ArrowRight } from "lucide-react"
import { toast } from "react-toastify"
import { useSearchParams } from "next/navigation"
import { api } from "@/services/api"
import { useAuthStore } from "@/store/useAuthStore"

export default function ProcessoWizard() {

  const searchParams = useSearchParams();
  const clienteId = searchParams.get("clienteId");

  const { user } = useAuthStore();

  const [step, setStep] = useState(1)
  const [data, setData] = useState<ProcessoData>({
    cliente: null,
    tipoVisto: null,
    subtipo: null,
    financiamento: null,
    financiamentoOrigem: null,
    financiador_id: null,
    financiador_nome: null,
    minutaSelecionada: null,
    status: "rascunho",
  })
  
  const [isLoading, setIsLoading] = useState(true)

  // ETAPAS FIXAS - Sempre todas as etapas disponíveis
  const steps = [
    "Cliente",           // Step 1
    "Tipo de Visto",     // Step 2
    "Subtipo",           // Step 3
    "Detalhes",          // Step 4
    "Origem do Finan.",  // Step 5
    "Minutas",           // Step 6 - Redireciona para página de documentos
  ]
  
  const totalSteps = steps.length

  // Mapeamento de step index para componente
  const getStepComponent = (stepIndex: number) => {
    const stepName = steps[stepIndex - 1]

    switch (stepName) {
      case "Cliente":
        return StepCliente
      case "Tipo de Visto":
        return StepTipoVisto
      case "Subtipo":
        return StepSubtipo
      case "Detalhes":
        return StepDetalhes
      case "Origem do Finan.":
        return StepFinanciamentoOrigem
      case "Minutas":
        return StepMinutas
      default:
        return StepCliente
    }
  }

  const next = () => {
    if (step < totalSteps) {
      setStep((s) => s + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const back = () => {
    if (step > 1) {
      setStep((s) => s - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  async function loadProcessCliente() {
    if (clienteId && !isNaN(Number(clienteId))) {
      try {
        setIsLoading(true)
        const response = await api.get(`/processo/progress/${clienteId}`)
        const processoData = response.data.data;
        // Mapear os dados da API para o formato esperado pelo wizard
        setData({
          cliente: processoData.cliente,
          tipoVisto: processoData.tipo_visto,
          subtipo: processoData.subtipo,
          financiamento: processoData.financiamento,
          financiamentoOrigem: processoData.financiamento_origem,
          financiador_id: processoData.financiador_id ?? null,
          financiador_nome: processoData.financiador_nome ?? null,
          minutaSelecionada: processoData.minutaSelecionada,
          status: processoData.status,
          dataPrevisaoChegada: processoData.data_prevista_chegada,
          dataPrevisaoSaida: processoData.data_prevista_saida,
        });
        
        // Definir a etapa baseada no progresso salvo
        let targetStep = processoData.current_step || 1
        
        // Garantir que o step não ultrapasse o total
        if (targetStep > totalSteps) {
          targetStep = totalSteps
        }
        
        setStep(targetStep)
        
        // toast.success(`Processo carregado! Etapa atual: ${steps[targetStep - 1]}`);
        
      } catch (error) {
        console.error("Erro ao carregar dados do cliente:", error)
        toast.error("Erro ao carregar dados do cliente. Iniciando novo processo.");
      } finally {
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }

  // Carregar rascunho ao iniciar
  useEffect(() => {
    loadProcessCliente()
  }, [clienteId])

  // Salvar progresso automaticamente quando dados ou step mudarem
  useEffect(() => {
    const saveProgress = async () => {
      if (data.cliente && data.cliente.id) {
        try {
          const payload = {
            cliente_id: data.cliente.id,
            utilizador_id: user?.id,
            current_step: step,
            tipo_visto: data.tipoVisto,
            subtipo: data.subtipo,
            financiamento: data.financiamento,
            financiamento_origem: data.financiamentoOrigem,
            financiador_id: data.financiador_id ? Number(data.financiador_id) : null,
            financiador_nome: data.financiador_nome,
            minuta_selecionada: data.minutaSelecionada,
            status: data.status,
            data_prevista_chegada: data.dataPrevisaoChegada,
            data_prevista_saida: data.dataPrevisaoSaida,
          };
          console.log("Meu payload: ",payload);
          // return;
          await api.post('/processo/progress', {
            cliente_id: data.cliente.id,
            utilizador_id: user?.id,
            current_step: step,
            tipo_visto: data.tipoVisto,
            subtipo: data.subtipo,
            financiamento: data.financiamento,
            financiamento_origem: data.financiamentoOrigem,
            financiador_id: data.financiador_id ? Number(data.financiador_id) : null, 
            financiador_nome: data.financiador_nome,
            minuta_selecionada: data.minutaSelecionada,
            status: data.status,
            data_prevista_chegada: data.dataPrevisaoChegada,
            data_prevista_saida: data.dataPrevisaoSaida,
          });
        } catch (error) {
          console.error("Erro ao salvar progresso:", error);
        }
      }
    };

    // Debounce para evitar muitas requisições
    const timeoutId = setTimeout(() => {
      if (data.cliente) {
        saveProgress();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [data, step]);

  const CurrentStepComponent = getStepComponent(step)

  // Validação por step
  const isStepValid = (): boolean => {
    switch (steps[step - 1]) {
      case "Cliente":
        return data.cliente !== null
      case "Tipo de Visto":
        return data.tipoVisto !== null
      case "Subtipo":
        return data.subtipo !== null
      case "Detalhes":
        return data.financiamento !== null
      case "Origem do Finan.":
        return data.financiamentoOrigem !== null
      case "Minutas":
        return true
      default:
        return true
    }
  }

  const handleNext = () => {
    // if (isStepValid()) {
      next();
    // } else {
    //   toast.warning("Por favor, preencha todos os campos obrigatórios antes de continuar")
    // }
  }

  const currentStepIndex = step
  const isLastStep = step === totalSteps
  const isFirstStep = step === 1

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] py-8 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando processo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-200px)] py-4 sm:py-2 w-full">
      <div className="w-full mx-auto px-4 sm:px-6">
        <div className="bg-card rounded-2xl w-full shadow-xl border p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b flex-wrap gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                {clienteId ? "Continuar Processo" : "Novo Processo"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {clienteId 
                  ? `Retomando processo na etapa ${steps[step - 1]}`
                  : "Preencha as informações do processo de visto"
                }
              </p>
              {data.cliente && (
                <p className="text-xs text-muted-foreground mt-2">
                  Cliente: <span className="font-medium">{data.cliente.nome}</span>
                </p>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="overflow-x-auto pb-2 -mx-4 sm:-mx-0 px-4 sm:px-0">
            <StepProgress
              currentStep={currentStepIndex}
              totalSteps={totalSteps}
              steps={steps}
            />
          </div>

          {/* Steps Content */}
          <div className="mt-8">
            <AnimatePresence mode="wait">
              <CurrentStepComponent
                key={step}
                data={data}
                setData={setData}
                next={handleNext}
                back={back}
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
              />
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          {/* {!isLastStep && (
            <div className="flex justify-between mt-8 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={back}
                disabled={isFirstStep}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={!isStepValid()}
                className="gap-2"
              >
                Continuar
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}