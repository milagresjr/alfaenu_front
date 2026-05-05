// components/processo/steps/StepFinanciamentoOrigem.tsx
'use client'

import { motion } from "framer-motion"
import { StepProps } from "@/types/processo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ChevronLeft, 
  Users, 
  Globe,
  CheckCircle 
} from "lucide-react"

type OrigemFinanciamento = "nacional" | "estrangeiro"

const opcoesOrigem = [
  {
    id: "nacional" as OrigemFinanciamento,
    titulo: "Nacional",
    descricao: "Financiamento por instituição brasileira",
    icone: Users,
    beneficios: [
      "Processo em território nacional",
      "Documentação em português",
      "Suporte local",
    ],
    cor: "from-green-500 to-emerald-500",
  },
  {
    id: "estrangeiro" as OrigemFinanciamento,
    titulo: "Estrangeiro",
    descricao: "Financiamento por instituição internacional",
    icone: Globe,
    beneficios: [
      "Possibilidade de bolsas internacionais",
      "Experiência multicultural",
      "Networking global",
    ],
    cor: "from-blue-500 to-cyan-500",
  },
]

export default function StepFinanciamentoOrigem({
  data,
  setData,
  next,
  back,
}: StepProps) {
  const handleSelect = (origem: OrigemFinanciamento) => {
    setData((prev) => ({
      ...prev,
      financiamentoOrigem: origem,
    }))
    next()
  }

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
            <span className="font-medium">Financiamento</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Origem do Finan.
          </h2>
          <p className="text-muted-foreground mt-1">
            Selecione a origem da instituição financiadora
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {opcoesOrigem.map((option, index) => {
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
                  onClick={() => handleSelect(option.id)}
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