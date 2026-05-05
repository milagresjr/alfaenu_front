// components/processo/steps/StepReview.tsx
'use client'

import { motion } from "framer-motion"
import { StepProps } from "@/types/processo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronLeft, 
  CheckCircle, 
  User, 
  FileText, 
  CreditCard,
  Send,
  Edit2
} from "lucide-react"

type StepReviewProps = Pick<StepProps, "data" | "back">

export default function StepReview({ data, back }: StepReviewProps) {
  const formatTipoVisto = () => {
    if (data.tipoVisto === "nacional") return "Visto Nacional"
    if (data.tipoVisto === "schengen") return "Visto Schengen"
    return "Não selecionado"
  }

  const formatSubtipo = () => {
    const subtipos: Record<string, string> = {
      formacao: "Formação Profissional",
      trabalho: "Trabalho",
      estudante: "Estudante",
      turismo: "Turismo",
      negocios: "Negócios",
      familiar: "Familiar",
    }
    return data.subtipo ? subtipos[data.subtipo] : "Não selecionado"
  }

  const formatFinanciamento = () => {
    if (!data.financiamento) return null
    return data.financiamento === "financiado" ? "Financiado" : "Auto Financiado"
  }

  const handleSubmit = () => {
    // Aqui você enviaria os dados para a API
    console.log("Processo finalizado:", data)
    // Adicionar toast de sucesso
    // Redirecionar para página de processos
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
          <h2 className="text-2xl font-bold tracking-tight">Revisão do Processo</h2>
          <p className="text-muted-foreground mt-1">
            Verifique se todas as informações estão corretas antes de finalizar
          </p>
        </div>

        {/* Cliente */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Dados do Cliente
            </CardTitle>
            <Badge variant="secondary" className="gap-1">
              <Edit2 className="h-3 w-3" />
              Passo 1
            </Badge>
          </CardHeader>
          <CardContent>
            {data.cliente ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Nome:</span>
                  <span className="font-medium">{data.cliente.nome}</span>
                </div>
                {data.cliente.email && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">E-mail:</span>
                    <span>{data.cliente.email}</span>
                  </div>
                )}
                {data.cliente.telefone && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Telefone:</span>
                    <span>{data.cliente.telefone}</span>
                  </div>
                )}
                {data.cliente.documento && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Documento:</span>
                    <span>{data.cliente.documento}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Nenhum cliente selecionado</p>
            )}
          </CardContent>
        </Card>

        {/* Tipo de Visto */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Tipo de Visto
            </CardTitle>
            <Badge variant="secondary" className="gap-1">
              <Edit2 className="h-3 w-3" />
              Passo 2
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Categoria:</span>
              <Badge variant="outline" className="font-normal">
                {formatTipoVisto()}
              </Badge>
            </div>
            {data.subtipo && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-muted-foreground">Subtipo:</span>
                <Badge variant="secondary">
                  {formatSubtipo()}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detalhes Adicionais */}
        {data.financiamento && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Detalhes Adicionais
              </CardTitle>
              <Badge variant="secondary" className="gap-1">
                <Edit2 className="h-3 w-3" />
                Passo 4
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Financiamento:</span>
                <Badge variant={data.financiamento === "financiado" ? "default" : "outline"}>
                  {formatFinanciamento()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">Pronto para finalizar</p>
                  <p className="text-sm text-muted-foreground">
                    Todos os dados foram preenchidos corretamente
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={back} className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Button>
          <Button onClick={handleSubmit} className="gap-2 flex-1">
            <Send className="h-4 w-4" />
            Finalizar Processo
          </Button>
        </div>
      </div>
    </motion.div>
  )
}