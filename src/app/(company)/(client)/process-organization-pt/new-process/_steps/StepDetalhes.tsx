// components/processo/steps/StepDetalhes.tsx
'use client'

import { motion } from "framer-motion"
import { StepProps, Financiamento } from "@/types/processo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ChevronLeft, 
  CheckCircle, 
  TrendingUp, 
  Wallet,
  Clock,
  FileCheck 
} from "lucide-react"

const opcoesFinanciamento = [
  {
    id: "financiado" as Financiamento,
    titulo: "Financiado",
    descricao: "Programa com suporte financeiro de instituição ou empresa",
    icone: TrendingUp,
    beneficios: [
      "Suporte financeiro parcial ou total",
      "Acompanhamento institucional",
      "Maior chance de aprovação",
    ],
    cor: "from-green-500 to-emerald-500",
  },
  {
    id: "auto" as Financiamento,
    titulo: "Auto Financiado",
    descricao: "Custos arcados pelo próprio requerente",
    icone: Wallet,
    beneficios: [
      "Maior flexibilidade de escolha",
      "Processo mais ágil",
      "Sem vínculos institucionais",
    ],
    cor: "from-blue-500 to-cyan-500",
  },
]

export default function StepDetalhes({
  data,
  setData,
  next,
  back,
}: StepProps) {
  const handleFinanciamento = (tipo: Financiamento) => {
    setData((prev) => ({
      ...prev,
      financiamento: tipo,
    }))
    next()
  }

  // Caso específico: Formação Profissional
  if (data.subtipo === "formacao") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-3">
              <FileCheck className="h-3 w-3" />
              <span className="font-medium">Formação Profissional</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Tipo de Financiamento
            </h2>
            <p className="text-muted-foreground mt-1">
              Como será custeada sua formação profissional?
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {opcoesFinanciamento.map((option, index) => {
              const Icon = option.icone
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card
                    className="cursor-pointer transition-all hover:shadow-xl border-2 hover:border-primary/50 h-full group"
                    onClick={() => handleFinanciamento(option.id)}
                  >
                    <CardContent className="p-6">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${option.cor} text-white shadow-lg inline-block mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{option.titulo}</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {option.descricao}
                      </p>
                      <div className="space-y-2">
                        {option.beneficios.map((beneficio, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-primary" />
                            <span className="text-muted-foreground">{beneficio}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-sm text-primary font-medium">Selecionar esta opção →</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <div className="flex justify-start pt-4">
            <Button variant="ghost" onClick={back} className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  // Caso genérico: sem detalhes adicionais
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
            <Clock className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Detalhes Adicionais
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Para o tipo de visto selecionado, não há requisitos adicionais necessários neste momento.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <Button variant="outline" onClick={back}>
              Voltar
            </Button>
            <Button onClick={next}>
              Continuar
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}