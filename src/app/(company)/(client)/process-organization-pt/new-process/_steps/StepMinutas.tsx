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
  Eye,
  XCircle,
  Clock,
  AlertCircle
} from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { ModalPreencherMinuta } from "../_components/ModalPreencherMinuta"
import { StepSolicitarMatricula } from "./StepSolicitarMatricula"
import { cn } from "@/lib/utils"
import { ModalPreencherMinuta2 } from "../_components/ModalPreencherMinuta2"
import { useSaveProcessoProgress } from "@/features/processo-progress/hooks/useProcessoProgress"
import { toast } from "react-toastify"
import { ModalSelecionarCurso } from "../_components/ModalSelecionarCurso"
import { CourseType } from "@/features/course/types"
import { ModalEmitirTermoResponsabilidade } from "../_components/ModalEmitirTermoResponsabilidade"
import { ModalEmitirFormulario } from "../_components/ModalEmitirFormulario"
import { useGetSolicitacaoMatriculaByClienteId } from "@/features/solicitacao-matricula/hooks/useSoliMatriculaQuery"
import { useCreateDocumentoProfundoStatus, useGetDocumentoProfundoStatusByClienteId, useUpdateDocumentoProfundoStatus } from "@/features/documentos-profundo/hooks/useDocumentoProfundoQuery"
import { DocumentoProfundoStatus } from "@/features/documentos-profundo/types"

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
  status?: string
  documentos?: string[]
}

