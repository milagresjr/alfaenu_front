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
  XCircle,
  Clock,
  AlertCircle,
  Plane,
  Building2,
  AlertTriangle,
  User,
  Globe,
  Wallet,
  Tag
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
import { ModalSolicitarAgendamento } from "../_components/ModalSolicitarAgendamento"
import { ModalAgendamentoExistente } from "../_components/ModalAgendamentoExistente"
import { ModalSolicitarPrintVoo } from "../_components/ModalSolicitarPrintVoo"
import { ModalSolicitarReservaHotel } from "../_components/ModalSolicitarReservaHotel"
import { useGetSolicitacaoMatriculaByClienteId } from "@/features/solicitacao-matricula/hooks/useSoliMatriculaQuery"
import { useCreateDocumentoProfundoStatus, useGetDocumentoProfundoStatusByClienteId, useUpdateDocumentoProfundoStatus } from "@/features/documentos-profundo/hooks/useDocumentoProfundoQuery"
import { DocumentoProfundoStatus } from "@/features/documentos-profundo/types"
import { useAuthStore } from "@/store/useAuthStore"
import { api } from "@/services/api"
import { alert } from "@/lib/alert"
import { useBaixarDeclaracao, useGetMotivoRejeicao } from "@/features/solicitacao-matricula/hooks/useSoliMatriculaQuery"
import { useGetSolicitacaoAgendamentoByClienteId } from "@/features/solicitacao-agendamento/hooks/useSoliAgendamentoQuery"
import { useGetSolicitacaoPrintVooByClienteId, useGetMotivoRejeicaoPrintVoo } from "@/features/solicitacao-print-voo/hooks/usePrintVooQuery"
import { useGetSolicitacaoReservaHotelByClienteId, useGetMotivoRejeicaoReservaHotel } from "@/features/solicitacao-reserva-hotel/hooks/useReservaHotelQuery"
import { useGetProcessoProgressByClienteId } from "@/features/processo-progress/hooks/useProcessoProgress"
import { ModalSolicitarReconhecimentoConsulado } from "../_components/ModalSolicitarReconhecimentoConsulado"
import { useGetReconhecimentoConsuladoByClienteId, useGetMotivoRejeicaoReconhecimentoConsulado } from "@/features/solicitacao-reconhecimento-consulado/hooks/useReconhecimentoConsuladoQuery"

