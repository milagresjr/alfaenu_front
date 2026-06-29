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
  Edit2,
  GraduationCap,
  CalendarCheck,
  FileCheck,
  Home,
  Mail,
  Clock,
  Award,
  Building2,
  Globe,
} from "lucide-react"
import { useRouter } from "next/navigation"
import confetti from 'canvas-confetti'

type StepReviewProps = Pick<StepProps, "data" | "back">

export default function StepReview({ data, back }: StepReviewProps) {
  const router = useRouter()
  
  // Verificar se há solicitação de matrícula nos dados
  const hasSolicitacaoMatricula = data.solicitacaoMatricula && data.solicitacaoMatricula.curso
  const hasMinuta = data.minutaSelecionada
  const isProcessoCompleto = true // Verificar se todas as etapas foram concluídas

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

  const formatOrigem = () => {
    if (!data.financiamentoOrigem) return null
    return data.financiamentoOrigem === "nacional" ? "Nacional" : "Estrangeiro"
  }

  const formatOrigemIcon = () => {
    return data.financiamentoOrigem === "nacional" ? Building2 : Globe
  }

  const handleSubmit = () => {
    // Disparar confete
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    
    console.log("Processo finalizado:", data)
    // Redirecionar para página de processos após 2 segundos
    setTimeout(() => {
      router.push("/processos")
    }, 2000)
  }

  const handleVoltarInicio = () => {
    router.push("/processos")
  }

  // Renderizar seção de sucesso da solicitação de matrícula
  const renderSolicitacaoMatriculaSuccess = () => {
    if (!hasSolicitacaoMatricula) return null

    const { curso, documentos, dataEnvio } = data?.solicitacaoMatricula || {}

    return (
      <Card className="border-green-500/30 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-green-500/20">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                Solicitação de Matrícula Enviada com Sucesso! 🎉
              </h3>
              <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                Sua solicitação foi recebida e está sendo processada.
              </p>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-green-600" />
                  <span className="text-muted-foreground">Curso:</span>
                  <span className="font-medium">{curso?.nome}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarCheck className="h-4 w-4 text-green-600" />
                  <span className="text-muted-foreground">Data da solicitação:</span>
                  <span className="font-medium">
                    {dataEnvio ? new Date(dataEnvio).toLocaleDateString('pt-AO') : new Date().toLocaleDateString('pt-AO')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileCheck className="h-4 w-4 text-green-600" />
                  <span className="text-muted-foreground">Documentos anexados:</span>
                  <span className="font-medium">{documentos?.length || 0} arquivos</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-100/50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-400 flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5" />
                  Entraremos em contacto em breve através do e-mail ou telefone cadastrado.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Renderizar seção de sucesso da minuta
  const renderMinutaSuccess = () => {
    if (!hasMinuta && !hasSolicitacaoMatricula) return null

    return (
      <Card className="border-blue-500/30 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-blue-500/20">
              <FileCheck className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                Documento Gerado com Sucesso! 📄
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-500 mt-1">
                Sua minuta foi gerada e está disponível para download.
              </p>
              
              {data.minutaPdfUrl && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 gap-2"
                  onClick={() => window.open(data.minutaPdfUrl, '_blank')}
                >
                  <FileText className="h-4 w-4" />
                  Baixar Documento
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Se todas as ações foram concluídas com sucesso
  const isAllSuccess = hasSolicitacaoMatricula || hasMinuta

  if (isAllSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-6">
          {/* Cabeçalho de Sucesso */}
          <div className="text-center py-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex p-4 rounded-full bg-green-500/20 mb-4"
            >
              <Award className="h-16 w-16 text-green-500" />
            </motion.div>
            <h2 className="text-3xl font-bold tracking-tight text-green-700 dark:text-green-400">
              Processo Concluído! 🎉
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Todas as etapas foram realizadas com sucesso. Acompanhe o andamento na página de processos.
            </p>
          </div>

          {/* Cards de Sucesso */}
          {renderSolicitacaoMatriculaSuccess()}
          {renderMinutaSuccess()}

          {/* Resumo do Processo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Resumo do Processo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Cliente:</span>
                  <span className="font-medium">{data.cliente?.nome}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tipo de Visto:</span>
                  <Badge variant="outline">{formatTipoVisto()}</Badge>
                </div>
                {data.subtipo && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Subtipo:</span>
                    <Badge variant="secondary">{formatSubtipo()}</Badge>
                  </div>
                )}
                {data.financiamento && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Financiamento:</span>
                    <Badge variant={data.financiamento === "financiado" ? "default" : "outline"}>
                      {formatFinanciamento()}
                    </Badge>
                  </div>
                )}
                {data.financiamentoOrigem && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Origem:</span>
                    <Badge variant="outline" className="font-normal gap-1">
                      {data.financiamentoOrigem === "nacional" ? (
                        <Building2 className="h-3 w-3" />
                      ) : (
                        <Globe className="h-3 w-3" />
                      )}
                      {formatOrigem()}
                    </Badge>
                  </div>
                )}
                {data.financiador_nome && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Financiador:</span>
                    <span className="font-medium">{data.financiador_nome}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Concluído
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Próximos Passos */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">📋 Próximos Passos:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Acompanhe o status do seu processo na página inicial
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Fique atento ao seu e-mail para mais informações
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Em caso de dúvidas, entre em contacto com o suporte
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleVoltarInicio} className="gap-2 flex-1">
              <Home className="h-4 w-4" />
              Voltar ao Início
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  // Renderizar revisão normal (quando não há ações concluídas)
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

        {/* Origem do Financiamento */}
        {data.financiamentoOrigem && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Origem do Financiamento
              </CardTitle>
              <Badge variant="secondary" className="gap-1">
                <Edit2 className="h-3 w-3" />
                Passo 5
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Origem:</span>
                  <Badge variant="outline" className="font-normal gap-1">
                    {data.financiamentoOrigem === "nacional" ? (
                      <Building2 className="h-3 w-3" />
                    ) : (
                      <Globe className="h-3 w-3" />
                    )}
                    {formatOrigem()}
                  </Badge>
                </div>
                {data.financiador_nome && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Financiador:</span>
                    <span className="font-medium text-right">
                      {data.financiador_nome}
                    </span>
                  </div>
                )}
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