const minutas = (solicitacaoMatricula: any): Minuta[] => [
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
    status: solicitacaoMatricula ? solicitacaoMatricula.status : 'nao_enviado',
    documentos: [
      "Documentos pessoais",
      "Histórico escolar",
      "Comprovante de pagamento",
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
  const [showMinutaModal2, setShowMinutaModal2] = useState(false);
  const [showMatriculaPage, setShowMatriculaPage] = useState(false);
  const [showTermoResponsabilidadeModal, setShowTermoResponsabilidadeModal] = useState(false);
  const [showFormularioModal, setShowFormularioModal] = useState(false);
  const [isModalOpenSelectedCurso, setIsModalOpenSelectedCurso] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null)
  
  // USAR useRef para controlar se já foi inicializado
  const isInitialized = useRef(false);
  const isCreating = useRef(false);

  const saveProcessoProgress = useSaveProcessoProgress();
  const { data: solicitacaoMatricula } = useGetSolicitacaoMatriculaByClienteId(String(data.cliente?.id));
  const { data: documentoProfundoStatus, refetch: refetchStatus } = useGetDocumentoProfundoStatusByClienteId(String(data.cliente?.id));
  const createStatusMutation = useCreateDocumentoProfundoStatus();
  const updateStatusMutation = useUpdateDocumentoProfundoStatus();

  // LÓGICA CORRIGIDA: Inicializar status apenas uma vez
  useEffect(() => {
    // Só executa se tiver cliente
    if (!data.cliente?.id) return;

    // IMPEDIR DUPLA EXECUÇÃO
    if (isInitialized.current) {
      console.log('⚠️ Status já foi inicializado, ignorando...');
      return;
    }

    // IMPEDIR CRIAÇÃO EM PARALELO
    if (isCreating.current) {
      console.log('⚠️ Criação em andamento, aguarde...');
      return;
    }

    // Função para verificar e criar status
    const initializeStatus = async () => {
      try {
        // Verifica novamente se já existe status (evita race condition)
        const { data: freshStatus } = await refetchStatus();
        
        if (freshStatus) {
          // ✅ JÁ TEM STATUS: só marca como inicializado
          console.log('✅ Status já existe para o cliente:', data.cliente?.id);
          isInitialized.current = true;
          return;
        }

        // ❌ NÃO TEM STATUS: criar novo
        console.log('🔄 Criando status para o cliente:', data.cliente?.id);
        isCreating.current = true;

        createStatusMutation.mutate({
          cliente_id: data.cliente?.id,
          status_solicitacao_matricula: "nao_enviado",
          status_solicitacao_agendamento: "nao_enviado",
          status_formulario: false,
          status_termo_responsabilidade: false,
          status_minuta1: false,
          status_minuta2: false,
          status_geral: "em_andamento",
        }, {
          onSuccess: () => {
            console.log('✅ Status criado com sucesso!');
            toast.success('Status inicializado com sucesso!');
            isInitialized.current = true;
            isCreating.current = false;
            refetchStatus(); // Atualiza o status
          },
          onError: (error) => {
            console.error('❌ Erro ao criar status:', error);
            toast.error('Erro ao inicializar status');
            isCreating.current = false;
          },
        });

      } catch (error) {
        console.error('❌ Erro ao verificar status:', error);
        isCreating.current = false;
      }
    };

    // Aguarda um pequeno delay para garantir que a query já foi executada
    const timer = setTimeout(() => {
      initializeStatus();
    }, 100);

    return () => clearTimeout(timer);
  }, [data.cliente?.id]); // SÓ DEPENDE DO ID DO CLIENTE

  // Função para verificar se um card deve estar desabilitado
  const isCardDisabled = (minutaId: TipoMinuta, status: DocumentoProfundoStatus | undefined) => {
    if (!status) return false;

    switch (minutaId) {
      case 'solicitar_matricula':
        return status.status_solicitacao_matricula === 'pendente' || 
               status.status_solicitacao_matricula === 'aprovado' || 
               status.status_solicitacao_matricula === 'rejeitado';
      
      case 'solicitar_agendamento':
        return status.status_solicitacao_agendamento === 'pendente' || 
               status.status_solicitacao_agendamento === 'aprovado' ||
               status.status_solicitacao_agendamento === 'rejeitado';
      
      case 'formulario':
        return status.status_formulario == true;
      
      case 'termo_responsabilidade':
        return status.status_termo_responsabilidade == true;
      
      case 'minuta1':
        return status.status_minuta1 == true;
      
      case 'minuta2':
        return status.status_minuta2 == true;
      
      default:
        return false;
    }
  };

  // Função para pegar o status atual do documento
  const getDocumentStatus = (minutaId: TipoMinuta, status: any) => {
    if (!status) return null;

    switch (minutaId) {
      case 'solicitar_matricula':
        return status.status_solicitacao_matricula;
      
      case 'solicitar_agendamento':
        return status.status_solicitacao_agendamento;
      
      case 'formulario':
        return status.status_formulario ? 'concluido' : 'nao_enviado';
      
      case 'termo_responsabilidade':
        return status.status_termo_responsabilidade ? 'concluido' : 'nao_enviado';
      
      case 'minuta1':
        return status.status_minuta1 ? 'concluido' : 'nao_enviado';
      
      case 'minuta2':
        return status.status_minuta2 ? 'concluido' : 'nao_enviado';
      
      default:
        return null;
    }
  };

  // Função para pegar a cor do status
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'aprovado':
      case 'concluido':
        return 'text-green-600 bg-green-100 border-green-500';
      case 'reprovado':
        return 'text-red-600 bg-red-100 border-red-500';
      case 'pendente':
        return 'text-yellow-600 bg-yellow-100 border-yellow-500';
      case 'nao_enviado':
        return 'text-gray-600 bg-gray-100 border-gray-500';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  // Função para pegar o ícone do status
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'aprovado':
      case 'concluido':
        return <CheckCircle className="h-4 w-4" />;
      case 'reprovado':
        return <XCircle className="h-4 w-4" />;
      case 'pendente':
        return <Clock className="h-4 w-4" />;
      case 'nao_enviado':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Função para pegar o texto do status
  const getStatusText = (status: string) => {
    switch(status) {
      case 'aprovado':
        return 'Aprovado';
      case 'reprovado':
        return 'Rejeitado';
      case 'pendente':
        return 'Pendente';
      case 'nao_enviado':
        return 'Não iniciado';
      case 'concluido':
        return 'Concluído';
      default:
        return status || 'Não iniciado';
    }
  };

  const handleSelectCourse = (course: CourseType) => {
    setSelectedCourse(course);
    setShowMatriculaPage(true);
  }

  const handleSelect = (minutaId: TipoMinuta) => {
    // Verifica se o card está desabilitado
    if (isCardDisabled(minutaId, documentoProfundoStatus!!)) {
      toast.warning('Este documento já foi concluído!');
      return;
    }

    setSelectedMinuta(minutaId)
    setData((prev) => ({
      ...prev,
      minutaSelecionada: minutaId,
    }));

    // Abre os modais correspondentes
    if (minutaId === "minuta1") {
      setShowMinutaModal(true)
    } else if (minutaId === "solicitar_matricula") {
      setIsModalOpenSelectedCurso(true)
    } else if (minutaId === "minuta2") {
      setShowMinutaModal2(true)
    } else if(minutaId === "termo_responsabilidade") {
      setShowTermoResponsabilidadeModal(true)
    } else if (minutaId === "formulario") {
      setShowFormularioModal(true)
    }
  }

  const handleConfirm = () => {
    if (selectedMinuta) {
      next()
    }
  }

  const handleMinutaSuccess = (pdfUrl: string) => {
    setData((prev) => ({
      ...prev,
      minutaPdfUrl: pdfUrl,
    }))
    next()
  }

  // Atualizar status após conclusão de cada documento
  const updateDocumentStatus = (minutaId: TipoMinuta) => {
    if (!documentoProfundoStatus || !data.cliente?.id) return;

    const updatedStatus = { ...documentoProfundoStatus };

    switch (minutaId) {
      case 'solicitar_matricula':
        updatedStatus.status_solicitacao_matricula = 'aprovado';
        break;
      case 'solicitar_agendamento':
        updatedStatus.status_solicitacao_agendamento = 'aprovado';
        break;
      case 'formulario':
        updatedStatus.status_formulario = true;
        break;
      case 'termo_responsabilidade':
        updatedStatus.status_termo_responsabilidade = true;
        break;
      case 'minuta1':
        updatedStatus.status_minuta1 = true;
        break;
      case 'minuta2':
        updatedStatus.status_minuta2 = true;
        break;
    }

    // Verifica se todos estão concluídos
    if (
      updatedStatus.status_solicitacao_matricula === 'pendente' &&
      updatedStatus.status_solicitacao_agendamento === 'pendente' &&
      updatedStatus.status_formulario === true &&
      updatedStatus.status_termo_responsabilidade === true &&
      updatedStatus.status_minuta1 === true &&
      updatedStatus.status_minuta2 === true
    ) {
      updatedStatus.status_geral = 'concluido';
    }

    updateStatusMutation.mutate({ 
      clienteId: String(data.cliente.id), 
      newSolicitacao: updatedStatus 
    });
  };

  useEffect(() => {
    // Salvar o progresso da etapa de minutas no backend
    if (data.cliente?.id) {
      saveProcessoProgress.mutate({
        cliente_id: data.cliente.id,
        current_step: 6,
        tipo_visto: data.tipoVisto || '',
        subtipo: data.subtipo || '',
        financiamento: data.financiamento || '',
        financiamento_origem: data.financiamentoOrigem || '',
        documentos_profundo: selectedMinuta || '',
        status: 'em_progresso',
      }, {
        onSuccess: () => {
          toast.success('Progresso do processo salvo com sucesso');
        },
        onError: (error) => {
          toast.error('Erro ao salvar progresso do processo');
          console.log('Erro ao salvar progresso do processo:', error);
        },
      });
    }
  }, []);

  if (showMatriculaPage) {
    return (
      <StepSolicitarMatricula
        onBack={() => setShowMatriculaPage(false)}
        onSuccess={(data) => {
          setData((prev) => ({ ...prev, solicitacaoMatricula: data }))
          // Atualiza o status após sucesso
          updateDocumentStatus('solicitar_matricula');
          setShowMatriculaPage(false);
        }}
        cliente={data?.cliente}
        cursoSelected={selectedCourse}
      />
    )
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-3">
              <FileText className="h-3 w-3" />
              <span className="font-medium">Documentação</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Análise de documentos profundos
            </h2>
            <p className="text-muted-foreground mt-1">
              Escolha o documento necessário para seu processo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
           {minutas(solicitacaoMatricula).map((minuta, index) => {
              const Icon = minuta.icone
              const isSelected = selectedMinuta === minuta.id
              const isExpanded = showDetails === minuta.id
              
              // Obtém o status atual do documento
              const currentStatus = getDocumentStatus(minuta.id, documentoProfundoStatus);
              const disabled = isCardDisabled(minuta.id, documentoProfundoStatus);
              
              // Determina se o card deve mostrar status
              const hasStatus = currentStatus !== null && currentStatus !== undefined;

              return (
                <motion.div
                  key={minuta.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex"
                >
                  <Card
                    className={cn(
                      "transition-all hover:shadow-lg border-2 group cursor-pointer w-full flex flex-col relative",
                      disabled && "opacity-70 cursor-not-allowed",
                      !disabled && "hover:border-gray-300",
                      hasStatus && currentStatus && getStatusColor(currentStatus).split(' ')[2] // Pega a cor da borda
                    )}
                    onClick={disabled ? undefined : () => handleSelect(minuta.id)}
                  >
                    {/* Badge de status */}
                    {hasStatus && currentStatus && (
                      <div className={cn(
                        "absolute top-3 right-3 z-10 flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                        getStatusColor(currentStatus)
                      )}>
                        {getStatusIcon(currentStatus)}
                        <span>{getStatusText(currentStatus)}</span>
                      </div>
                    )}

                    <CardContent className="p-4 flex-1 flex flex-col">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={cn(
                          "p-3 rounded-xl bg-gradient-to-br text-white shadow-md transition-transform shrink-0",
                          minuta.cor,
                          !disabled && "group-hover:scale-110"
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1 flex flex-col">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">{minuta.titulo}</h3>
                            {isSelected && !disabled && (
                              <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {minuta.descricao}
                          </p>

                          {/* Botões de ação - só visíveis se não estiver desabilitado */}
                          {!disabled && (
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
                                  console.log("Download:", minuta.id)
                                }}
                                className="gap-1"
                              >
                                <Download className="h-3 w-3" />
                                Baixar exemplo
                              </Button>
                            </div>
                          )}

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

                        {!disabled && !hasStatus && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary text-lg">→</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Modais existentes */}
      <ModalPreencherMinuta
        open={showMinutaModal}
        onOpenChange={setShowMinutaModal}
        cliente={data.cliente}
        onSuccess={(pdfUrl) => {
          // handleMinutaSuccess(pdfUrl);
          // updateDocumentStatus('minuta1');
          refetchStatus();
        }}
      />

      <ModalPreencherMinuta2
        open={showMinutaModal2}
        onOpenChange={setShowMinutaModal2}
        cliente={data.cliente}
        onSuccess={(pdfUrl) => {
          // handleMinutaSuccess(pdfUrl);
          // updateDocumentStatus('minuta2');
          refetchStatus();
        }}
      />

      <ModalSelecionarCurso
        isOpen={isModalOpenSelectedCurso}
        onClose={() => setIsModalOpenSelectedCurso(false)}
        onSelectCourse={handleSelectCourse}
      />

      <ModalEmitirTermoResponsabilidade
        open={showTermoResponsabilidadeModal}
        onOpenChange={setShowTermoResponsabilidadeModal}
        cliente={data.cliente}
        onSuccess={(pdfUrl) => {
          setData((prev) => ({
            ...prev,
            termoResponsabilidadePdfUrl: pdfUrl,
          }));
          updateDocumentStatus('termo_responsabilidade');
          refetchStatus();
          // next();
        }}
      />

      <ModalEmitirFormulario
        open={showFormularioModal}
        onOpenChange={setShowFormularioModal}
        cliente={data.cliente}
        onSuccess={(pdfUrl) => {
          setData((prev) => ({
            ...prev,
            formularioPdfUrl: pdfUrl,
          }))
          updateDocumentStatus('formulario')
          refetchStatus()
        }}
      />
    </>
  )
}