type TipoMinuta =
  | "minuta1"
  | "minuta2"
  | "formulario"
  | "termo_responsabilidade"
  | "solicitar_agendamento"
  | "solicitar_matricula"
  | "print_voo"
  | "reserva_hotel"

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
    id: "print_voo",
    titulo: "Print de Voo",
    descricao: "Comprovante de reserva ou bilhete de passagem aérea",
    icone: Plane,
    cor: "from-orange-500 to-amber-500",
    documentos: [
      "Bilhete de passagem",
      "Comprovante de reserva",
      "Itinerário de voo",
    ],
  },
  {
    id: "reserva_hotel",
    titulo: "Reserva de Hotel",
    descricao: "Comprovante de reserva de hospedagem durante a estada",
    icone: Building2,
    cor: "from-green-500 to-emerald-500",
    documentos: [
      "Comprovante de reserva",
      "Detalhes da hospedagem",
      "Período da estada",
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
    titulo: 'Solicitar Matrícula',
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
    titulo: "Minuta 1 (DECLARAÇÃO DE ESTADA PREVISTA)",
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
    titulo: "Minuta 2 (CARTA DE INTENÇÃO)",
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
  const [showMinutaModal, setShowMinutaModal] = useState(false)
  const [selectedMinutaId, setSelectedMinutaId] = useState<TipoMinuta | null>(null)
  const [showMinutaModal2, setShowMinutaModal2] = useState(false);
  const [showMatriculaPage, setShowMatriculaPage] = useState(false);
  const [showTermoResponsabilidadeModal, setShowTermoResponsabilidadeModal] = useState(false);
  const [showFormularioModal, setShowFormularioModal] = useState(false);
  const [showAgendamentoModal, setShowAgendamentoModal] = useState(false);
  const [showAgendamentoExistenteModal, setShowAgendamentoExistenteModal] = useState(false);
  const [showPrintVooModal, setShowPrintVooModal] = useState(false);
  const [showReservaHotelModal, setShowReservaHotelModal] = useState(false);
  const [showReconhecimentoConsuladoModal, setShowReconhecimentoConsuladoModal] = useState(false);
  const [isModalOpenSelectedCurso, setIsModalOpenSelectedCurso] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null)

  const { user } = useAuthStore();
  
  // USAR useRef para controlar se já foi inicializado
  const isInitialized = useRef(false);
  const isCreating = useRef(false);

  const saveProcessoProgress = useSaveProcessoProgress();
  const { data: solicitacaoMatricula } = useGetSolicitacaoMatriculaByClienteId(String(data.cliente?.id));
  const { data: solicitacaoAgendamento } = useGetSolicitacaoAgendamentoByClienteId(String(data.cliente?.id));
  const { data: solicitacaoPrintVoo } = useGetSolicitacaoPrintVooByClienteId(String(data.cliente?.id));
  const { data: solicitacaoReservaHotel } = useGetSolicitacaoReservaHotelByClienteId(String(data.cliente?.id));
  const { data: reconhecimentoConsulado } = useGetReconhecimentoConsuladoByClienteId(String(data.cliente?.id));
  const { data: documentoProfundoStatus, refetch: refetchStatus } = useGetDocumentoProfundoStatusByClienteId(String(data.cliente?.id));
  const { data: processoProgress } = useGetProcessoProgressByClienteId(data.cliente?.id ?? 0);

  const financiadorIdValue = data.financiador_id ?? processoProgress?.financiador_id;
  const baixarDeclaracaoMutation = useBaixarDeclaracao();
  const { data: motivoRejeicao } = useGetMotivoRejeicao(
    solicitacaoMatricula?.status === 'rejeitado' ? solicitacaoMatricula.id : ''
  );
  const { data: motivoRejeicaoPrintVoo } = useGetMotivoRejeicaoPrintVoo(
    solicitacaoPrintVoo?.status === 'rejeitado' ? solicitacaoPrintVoo.id : ''
  );
  const { data: motivoRejeicaoReservaHotel } = useGetMotivoRejeicaoReservaHotel(
    solicitacaoReservaHotel?.status === 'rejeitado' ? solicitacaoReservaHotel.id : ''
  );
  const { data: motivoRejeicaoReconhecimento } = useGetMotivoRejeicaoReconhecimentoConsulado(
    reconhecimentoConsulado?.status === 'rejeitado' ? String(reconhecimentoConsulado.id) : ''
  );
  const createStatusMutation = useCreateDocumentoProfundoStatus();
  const updateStatusMutation = useUpdateDocumentoProfundoStatus();

  console.log("SOLICITACAO DA MATRICULA: ", solicitacaoMatricula);
  console.log("STATUS DO DOCUMENTO PROFUNDO: ", documentoProfundoStatus);

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
          status_solicitacao_print_voo: "nao_enviado",
          status_solicitacao_reserva_hotel: "nao_enviado",
          status_reconhecimento_termo_consulado: "nao_enviado",
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
      
      case 'print_voo':
        return status.status_solicitacao_print_voo === 'pendente' || 
               status.status_solicitacao_print_voo === 'aprovado' ||
               status.status_solicitacao_print_voo === 'rejeitado';
      
      case 'reserva_hotel':
        return status.status_solicitacao_reserva_hotel === 'pendente' || 
               status.status_solicitacao_reserva_hotel === 'aprovado' ||
               status.status_solicitacao_reserva_hotel === 'rejeitado';
      
      case 'formulario':
        return false;
      
      case 'termo_responsabilidade':
        return false;
      
      case 'minuta1':
        return false;
      
      case 'minuta2':
        return false;
      
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
      
      case 'print_voo':
        return status.status_solicitacao_print_voo;
      
      case 'reserva_hotel':
        return status.status_solicitacao_reserva_hotel;
      
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
      case 'rejeitado':
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
      case 'rejeitado':
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
      case 'rejeitado':
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

  // Função para pegar o texto do botão de ação
  const getActionButtonText = (minutaId: TipoMinuta): string => {
    switch (minutaId) {
      case 'minuta1': return 'Criar Minuta 1';
      case 'minuta2': return 'Criar Minuta 2';
      case 'formulario': return 'Criar Formulário';
      case 'termo_responsabilidade': return 'Emitir Termo';
      case 'solicitar_matricula': return 'Solicitar Matrícula';
      case 'solicitar_agendamento': return 'Solicitar Agendamento';
      case 'print_voo': return 'Adicionar Voo';
      case 'reserva_hotel': return 'Adicionar Hotel';
      default: return 'Abrir';
    }
  };

  const handleSelectCourse = (course: CourseType) => {
    setSelectedCourse(course);
    setShowMatriculaPage(true);
  }

  const handleEmitirTermo = async () => {
    const confirmed = await alert.confirm(
      'Emitir Termo de Responsabilidade',
      'Deseja emitir o termo de responsabilidade?',
      'Aceitar/Emitir',
      'Cancelar'
    );

    if (!confirmed || !data.cliente?.id) return;


    try {
      const response = await api.post('termo-responsabilidade/gerar-pdf', {
        cliente_id: data.cliente.id,
        financiador_id: financiadorIdValue,
      }, {
        responseType: 'blob'
      });

      const contentType = String(response.headers['content-type']) || ''
      if (!contentType.includes('application/pdf')) {
        const text = await (response.data as Blob).text()
        console.error('Resposta não é PDF:', text.substring(0, 500))
        throw new Error('Erro ao gerar termo de responsabilidade')
      }

      if ((response.data as Blob).size === 0) {
        throw new Error('PDF vazio')
      }

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `termo_responsabilidade_${data.cliente.nome}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Termo de responsabilidade emitido com sucesso!');
      updateDocumentStatus('termo_responsabilidade');
      refetchStatus();
    } catch (error: any) {
      console.error('Erro ao emitir termo de responsabilidade:', error);
      if (error.response && error.response.data instanceof Blob) {
        try {
          const errorText = await error.response.data.text()
          const errorJson = JSON.parse(errorText)
          toast.error(errorJson.message || 'Erro ao emitir termo de responsabilidade')
        } catch {
          toast.error('Erro ao emitir termo de responsabilidade')
        }
      } else {
        toast.error(error.message || 'Erro ao emitir termo de responsabilidade')
      }
    }
  }

  const handleSelect = (minutaId: TipoMinuta) => {
    // Verifica se o card está desabilitado
    if (isCardDisabled(minutaId, documentoProfundoStatus!!)) {
      toast.warning('Este documento já foi concluído!');
      return;
    }

    // Verifica se a solicitação de matrícula foi aprovada para minutas, formulário, print voo e reserva hotel
    if (minutaId === "minuta1" || minutaId === "minuta2" || minutaId === "formulario" || minutaId === "print_voo" || minutaId === "reserva_hotel") {
      if (solicitacaoMatricula?.status !== 'aprovado') {
        alert.warning(
          'Solicitação de Matrícula Necessária',
          'É preciso primeiro fazer a solicitação de matrícula e ser aprovada.'
        );
        return;
      }
    }

    // Verifica se a solicitação de reserva de hotel foi aprovada para emissão de formulário
    if (minutaId === "formulario") {
      if (solicitacaoReservaHotel?.status !== 'aprovado') {
        alert.warning(
          'Reserva de Hotel Necessária',
          'Para emitir o formulário é preciso primeiro fazer a solicitação de reserva de hotel e ser aprovada.'
        );
        return;
      }
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
      handleEmitirTermo()
    } else if (minutaId === "solicitar_agendamento") {
      setShowAgendamentoModal(true)
    } else if (minutaId === "formulario") {
      setShowFormularioModal(true)
    } else if (minutaId === "print_voo") {
      setShowPrintVooModal(true)
    } else if (minutaId === "reserva_hotel") {
      setShowReservaHotelModal(true)
    }
  }

  const handleRedownload = async (minutaId: TipoMinuta) => {
    if (minutaId === 'formulario') {
      if (!data.cliente?.id) return
     
      try {
        const response = await api.post('formulario/gerar-pdf', {
          ...data,
          cliente: null,
          cliente_id: data.cliente.id,
          residencia_outro_pais: false,
          autorizacao_residencia: "",
          num_autorizacao_residencia: "",
          validade_autorizacao_residencia: "",
          data_prevista_chegada: "",
          data_prevista_saida: "",
          despesas_proprio: false,
          despesas_garante: false,
          despesas_dinheiro: false,
          despesas_cheques: false,
          despesas_cartoes: false,
          despesas_alojamento: false,
          despesas_transporte: false,
          despesas_alojamento_fornecido: false,
          despesas_todas_cobertas: false,
          despesas_outro_especificar: "",
          despesas_dinheiro_garante: false,
          despesas_transporte_garante: false,
          despesas_garante_outro_especificar: "",
        }, {
          responseType: 'blob'
        })

        const blob = new Blob([response.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `formulario_${data.cliente.nome}.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)

        toast.success('Formulário baixado novamente!')
      } catch (error) {
        console.error('Erro ao baixar formulário:', error)
        toast.error('Erro ao baixar formulário')
      }
    } else if (minutaId === 'minuta1') {
      setShowMinutaModal(true)
    } else if (minutaId === 'minuta2') {
      setShowMinutaModal2(true)
    } else if (minutaId === 'termo_responsabilidade') {
      if (!data.cliente?.id) return
      try {
        const response = await api.post('termo-responsabilidade/gerar-pdf', {
          cliente_id: data.cliente.id,
          financiador_id: financiadorIdValue,
        }, {
          responseType: 'blob'
        })

        const contentType = String(response.headers['content-type']) || ''
        if (!contentType.includes('application/pdf')) {
          const text = await (response.data as Blob).text()
          console.error('Resposta não é PDF:', text.substring(0, 500))
          throw new Error('Erro ao gerar termo de responsabilidade')
        }

        if ((response.data as Blob).size === 0) {
          throw new Error('PDF vazio')
        }

        const blob = new Blob([response.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `termo_responsabilidade_${data.cliente.nome}.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)

        toast.success('Termo de responsabilidade baixado novamente!')
      } catch (error: any) {
        console.error('Erro ao baixar termo de responsabilidade:', error)
        if (error.response && error.response.data instanceof Blob) {
          try {
            const errorText = await error.response.data.text()
            const errorJson = JSON.parse(errorText)
            toast.error(errorJson.message || 'Erro ao baixar termo de responsabilidade')
          } catch {
            toast.error('Erro ao baixar termo de responsabilidade')
          }
        } else {
          toast.error(error.message || 'Erro ao baixar termo de responsabilidade')
        }
      }
    } else if (minutaId === 'solicitar_matricula') {
      if (!solicitacaoMatricula?.id) return
      try {
        const blob = await baixarDeclaracaoMutation.mutateAsync(solicitacaoMatricula.id)
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = solicitacaoMatricula.declaracao_nome || `declaracao_matricula.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
        toast.success('Declaração baixada com sucesso!')
      } catch (error) {
        console.error('Erro ao baixar declaração:', error)
        toast.error('Erro ao baixar declaração')
      }
    } else if (minutaId === 'solicitar_agendamento') {
      if (!solicitacaoAgendamento?.agendamento_url) {
        toast.error('URL do agendamento não disponível.')
        return
      }
      const a = document.createElement('a')
      a.href = solicitacaoAgendamento.agendamento_url
      a.download = solicitacaoAgendamento.agendamento_nome || 'agendamento.pdf'
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      a.remove()
      toast.success('Agendamento baixado com sucesso!')
    } else if (minutaId === 'print_voo') {
      if (!solicitacaoPrintVoo?.comprovativo_url) {
        toast.error('Comprovativo não disponível.')
        return
      }
      const a = document.createElement('a')
      a.href = solicitacaoPrintVoo.comprovativo_url
      a.download = solicitacaoPrintVoo.comprovativo_nome || 'comprovativo_voo.pdf'
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      a.remove()
      toast.success('Comprovativo baixado com sucesso!')
    } else if (minutaId === 'reserva_hotel') {
      if (!solicitacaoReservaHotel?.comprovativo_url) {
        toast.error('Comprovativo não disponível.')
        return
      }
      const a = document.createElement('a')
      a.href = solicitacaoReservaHotel.comprovativo_url
      a.download = solicitacaoReservaHotel.comprovativo_nome || 'comprovativo_hotel.pdf'
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      a.remove()
      toast.success('Comprovativo baixado com sucesso!')
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
  const updateDocumentStatus = async (minutaId: string): Promise<void> => {
    if (!documentoProfundoStatus || !data.cliente?.id) return;

    const updatedStatus = { ...documentoProfundoStatus };

    switch (minutaId) {
      case 'solicitar_matricula':
        updatedStatus.status_solicitacao_matricula = 'pendente';
        break;
      case 'solicitar_agendamento':
        updatedStatus.status_solicitacao_agendamento = 'pendente';
        break;
      case 'print_voo':
        updatedStatus.status_solicitacao_print_voo = 'pendente';
        break;
      case 'reserva_hotel':
        updatedStatus.status_solicitacao_reserva_hotel = 'pendente';
        break;
      case 'formulario':
        updatedStatus.status_formulario = true;
        break;
      case 'termo_responsabilidade':
        updatedStatus.status_termo_responsabilidade = true;
        break;
      case 'reconhecimento_consulado':
        updatedStatus.status_reconhecimento_termo_consulado = 'pendente';
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
      updatedStatus.status_solicitacao_print_voo === 'pendente' &&
      updatedStatus.status_solicitacao_reserva_hotel === 'pendente' &&
      updatedStatus.status_formulario === true &&
      updatedStatus.status_termo_responsabilidade === true &&
      updatedStatus.status_minuta1 === true &&
      updatedStatus.status_minuta2 === true
    ) {
      updatedStatus.status_geral = 'concluido';
    }

    await updateStatusMutation.mutateAsync({ 
      clienteId: String(data.cliente.id), 
      newSolicitacao: updatedStatus 
    });
  };

  useEffect(() => {
    // Salvar o progresso da etapa de minutas no backend
    console.log("DADOS ATUAIS DO CLIEWNTE", data);
    if (data.cliente?.id) {
      saveProcessoProgress.mutate({
        cliente_id: data.cliente.id,
        utilizador_id: String(user?.id),
        current_step: 6,
        tipo_visto: data.tipoVisto || '',
        subtipo: data.subtipo || '',
        financiamento: data.financiamento || '',
        financiamento_origem: data.financiamentoOrigem || '',
        documentos_profundo: selectedMinuta || '',
        financiador_id: String(data.financiador_id),
        financiador_nome: String(data.financiador_nome),
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
        onSuccess={async (data) => {
          setData((prev) => ({ ...prev, solicitacaoMatricula: data }))
          await updateDocumentStatus('solicitar_matricula');
          refetchStatus();
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

          {/* Resumo das escolhas anteriores */}
          <div className="bg-gradient-to-r from-primary/5 via-primary/[0.07] to-primary/10 rounded-xl border border-primary/20 p-4">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {data.cliente && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <User className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground/90">{data.cliente.nome}</span>
                  </div>
                  <div className="hidden sm:block h-5 w-px bg-border" />
                </>
              )}
              {data.tipoVisto && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Globe className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm text-foreground/80">{data.tipoVisto === 'nacional' ? 'Visto Nacional' : 'Visto Schengen'}</span>
                  </div>
                  <div className="hidden sm:block h-5 w-px bg-border" />
                </>
              )}
              {data.subtipo && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Tag className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm text-foreground/80 capitalize">{data.subtipo}</span>
                  </div>
                  <div className="hidden sm:block h-5 w-px bg-border" />
                </>
              )}
              {data.financiamento && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Wallet className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm text-foreground/80">{data.financiamento === 'auto' ? 'Auto Financiado' : 'Financiado'}</span>
                  </div>
                  <div className="hidden sm:block h-5 w-px bg-border" />
                </>
              )}
              {data.financiador_nome && (
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm text-foreground/80">{data.financiador_nome}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
           {minutas(solicitacaoMatricula).map((minuta, index) => {
              const Icon = minuta.icone
              const isSelected = selectedMinuta === minuta.id

              const statusSolicitacao = minuta.status;
               
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
                      "transition-all hover:shadow-lg border-2 w-full flex flex-col relative",
                      disabled && "opacity-70",
                      hasStatus && currentStatus && getStatusColor(currentStatus).split(' ')[2] // Pega a cor da borda
                    )}
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
                          "p-3 rounded-xl bg-gradient-to-br text-white shadow-md shrink-0",
                          minuta.cor
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

                          {/* Aviso: Solicitação de Matrícula Necessária */}
                          {/* {((minuta.id === 'print_voo' || minuta.id === 'reserva_hotel') && solicitacaoMatricula?.status !== 'aprovado') && (
                            <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                                <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                                  Solicitação de Matrícula Necessária
                                </p>
                              </div>
                              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                É preciso primeiro fazer a solicitação de matrícula e ser aprovada.
                              </p>
                            </div>
                          )} */}

                          {/* Botões */}
                          <div className="mt-3 flex flex-col md:flex-row gap-2">
                            {!disabled && (
                              <>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleSelect(minuta.id)
                                  }}
                                  className="gap-1"
                                >
                                  {getActionButtonText(minuta.id)}
                                </Button>
                                {minuta.id === 'solicitar_agendamento' && (
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setShowAgendamentoExistenteModal(true)
                                    }}
                                    className="gap-1"
                                  >
                                    Já possuo um agendamento
                                  </Button>
                                )}
                              </>
                            )}

                            {/* Botão de download para documentos concluídos */}
                            {((currentStatus === 'concluido' && ['minuta1', 'minuta2', 'formulario', 'termo_responsabilidade'].includes(minuta.id)) || (
                              minuta.id === 'solicitar_matricula' && currentStatus === 'aprovado' && solicitacaoMatricula?.declaracao_url
                            ) || (
                              minuta.id === 'solicitar_agendamento' && currentStatus === 'aprovado' && solicitacaoAgendamento?.agendamento_url
                            ) || (
                              minuta.id === 'print_voo' && currentStatus === 'aprovado' && solicitacaoPrintVoo?.comprovativo_url
                            ) || (
                              minuta.id === 'reserva_hotel' && currentStatus === 'aprovado' && solicitacaoReservaHotel?.comprovativo_url
                            )                            ) && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRedownload(minuta.id)
                                }}
                                className="gap-1"
                              >
                                <Download className="h-3 w-3" />
                                {minuta.id === 'solicitar_matricula' ? 'Baixar Declaração' : minuta.id === 'solicitar_agendamento' ? 'Baixar Agendamento' : minuta.id === 'print_voo' ? 'Baixar Comprovativo' : minuta.id === 'reserva_hotel' ? 'Baixar Comprovativo' : 'Download'}
                              </Button>
                            )}

                            {/* Reconhecimento no Consulado - sub-ação do Termo de Responsabilidade */}
                            {minuta.id === 'termo_responsabilidade' && currentStatus === 'concluido' && (
                              <>
                                {(!documentoProfundoStatus?.status_reconhecimento_termo_consulado || documentoProfundoStatus?.status_reconhecimento_termo_consulado === 'nao_enviado') && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setShowReconhecimentoConsuladoModal(true)
                                    }}
                                    className="gap-1"
                                  >
                                    <FileSignature className="h-3 w-3" />
                                    Reconhecer no Consulado
                                  </Button>
                                )}

                                {documentoProfundoStatus?.status_reconhecimento_termo_consulado === 'pendente' && (
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-300">
                                    <Clock className="h-3.5 w-3.5" />
                                    Reconhecimento Pendente
                                  </div>
                                )}

                                {documentoProfundoStatus?.status_reconhecimento_termo_consulado === 'aprovado' && (
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    Reconhecido no Consulado
                                  </div>
                                )}

                                {documentoProfundoStatus?.status_reconhecimento_termo_consulado === 'rejeitado' && (
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-300">
                                    <XCircle className="h-3.5 w-3.5" />
                                    Reconhecimento Rejeitado
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                          {/* Motivo da rejeição */}
                          {minuta.id === 'solicitar_matricula' && currentStatus === 'rejeitado' && motivoRejeicao?.motivo_rejeicao && (
                            <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg">
                              <p className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                Motivo da rejeição:
                              </p>
                              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                {motivoRejeicao.motivo_rejeicao}
                              </p>
                            </div>
                          )}

                          {minuta.id === 'print_voo' && currentStatus === 'rejeitado' && motivoRejeicaoPrintVoo?.motivo_rejeicao && (
                            <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg">
                              <p className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                Motivo da rejeição:
                              </p>
                              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                {motivoRejeicaoPrintVoo.motivo_rejeicao}
                              </p>
                            </div>
                          )}

                          {minuta.id === 'reserva_hotel' && currentStatus === 'rejeitado' && motivoRejeicaoReservaHotel?.motivo_rejeicao && (
                            <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg">
                              <p className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                Motivo da rejeição:
                              </p>
                              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                {motivoRejeicaoReservaHotel.motivo_rejeicao}
                              </p>
                            </div>
                          )}

                          {minuta.id === 'termo_responsabilidade' && documentoProfundoStatus?.status_reconhecimento_termo_consulado === 'rejeitado' && motivoRejeicaoReconhecimento?.motivo_rejeicao && (
                            <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg">
                              <p className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                Motivo da rejeição (Reconhecimento no Consulado):
                              </p>
                              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                {motivoRejeicaoReconhecimento.motivo_rejeicao}
                              </p>
                            </div>
                          )}
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

      {/* Modais existentes */}
      <ModalPreencherMinuta
        open={showMinutaModal}
        onOpenChange={setShowMinutaModal}
        cliente={data.cliente}
        initialValues={{
          data_prevista_estadia: solicitacaoMatricula?.data_prevista_chegada
            ? new Date(solicitacaoMatricula.data_prevista_chegada)
            : undefined,
          inicio_formacao_profissional: solicitacaoMatricula?.data_inicio
            ? new Date(solicitacaoMatricula.data_inicio)
            : undefined,
          termino_formacao_profissional: solicitacaoMatricula?.data_prevista_saida
            ? new Date(solicitacaoMatricula.data_prevista_saida)
            : undefined,
          local_hospedagem: solicitacaoReservaHotel?.endereco_arredores || '',
        }}
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
        initialValues={{
          data_prevista_chegada: solicitacaoMatricula?.data_prevista_chegada
            ? new Date(solicitacaoMatricula.data_prevista_chegada)
            : undefined,
          local_hospedagem: solicitacaoReservaHotel?.endereco_arredores || '',
        }}
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
        data={data}
        cliente={data.cliente}
        initialValues={{
          data_prevista_chegada: solicitacaoMatricula?.data_prevista_chegada
            ? new Date(solicitacaoMatricula.data_prevista_chegada)
            : undefined,
          data_prevista_saida: solicitacaoMatricula?.data_prevista_saida
            ? new Date(solicitacaoMatricula.data_prevista_saida)
            : undefined,
        }}
        onSuccess={(pdfUrl) => {
          setData((prev) => ({
            ...prev,
            formularioPdfUrl: pdfUrl,
          }))
          updateDocumentStatus('formulario')
          refetchStatus()
        }}
      />

      <ModalSolicitarAgendamento
        open={showAgendamentoModal}
        onOpenChange={setShowAgendamentoModal}
        cliente={data.cliente}
        onSuccess={async () => {
          await updateDocumentStatus('solicitar_agendamento');
          refetchStatus();
        }}
      />

      <ModalAgendamentoExistente
        open={showAgendamentoExistenteModal}
        onOpenChange={setShowAgendamentoExistenteModal}
        cliente={data.cliente}
        onSuccess={async () => {
          await updateDocumentStatus('solicitar_agendamento');
          refetchStatus();
        }}
      />

      <ModalSolicitarPrintVoo
        open={showPrintVooModal}
        onOpenChange={setShowPrintVooModal}
        cliente={data.cliente}
        dataPrevistaChegada={solicitacaoMatricula?.data_prevista_chegada}
        dataPrevistaSaida={solicitacaoMatricula?.data_prevista_saida}
        onSuccess={async () => {
          await updateDocumentStatus('print_voo');
          refetchStatus();
        }}
      />

      <ModalSolicitarReservaHotel
        open={showReservaHotelModal}
        onOpenChange={setShowReservaHotelModal}
        cliente={data.cliente}
        dataPrevistaChegada={solicitacaoMatricula?.data_prevista_chegada}
        dataPrevistaSaida={solicitacaoMatricula?.data_prevista_saida}
        onSuccess={async () => {
          await updateDocumentStatus('reserva_hotel');
          refetchStatus();
        }}
      />

      <ModalSolicitarReconhecimentoConsulado
        open={showReconhecimentoConsuladoModal}
        onOpenChange={setShowReconhecimentoConsuladoModal}
        cliente={data.cliente}
        onSuccess={async () => {
          await updateDocumentStatus('reconhecimento_consulado');
          refetchStatus();
        }}
      />
    </>
  )
}