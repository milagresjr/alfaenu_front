'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { StepProps } from "@/types/processo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useAuthStore } from "@/store/useAuthStore"
import { useFinanciadores } from "@/features/financiador/hooks/useFinanciadorQuery"
import {
  ChevronLeft,
  Users,
  Globe,
  CheckCircle,
  Building2,
  Search,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

type OrigemFinanciamento = "nacional" | "estrangeiro"
type TipoFinanciador = "nacional" | "estrangeiro"

const opcoesOrigem = [
  {
    id: "nacional" as OrigemFinanciamento,
    titulo: "Nacional",
    descricao: "Financiamento por instituição nacional",
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
  const { user } = useAuthStore()
  const userId = String(user?.id ?? "")

  const [selectedOrigem, setSelectedOrigem] = useState<OrigemFinanciamento | null>(null)
  const [showModal, setShowModal] = useState(false)

  const { data: financiadoresData, isLoading } = useFinanciadores(userId, 1, 999, "")

  const financiadoresFiltrados = (financiadoresData?.data ?? []).filter(
    (f) => f.tipo_financiador === selectedOrigem
  )

  const handleSelect = (origem: OrigemFinanciamento) => {
    setData((prev) => ({
      ...prev,
      financiamentoOrigem: origem,
    }))
    setSelectedOrigem(origem)
    setShowModal(true)
  }

  const handleSelectFinanciador = (id: number, nome: string) => {
    setData((prev) => ({
      ...prev,
      financiador_id: id,
      financiador_nome: nome,
    }))
    setShowModal(false)
    next()
  }

  const handleCancel = () => {
    setShowModal(false)
    setSelectedOrigem(null)
    setData((prev) => ({
      ...prev,
      financiamentoOrigem: null,
    }))
  }

  const origemLabel = selectedOrigem === "nacional" ? "Nacional" : "Estrangeiro"

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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-3">
              <span className="font-medium">Financiamento</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Origem do Financiamento
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
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-br ${option.cor} text-white shadow-lg inline-block mb-4 group-hover:scale-110 transition-transform`}
                      >
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
                        <span className="text-sm text-primary font-medium">
                          Selecionar esta opção →
                        </span>
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

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent
          className="sm:max-w-lg max-h-[80vh] flex flex-col"
          showCloseButton={false}
        >
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">
                Selecionar Financiador {origemLabel}
              </DialogTitle>
              <button
                onClick={handleCancel}
                className="rounded-full p-1 hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <DialogDescription>
              {isLoading
                ? "Carregando financiadores..."
                : `Escolha um dos financiadores ${origemLabel.toLocaleLowerCase()} disponíveis`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3 py-2">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            )}

            {!isLoading && financiadoresFiltrados.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">
                  Nenhum financiador {origemLabel.toLocaleLowerCase()} encontrado
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Cadastre um financiador primeiro na secção de Financiadores
                </p>
              </div>
            )}

            {!isLoading &&
              financiadoresFiltrados.map((financiador, index) => (
                <motion.div
                  key={financiador.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="cursor-pointer transition-all hover:shadow-md border hover:border-primary/50 group"
                    onClick={() =>
                      financiador.id &&
                      handleSelectFinanciador(financiador.id, financiador.nome_completo)
                    }
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div
                        className={cn(
                          "p-2.5 rounded-lg text-white shrink-0",
                          selectedOrigem === "nacional"
                            ? "bg-gradient-to-br from-green-500 to-emerald-500"
                            : "bg-gradient-to-br from-blue-500 to-cyan-500"
                        )}
                      >
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">
                          {financiador.nome_completo}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {financiador.numero_documento
                            ? `${financiador.tipo_documento ?? "Doc"}: ${financiador.numero_documento}`
                            : financiador.nacionalidade ?? "Sem documento"}
                        </p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>

          <div className="flex justify-end pt-2 border-t">
            <Button variant="outline" onClick={handleCancel} className="gap-2">
              <X className="h-4 w-4" />
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
