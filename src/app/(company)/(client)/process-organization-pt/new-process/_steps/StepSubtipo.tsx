// components/processo/steps/StepSubtipo.tsx
'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { StepProps, Subtipo } from "@/types/processo"
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
import { 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Plane, 
  Handshake, 
  Heart,
  Palette,
  Trophy,
  Landmark,
  Stethoscope,
  Navigation,
  FileText,
  ChevronLeft,
  Check,
  X,
  Calendar,
  CalendarDays,
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
  {
    id: "estudos" as Subtipo,
    titulo: "Estudos",
    descricao: "Cursos, intercâmbios e programas acadêmicos",
    icone: GraduationCap,
    cor: "from-cyan-500 to-teal-500",
  },
  {
    id: "cultural" as Subtipo,
    titulo: "Cultural",
    descricao: "Intercâmbio cultural e atividades artísticas",
    icone: Palette,
    cor: "from-fuchsia-500 to-pink-500",
  },
  {
    id: "desporto" as Subtipo,
    titulo: "Desporto",
    descricao: "Eventos e competições desportivas",
    icone: Trophy,
    cor: "from-lime-500 to-green-500",
  },
  {
    id: "visita_oficial" as Subtipo,
    titulo: "Visita Oficial",
    descricao: "Visitas de representantes oficiais e delegações",
    icone: Landmark,
    cor: "from-slate-600 to-gray-500",
  },
  {
    id: "razoes_medicas" as Subtipo,
    titulo: "Razões Médicas",
    descricao: "Tratamentos médicos e consultas especializadas",
    icone: Stethoscope,
    cor: "from-red-500 to-rose-500",
  },
  {
    id: "escala_aeronautica" as Subtipo,
    titulo: "Escala Aeronáutica",
    descricao: "Tripulação e escalas técnicas aeronáuticas",
    icone: Navigation,
    cor: "from-indigo-500 to-blue-500",
  },
  {
    id: "outro" as Subtipo,
    titulo: "Outro (especificar)",
    descricao: "Outros motivos não listados acima",
    icone: FileText,
    cor: "from-stone-500 to-neutral-500",
  },
]

export default function StepSubtipo({
  data,
  setData,
  next,
  back,
}: StepProps) {
  const [mostrarInputOutro, setMostrarInputOutro] = useState(false)
  const [outroDescricao, setOutroDescricao] = useState("")
  const [modalDatasAberto, setModalDatasAberto] = useState(false)
  const [dataChegada, setDataChegada] = useState("")
  const [quantidadeDias, setQuantidadeDias] = useState<number>(1)

  const calcularDataSaida = (chegada: string, dias: number): string => {
    if (!chegada || !dias) return ""
    const data = new Date(chegada)
    data.setDate(data.getDate() + dias)
    return data.toISOString().split("T")[0]
  }

  const dataSaida = calcularDataSaida(dataChegada, quantidadeDias)

  const getOptions = () => {
    if (data.tipoVisto === "nacional") return opcoesNacional
    if (data.tipoVisto === "schengen") return opcoesSchengen
    return []
  }

  const abrirModalDatas = () => {
    setDataChegada("")
    setQuantidadeDias(1)
    setModalDatasAberto(true)
  }

  const handleSelect = (subtipo: Subtipo) => {
    if (subtipo === "outro") {
      setMostrarInputOutro(true)
      return
    }
    setData((prev) => ({
      ...prev,
      subtipo,
      financiamento: null,
    }))
    if (data.tipoVisto === "nacional") {
      next()
    } else {
      abrirModalDatas()
    }
  }

  const handleConfirmarOutro = () => {
    if (!outroDescricao.trim()) return
    setData((prev) => ({
      ...prev,
      subtipo: "outro",
      subtipoOutroDescricao: outroDescricao.trim(),
      financiamento: null,
    }))
    if (data.tipoVisto === "nacional") {
      next()
    } else {
      abrirModalDatas()
    }
  }

  const handleCancelarOutro = () => {
    setMostrarInputOutro(false)
    setOutroDescricao("")
  }

  const handleConfirmarDatas = () => {
    if (!dataChegada || !quantidadeDias) return
    setData((prev) => ({
      ...prev,
      dataPrevisaoChegada: dataChegada,
      quantidadeDias,
      dataPrevisaoSaida: dataSaida,
    }))
    setModalDatasAberto(false)
    next()
  }

  const handleCancelarDatas = () => {
    setModalDatasAberto(false)
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

        {mostrarInputOutro ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 p-6 rounded-xl border-2 border-primary/20 bg-muted/30"
          >
            <div className="space-y-2">
              <Label htmlFor="outro-descricao">Especifique o motivo</Label>
              <Input
                id="outro-descricao"
                placeholder="Digite a descrição do motivo do visto..."
                value={outroDescricao}
                onChange={(e) => setOutroDescricao(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleConfirmarOutro()
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleConfirmarOutro} disabled={!outroDescricao.trim()} className="gap-2">
                <Check className="h-4 w-4" />
                Confirmar
              </Button>
              <Button variant="ghost" onClick={handleCancelarOutro} className="gap-2">
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                    className="cursor-pointer transition-all hover:shadow-lg border-2 hover:border-primary/50 h-full group"
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
        )}

        <div className="flex justify-start pt-4">
          <Button variant="ghost" onClick={back} className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>

      <Dialog open={modalDatasAberto} onOpenChange={setModalDatasAberto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Datas da Viagem
            </DialogTitle>
            <DialogDescription>
              Informe a data prevista de chegada e a duração da estadia
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="data-chegada">Data prevista de chegada</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="data-chegada"
                  type="date"
                  value={dataChegada}
                  onChange={(e) => setDataChegada(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade-dias">Quantidade de dias</Label>
              <Input
                id="quantidade-dias"
                type="number"
                min={1}
                value={quantidadeDias}
                onChange={(e) => setQuantidadeDias(Math.max(1, Number(e.target.value)))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data-saida">Data prevista de saída</Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="data-saida"
                  type="date"
                  value={dataSaida}
                  disabled
                  className="pl-10 opacity-70"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={handleCancelarDatas}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmarDatas} disabled={!dataChegada || !quantidadeDias} className="gap-2">
              <Check className="h-4 w-4" />
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}