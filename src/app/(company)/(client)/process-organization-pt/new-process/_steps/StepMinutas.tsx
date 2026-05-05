// components/processo/steps/StepMinutas.tsx
'use client'

import { motion } from "framer-motion"
import { StepProps } from "@/types/processo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChevronLeft,
  FileText,
  FileSignature,
  ClipboardList,
  Calendar,
  BookOpen,
  CheckCircle,
  Download,
  Eye
} from "lucide-react"
import { useState } from "react"

type TipoMinuta =
  | "minuta1"
  | "minuta2"
  | "formulario"
  | "termo_responsabilidade"
  | "solicitar_agendamento"
  | "solicitar_matricula"

interface Minuta {
  id: TipoMinuta
  titulo: string
  descricao: string
  icone: any
  cor: string
  documentos?: string[]
}

const minutas: Minuta[] = [
  {
    id: "minuta1",
    titulo: "Minuta 1",
    descricao: "Documento padrão para solicitação de visto de formação profissional",
    icone: FileSignature,
    cor: "from-violet-500 to-purple-500",
    documentos: [
      "Contrato de trabalho",
      "Comprovante de residência",
      "Documentos pessoais",
    ],
  },
  {
    id: "minuta2",
    titulo: "Minuta 2",
    descricao: "Modelo alternativo para casos específicos de formação",
    icone: FileText,
    cor: "from-blue-500 to-indigo-500",
    documentos: [
      "Declaração da instituição",
      "Histórico acadêmico",
      "Comprovante de matrícula",
    ],
  },
  {
    id: "formulario",
    titulo: "Formulário",
    descricao: "Formulário padrão para preenchimento de dados do processo",
    icone: ClipboardList,
    cor: "from-emerald-500 to-teal-500",
    documentos: [
      "Dados cadastrais",
      "Informações do curso",
      "Dados do financiamento",
    ],
  },
  {
    id: "termo_responsabilidade",
    titulo: "Exemplo Termo de Responsabilidade",
    descricao: "Modelo de termo de responsabilidade financeira",
    icone: FileSignature,
    cor: "from-amber-500 to-orange-500",
    documentos: [
      "Declaração do responsável",
      "Comprovante de renda",
      "Documento de identificação",
    ],
  },
  {
    id: "solicitar_agendamento",
    titulo: "Solicitar Agendamento",
    descricao: "Formulário para agendamento de entrevista ou entrega de documentos",
    icone: Calendar,
    cor: "from-rose-500 to-pink-500",
    documentos: [
      "Escolha de data e horário",
      "Local de atendimento",
      "Tipo de serviço",
    ],
  },
  {
    id: "solicitar_matricula",
    titulo: "Solicitar Matrícula",
    descricao: "Solicitação de matrícula na instituição de ensino",
    icone: BookOpen,
    cor: "from-cyan-500 to-sky-500",
    documentos: [
      "Documentos pessoais",
      "Histórico escolar",
      "Comprovante de pagamento",
    ],
  },
]

export default function StepMinutas({
  data,
  setData,
  next,
  back,
}: StepProps) {
  const [selectedMinuta, setSelectedMinuta] = useState<TipoMinuta | null>(
    data.minutaSelecionada || null
  )
  const [showDetails, setShowDetails] = useState<TipoMinuta | null>(null);

  const [showMinutaModal, setShowMinutaModal] = useState(false)
  const [selectedMinutaId, setSelectedMinutaId] = useState<TipoMinuta | null>(null)

  const handleSelect = (minutaId: TipoMinuta) => {
    setSelectedMinuta(minutaId)
    setData((prev) => ({
      ...prev,
      minutaSelecionada: minutaId,
    }));

    // Se for Minuta 1, abre o modal
    if (minutaId === "minuta1") {
      setShowMinutaModal(true)
    } else {
      // Para outras minutas, apenas seleciona e continua
      handleConfirm()
    }
  }

  const handleConfirm = () => {
    if (selectedMinuta) {
      next()
    }
  }

  const handleMinutaSuccess = (pdfUrl: string) => {
    // Salva a URL do PDF gerado nos dados
    setData((prev) => ({
      ...prev,
      minutaPdfUrl: pdfUrl,
    }))
    // Avança para o próximo step
    next()
  }

  const getMinuta = (id: TipoMinuta) => minutas.find(m => m.id === id)

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
              <FileText className="h-3 w-3" />
              <span className="font-medium">Documentação</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Selecione a Minuta
            </h2>
            <p className="text-muted-foreground mt-1">
              Escolha o documento necessário para seu processo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {minutas.map((minuta, index) => {
              const Icon = minuta.icone
              const isSelected = selectedMinuta === minuta.id
              const isExpanded = showDetails === minuta.id

              return (
                <motion.div
                  key={minuta.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex" // Adicionado: faz o motion.div ocupar toda altura disponível
                >
                  <Card
                    className={cn(
                      "transition-all hover:shadow-lg border-2 group cursor-pointer w-full flex flex-col", // Adicionado: w-full e flex flex-col
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    )}
                    onClick={() => handleSelect(minuta.id)}
                  >
                    <CardContent className="p-4 flex-1 flex flex-col"> {/* Adicionado: flex-1 e flex flex-col */}
                      <div className="flex items-start gap-4 flex-1"> {/* Adicionado: flex-1 */}
                        <div className={cn(
                          "p-3 rounded-xl bg-gradient-to-br text-white shadow-md transition-transform shrink-0", // Adicionado: shrink-0
                          minuta.cor,
                          "group-hover:scale-110"
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1 flex flex-col"> {/* Adicionado: flex-1 flex flex-col */}
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">{minuta.titulo}</h3>
                            {isSelected && (
                              <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {minuta.descricao}
                          </p>

                          {/* Botões de ação */}
                          <div className="flex gap-2 mt-3">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowDetails(isExpanded ? null : minuta.id)
                              }}
                              className="gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              {isExpanded ? "Ocultar detalhes" : "Ver detalhes"}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                // TODO: Implementar download
                                console.log("Download:", minuta.id)
                              }}
                              className="gap-1"
                            >
                              <Download className="h-3 w-3" />
                              Baixar exemplo
                            </Button>
                          </div>

                          {/* Detalhes expandidos */}
                          {isExpanded && minuta.documentos && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t"
                            >
                              <p className="text-sm font-medium mb-2">
                                Documentos necessários:
                              </p>
                              <ul className="space-y-1">
                                {minuta.documentos.map((doc, i) => (
                                  <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-primary shrink-0" />
                                    {doc}
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
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
        </div>
      </motion.div>

      {/* Modal para Minuta 1 */}
      <ModalPreencherMinuta
        open={showMinutaModal}
        onOpenChange={setShowMinutaModal}
        cliente={data.cliente}
        onSuccess={handleMinutaSuccess}
      />
    </>
  )
}

// Import necessário para o cn
import { cn } from "@/lib/utils"
import { ModalPreencherMinuta } from "../_components/ModalPreencherMinuta"
