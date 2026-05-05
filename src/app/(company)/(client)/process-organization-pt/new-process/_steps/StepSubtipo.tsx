// components/processo/steps/StepSubtipo.tsx
'use client'

import { motion } from "framer-motion"
import { StepProps, Subtipo } from "@/types/processo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Plane, 
  Handshake, 
  Heart,
  ChevronLeft 
} from "lucide-react"

const opcoesNacional = [
  {
    id: "formacao" as Subtipo,
    titulo: "Formação Profissional",
    descricao: "Cursos técnicos, profissionalizantes e capacitações",
    icone: GraduationCap,
    cor: "from-emerald-500 to-teal-500",
  },
  {
    id: "trabalho" as Subtipo,
    titulo: "Trabalho",
    descricao: "Visto para exercer atividade laboral remunerada",
    icone: Briefcase,
    cor: "from-blue-500 to-indigo-500",
  },
  {
    id: "estudante" as Subtipo,
    titulo: "Estudante",
    descricao: "Graduação, pós-graduação ou intercâmbio acadêmico",
    icone: BookOpen,
    cor: "from-violet-500 to-purple-500",
  },
]

const opcoesSchengen = [
  {
    id: "turismo" as Subtipo,
    titulo: "Turismo",
    descricao: "Viagens de lazer, passeios e férias",
    icone: Plane,
    cor: "from-sky-500 to-blue-500",
  },
  {
    id: "negocios" as Subtipo,
    titulo: "Negócios",
    descricao: "Reuniões, conferências e atividades comerciais",
    icone: Handshake,
    cor: "from-amber-500 to-orange-500",
  },
  {
    id: "familiar" as Subtipo,
    titulo: "Familiar",
    descricao: "Visita a familiares ou amigos residentes",
    icone: Heart,
    cor: "from-rose-500 to-pink-500",
  },
]

export default function StepSubtipo({
  data,
  setData,
  next,
  back,
}: StepProps) {
  const getOptions = () => {
    if (data.tipoVisto === "nacional") return opcoesNacional
    if (data.tipoVisto === "schengen") return opcoesSchengen
    return []
  }

  const handleSelect = (subtipo: Subtipo) => {
    setData((prev) => ({
      ...prev,
      subtipo,
      financiamento: null,
    }))
    next()
  }

  const options = getOptions()
  const titulo = data.tipoVisto === "nacional" ? "Visto Nacional" : "Visto Schengen"

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
            <span className="font-medium">{titulo}</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Escolha o subtipo
          </h2>
          <p className="text-muted-foreground mt-1">
            Selecione a categoria específica do seu visto
          </p>
        </div>

        <div className="grid gap-3">
          {options.map((option, index) => {
            const Icon = option.icone
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="cursor-pointer transition-all hover:shadow-lg border-2 hover:border-primary/50 group"
                  onClick={() => handleSelect(option.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${option.cor} text-white shadow-md group-hover:scale-110 transition-transform`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{option.titulo}</h3>
                        <p className="text-sm text-muted-foreground">{option.descricao}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary text-lg">→</span>
                        </div>
                      </div>
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