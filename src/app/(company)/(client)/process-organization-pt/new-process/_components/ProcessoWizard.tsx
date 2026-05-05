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
import StepReview from "../_steps/StepReview"
import { Button } from "@/components/ui/button"
import { Save, X, ArrowLeft, ArrowRight } from "lucide-react"
import { toast } from "react-toastify"

export default function ProcessoWizard() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<ProcessoData>({
    cliente: null,
    tipoVisto: null,
    subtipo: null,
    financiamento: null,
    financiamentoOrigem: null,
    minutaSelecionada: null,
    status: "rascunho",
  })

  // Função para determinar quais steps devem ser exibidos baseado nas escolhas
  const getVisibleSteps = () => {
    const visibleSteps = ["Cliente", "Tipo de Visto", "Subtipo"]
    
    // Sempre mostra Detalhes (Step 4)
    visibleSteps.push("Detalhes")
    
    // Se for financiado E for formação profissional, mostra Origem do Finan.
    if (data.financiamento === "financiado" && data.subtipo === "formacao") {
      visibleSteps.push("Origem do Finan.")
      
      // Se a origem for nacional, mostra Minutas
      if (data.financiamentoOrigem === "nacional") {
        visibleSteps.push("Minutas")
      }
    }
    
    // Sempre mostra Revisão no final
    visibleSteps.push("Revisão")
    
    return visibleSteps
  }

  const steps = getVisibleSteps()
  const totalSteps = steps.length

  // Mapeamento de step index para componente
  const getStepComponent = (stepIndex: number) => {
    const stepName = steps[stepIndex - 1] // steps array é 0-based

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
      case "Revisão":
        return StepReview
      default:
        return StepCliente
    }
  }

  const next = () => {
    if (step < totalSteps) {
      setStep((s) => s + 1)
      // Scroll to top quando mudar de step
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const back = () => {
    if (step > 1) {
      setStep((s) => s - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const saveDraft = () => {
    try {
      localStorage.setItem("processo_draft", JSON.stringify({
        ...data,
        savedAt: new Date().toISOString()
      }))
      toast.success("Rascunho salvo com sucesso!")
    } catch (error) {
      toast.error("Erro ao salvar rascunho")
    }
  }

  const loadDraft = () => {
    try {
      const draft = localStorage.getItem("processo_draft")
      if (draft) {
        const parsedDraft = JSON.parse(draft)
        setData(parsedDraft)
        toast.info("Rascunho carregado com sucesso!")
      }
    } catch (error) {
      toast.error("Erro ao carregar rascunho")
    }
  }

  // Carregar rascunho ao iniciar
  useEffect(() => {
    loadDraft()
  }, [])

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
        // Se for formação profissional, precisa selecionar financiamento
        if (data.subtipo === "formacao") {
          return data.financiamento !== null
        }
        return true
      case "Origem do Finan.":
        return data.financiamentoOrigem !== null
      case "Minutas":
        return data.minutaSelecionada !== null
      case "Revisão":
        return true
      default:
        return true
    }
  }

  // Função para avançar com validação
  const handleNext = () => {
    // if (isStepValid()) {
      next()
    // } else {
    //   toast.warning("Por favor, preencha todos os campos obrigatórios antes de continuar")
    // }
  }

  // Calcular progresso real baseado nos steps visíveis
  const currentStepIndex = step
  const isLastStep = step === totalSteps
  const isFirstStep = step === 1

  return (
    <div className="min-h-[calc(100vh-200px)] py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-card rounded-2xl shadow-xl border p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b flex-wrap gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Novo Processo</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Preencha as informações do processo de visto
              </p>
              {data.cliente && (
                <p className="text-xs text-muted-foreground mt-2">
                  Cliente: <span className="font-medium">{data.cliente.nome}</span>
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={saveDraft} 
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Salvar Rascunho
              </Button>
            </div>
          </div>

          {/* Progress */}
          <StepProgress 
            currentStep={currentStepIndex} 
            totalSteps={totalSteps} 
            steps={steps} 
          />

          {/* Steps Content */}
          <div className="mt-8 min-h-[500px]">
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

          {/* Navigation Buttons - Apenas para steps que não têm navegação própria */}
          {!isLastStep && steps[step - 1] !== "Detalhes" && (
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
          )}
        </div>
      </div>
    </div>
  )
}