// components/processo/steps/StepTipoVisto.tsx
'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { StepProps, TipoVisto, NumeroEntradas } from "@/types/processo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Globe, Building2, ChevronLeft, Check, ArrowRight, ArrowLeftRight, Repeat } from "lucide-react"
import { cn } from "@/lib/utils"

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

const opcoesEntradas: { id: NumeroEntradas; titulo: string; descricao: string; icone: React.ElementType }[] = [
  {
    id: "uma",
    titulo: "Uma Entrada",
    descricao: "Entrada única no espaço Schengen",
    icone: ArrowRight,
  },
  {
    id: "duas",
    titulo: "Duas Entradas",
    descricao: "Duas entradas permitidas durante a validade",
    icone: ArrowLeftRight,
  },
  {
    id: "multiplas",
    titulo: "Entradas Múltiplas",
    descricao: "Múltiplas entradas durante a validade do visto",
    icone: Repeat,
  },
]

export default function StepTipoVisto({
  data,
  setData,
  next,
  back,
}: StepProps) {
  const [modalSchengenAberto, setModalSchengenAberto] = useState(false)
  const [objectivoViagem, setObjectivoViagem] = useState("")
  const [numeroEntradas, setNumeroEntradas] = useState<NumeroEntradas | null>(null)

  const handleSelect = (tipo: TipoVisto) => {
    setData((prev) => ({
      ...prev,
      tipoVisto: tipo,
      subtipo: null,
    }))
    if (tipo === "schengen") {
      setObjectivoViagem("")
      setNumeroEntradas(null)
      setModalSchengenAberto(true)
    } else {
      next()
    }
  }

  const handleConfirmarSchengen = () => {
    if (!objectivoViagem.trim() || !numeroEntradas) return
    setData((prev) => ({
      ...prev,
      objectivoViagem: objectivoViagem.trim(),
      numeroEntradas,
    }))
    setModalSchengenAberto(false)
    next()
  }

  const handleCancelarSchengen = () => {
    setData((prev) => ({
      ...prev,
      tipoVisto: null,
    }))
    setModalSchengenAberto(false)
  }

  return (
    <>
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
                    className="cursor-pointer transition-all hover:shadow-xl border-2 hover:border-primary/50 relative overflow-hidden h-full group"
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

      <Dialog open={modalSchengenAberto} onOpenChange={(open) => {
        if (!open) handleCancelarSchengen()
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Informações do Visto Schengen
            </DialogTitle>
            <DialogDescription>
              Preencha os detalhes da sua viagem ao espaço Schengen
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label htmlFor="objectivo-viagem">Qual o objectivo da viagem?</Label>
              <Input
                id="objectivo-viagem"
                placeholder="Ex: Turismo, visita a familiares, negócios..."
                value={objectivoViagem}
                onChange={(e) => setObjectivoViagem(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-3">
              <Label>Número de entradas a solicitar</Label>
              <div className="grid gap-3">
                {opcoesEntradas.map((opcao) => {
                  const Icon = opcao.icone
                  const selecionado = numeroEntradas === opcao.id
                  return (
                    <Card
                      key={opcao.id}
                      className={cn(
                        "cursor-pointer transition-all border-2 group",
                        selecionado
                          ? "border-primary shadow-md bg-primary/5"
                          : "hover:border-primary/50"
                      )}
                      onClick={() => setNumeroEntradas(opcao.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "p-2.5 rounded-xl transition-all",
                            selecionado
                              ? "bg-primary text-white"
                              : "bg-muted text-muted-foreground group-hover:bg-primary/10"
                          )}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{opcao.titulo}</h3>
                            <p className="text-sm text-muted-foreground">{opcao.descricao}</p>
                          </div>
                          {selecionado && (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-3.5 w-3.5 text-white" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={handleCancelarSchengen}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmarSchengen} disabled={!objectivoViagem.trim() || !numeroEntradas} className="gap-2">
              <Check className="h-4 w-4" />
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}