// components/processo/steps/StepTipoVisto.tsx
'use client'

import { motion } from "framer-motion"
import { StepProps, TipoVisto } from "@/types/processo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, Building2, ChevronLeft } from "lucide-react"

const tiposVisto = [
  {
    id: "nacional" as TipoVisto,
    titulo: "Visto Nacional",
    descricao: "Para residência de longa duração em um país específico",
    icone: Building2,
    cor: "from-blue-500 to-cyan-500",
    destaque: "Mais de 1 ano",
  },
  {
    id: "schengen" as TipoVisto,
    titulo: "Visto Schengen",
    descricao: "Para viagens de curta duração na Europa (até 90 dias)",
    icone: Globe,
    cor: "from-purple-500 to-pink-500",
    destaque: "Até 90 dias",
  },
]

export default function StepTipoVisto({
  data,
  setData,
  next,
  back,
}: StepProps) {
  const handleSelect = (tipo: TipoVisto) => {
    setData((prev) => ({
      ...prev,
      tipoVisto: tipo,
      subtipo: null,
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
          <h2 className="text-2xl font-bold tracking-tight">Qual o tipo de visto?</h2>
          <p className="text-muted-foreground mt-1">
            Selecione o tipo de visto que melhor se adequa ao seu objetivo
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {tiposVisto.map((tipo, index) => {
            const Icon = tipo.icone
            return (
              <motion.div
                key={tipo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card
                  className="cursor-pointer transition-all hover:shadow-xl border-2 hover:border-primary/50 relative overflow-hidden group"
                  onClick={() => handleSelect(tipo.id)}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tipo.cor} opacity-10 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500`} />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${tipo.cor} text-white shadow-lg`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {tipo.destaque}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{tipo.titulo}</h3>
                    <p className="text-muted-foreground text-sm">{tipo.descricao}</p>
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm text-primary font-medium">Selecionar →</span>
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