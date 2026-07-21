'use client'

import { motion } from "framer-motion"
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
  Tag,
  ArrowLeft,
  MapPin,
  ShieldCheck,
  Fingerprint,
  FolderOpen,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState, useRef } from "react"
import { ModalPreencherMinuta } from "../_components/ModalPreencherMinuta"
import { StepSolicitarMatricula } from "../_steps/StepSolicitarMatricula"
import { cn } from "@/lib/utils"
import { ModalPreencherMinuta2 } from "../_components/ModalPreencherMinuta2"
import { ModalPreencherMinuta2Schengen } from "../_components/ModalPreencherMinuta2Schengen"
import { ModalPreencherMinuta1Schengen } from "../_components/ModalPreencherMinuta1Schengen"
import { useSaveProcessoProgress } from "@/features/processo-progress/hooks/useProcessoProgress"
import { toast } from "react-toastify"
import { ModalSelecionarCurso } from "../_components/ModalSelecionarCurso"
import { CourseType } from "@/features/course/types"
import { ModalEmitirTermoResponsabilidade } from "../_components/ModalEmitirTermoResponsabilidade";
import { ModalEmitirFormulario } from "../_components/ModalEmitirFormulario";
import { ModalEmitirFormularioSchengen } from "../_components/ModalEmitirFormularioSchengen";
import { ModalSolicitarAgendamento } from "../_components/ModalSolicitarAgendamento";
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
import { getFinanciadorById } from "@/features/financiador/api/financiadorApi"
import { useGetSolicitacaoAgendamentoByClienteId } from "@/features/solicitacao-agendamento/hooks/useSoliAgendamentoQuery"
import { useGetSolicitacaoPrintVooByClienteId, useGetMotivoRejeicaoPrintVoo } from "@/features/solicitacao-print-voo/hooks/usePrintVooQuery"
import { useGetSolicitacaoReservaHotelByClienteId, useGetMotivoRejeicaoReservaHotel } from "@/features/solicitacao-reserva-hotel/hooks/useReservaHotelQuery"
import { useGetSolicitacaoSeguroViagemByClienteId, useGetMotivoRejeicaoSeguroViagem } from "@/features/solicitacao-seguro-viagem/hooks/useSeguroViagemQuery"
import { useGetSolicitacaoReconhecimentoRegistoCriminalByClienteId } from "@/features/solicitacao-reconhecimento-registo-criminal/hooks/useReconhecimentoRegistoCriminalQuery"
import { useGetSolicitacaoReconhecimentoNotarioByClienteId } from "@/features/reconhecimento-notario/hooks/useReconhecimentoNotarioQuery"

import { useGetProcessoProgressByClienteId } from "@/features/processo-progress/hooks/useProcessoProgress"
import { ModalSolicitarReconhecimentoConsulado } from "../_components/ModalSolicitarReconhecimentoConsulado"
import { useGetReconhecimentoConsuladoByClienteId, useGetMotivoRejeicaoReconhecimentoConsulado } from "@/features/solicitacao-reconhecimento-consulado/hooks/useReconhecimentoConsuladoQuery"
import { ProcessoData } from "@/types/processo"
import { ModalPlanoTuristico } from "../_components/ModalPlanoTuristico"
import { ModalSolicitarSeguroViagem } from "../_components/ModalSolicitarSeguroViagem"
import { ModalSolicitarReconhecimentoRegistoCriminal } from "../_components/ModalSolicitarReconhecimentoRegistoCriminal"
import { ModalOutrosDocumentosImportantes } from "../_components/ModalOutrosDocumentosImportantes"

type TipoMinuta =
  | "minuta1"
  | "minuta1_schengen"
  | "minuta2"
  | "minuta2_schengen"
  | "formulario"
  | "formulario_schengen"
  | "termo_responsabilidade"
  | "solicitar_agendamento"
  | "solicitar_matricula"
  | "print_voo"
  | "reserva_hotel"
  | "plano_turistico"
  | "seguro_viagem"
  | "reconhecimento_registo_criminal"
  | "outros_documentos_importantes"

interface Minuta {
  id: TipoMinuta
  titulo: string
  descricao: string
  icone: any
  cor: string
  status?: string
  documentos?: string[]
}

interface DocumentosContentProps {
  data: ProcessoData
  setData: React.Dispatch<React.SetStateAction<ProcessoData>>
  onBack: () => void
  hideBackButton?: boolean
}

const minutas = (solicitacaoMatricula: any, isSchengen: boolean = false): Minuta[] => {
  const cards: Minuta[] = [
    {
      id: "print_voo" as TipoMinuta,
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
      id: "reserva_hotel" as TipoMinuta,
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
      id: "seguro_viagem" as TipoMinuta,
      titulo: "Seguro de Viagem",
      descricao: "Solicitação de seguro de viagem para o período da estada",
      icone: ShieldCheck,
      cor: "from-indigo-500 to-blue-500",
      documentos: [
        "Comprovativo de seguro",
        "Detalhes da viagem",
        "Período de cobertura",
      ],
    },
    ...(!isSchengen ? [{
      id: "reconhecimento_registo_criminal" as TipoMinuta,
      titulo: "Reconhecimento de Registo Criminal",
      descricao: "Solicitação de reconhecimento do registo criminal",
      icone: Fingerprint,
      cor: "from-rose-500 to-red-500",
      documentos: [
        "Registo criminal",
        "Comprovativo de entrega",
        "Documento de identificação",
      ],
    }] : []),
    ...(isSchengen ? [{
      id: "minuta1_schengen" as TipoMinuta,
      titulo: "Declaração de Estada Prevista (Schengen)",
      descricao: "Declaração de estada prevista para solicitação de visto Schengen",
      icone: FileSignature,
      cor: "from-violet-500 to-purple-500",
      documentos: [
        "Dados de identificação",
        "Período da estada",
        "Local de hospedagem",
      ],
    },
    {
      id: "plano_turistico" as TipoMinuta,
      titulo: "Plano Turístico",
      descricao: "Detalhamento do roteiro turístico durante a estada",
      icone: MapPin,
      cor: "from-purple-500 to-pink-500",
      documentos: [
        "Roteiro turístico",
        "Locais a visitar",
        "Atividades planeadas",
      ],
    },
    {
      id: "minuta2_schengen" as TipoMinuta,
      titulo: "Carta de Intenção",
      descricao: "Carta de intenção para solicitação de visto Schengen",
      icone: FileText,
      cor: "from-emerald-500 to-teal-500",
      documentos: [
        "Declaração de motivação",
        "Comprovante de hospedagem",
        "Extratos bancários",
      ],
    },
    ] : []),
    {
      id: "solicitar_agendamento" as TipoMinuta,
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
    ...(!isSchengen ? [{
      id: "solicitar_matricula" as TipoMinuta,
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
    }] : []),
    ...(!isSchengen ? [{
      id: "formulario" as TipoMinuta,
      titulo: "Formulário",
      descricao: "Formulário padrão para preenchimento de dados do processo",
      icone: ClipboardList,
      cor: "from-emerald-500 to-teal-500",
      documentos: [
        "Dados cadastrais",
        "Informações do curso",
        "Dados do financiamento",
      ],
    }] : []),
    // Formulário Schengen - substitui o Formulário nacional quando for visto Schengen
    ...(isSchengen ? [{
      id: "formulario_schengen" as TipoMinuta,
      titulo: "Formulário Schengen",
      descricao: "Formulário oficial de pedido de visto Schengen (uniforme)",
      icone: ClipboardList,
      cor: "from-emerald-500 to-teal-500",
      documentos: [
        "Dados de identificação",
        "Documento de viagem",
        "Objetivo da viagem",
        "Meios de subsistência",
      ],
    }] : []),
    {
      id: "termo_responsabilidade" as TipoMinuta,
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
      id: "minuta1" as TipoMinuta,
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
      id: "minuta2" as TipoMinuta,
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
    {
      id: "outros_documentos_importantes" as TipoMinuta,
      titulo: "Outros Documentos Importantes",
      descricao: "Checklist de documentos complementares para o processo",
      icone: FolderOpen,
      cor: "from-teal-500 to-emerald-500",
      documentos: [
        "Extrato bancário do financiador",
        "Declaração de serviço / Declaração autónoma",
        "Recibo salarial do financiador",
      ],
    },
  ];

  return cards as Minuta[];
}

export default function DocumentosContent({
  data,
  setData,
  onBack,
  hideBackButton = false,
}: DocumentosContentProps) {
  const [selectedMinuta, setSelectedMinuta] = useState<TipoMinuta | null>(
    data.minutaSelecionada || null
  )
  const [showMinutaModal, setShowMinutaModal] = useState(false)
  const [selectedMinutaId, setSelectedMinutaId] = useState<TipoMinuta | null>(null)
  const [showMinutaModal2, setShowMinutaModal2] = useState(false);
  const [showMatriculaPage, setShowMatriculaPage] = useState(false);
  const [showTermoResponsabilidadeModal, setShowTermoResponsabilidadeModal] = useState(false);
  const [showFormularioModal, setShowFormularioModal] = useState(false);
  const [showFormularioSchengenModal, setShowFormularioSchengenModal] = useState(false);
  const [showAgendamentoModal, setShowAgendamentoModal] = useState(false);
  const [showAgendamentoExistenteModal, setShowAgendamentoExistenteModal] = useState(false);
  const [showPrintVooModal, setShowPrintVooModal] = useState(false);
  const [showReservaHotelModal, setShowReservaHotelModal] = useState(false);
  const [showReconhecimentoConsuladoModal, setShowReconhecimentoConsuladoModal] = useState(false);
  const [isModalOpenSelectedCurso, setIsModalOpenSelectedCurso] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null)
  const [showPlanoTuristicoModal, setShowPlanoTuristicoModal] = useState(false)
  const [showMinuta1SchengenModal, setShowMinuta1SchengenModal] = useState(false)
  const [showMinuta2SchengenModal, setShowMinuta2SchengenModal] = useState(false)
  const [showSeguroViagemModal, setShowSeguroViagemModal] = useState(false)
  const [showReconhecimentoRegistoCriminalModal, setShowReconhecimentoRegistoCriminalModal] = useState(false)
  const [showOutrosDocumentosImportantesModal, setShowOutrosDocumentosImportantesModal] = useState(false)

  const { user } = useAuthStore();

  const isInitialized = useRef(false);
  const isCreating = useRef(false);

  const saveProcessoProgress = useSaveProcessoProgress();
  const isSchengen = data.tipoVisto === "schengen"
  const { data: solicitacaoMatricula } = useGetSolicitacaoMatriculaByClienteId(String(data.cliente?.id));
  const { data: solicitacaoAgendamento, refetch: refetchAgendamento } = useGetSolicitacaoAgendamentoByClienteId(String(data.cliente?.id));
  const { data: solicitacaoPrintVoo, refetch: refetchPrintVoo } = useGetSolicitacaoPrintVooByClienteId(String(data.cliente?.id));
  const { data: solicitacaoReservaHotel } = useGetSolicitacaoReservaHotelByClienteId(String(data.cliente?.id));
  const { data: solicitacaoSeguroViagem, refetch: refetchSeguroViagem } = useGetSolicitacaoSeguroViagemByClienteId(String(data.cliente?.id));
  const { data: solicitacaoReconhecimentoRegistoCriminal } = useGetSolicitacaoReconhecimentoRegistoCriminalByClienteId(String(data.cliente?.id));

  const { data: reconhecimentoConsulado } = useGetReconhecimentoConsuladoByClienteId(String(data.cliente?.id));
  const { data: documentoProfundoStatus, refetch: refetchStatus } = useGetDocumentoProfundoStatusByClienteId(String(data.cliente?.id));
  const { data: reconhecimentoNotarioData } = useGetSolicitacaoReconhecimentoNotarioByClienteId(String(data.cliente?.id))
  const { data: processoProgress } = useGetProcessoProgressByClienteId(data.cliente?.id ?? 0);

  const financiadorIdValue = data.financiador_id ?? processoProgress?.financiador_id;

  const { data: financiadorData } = useQuery({
    queryKey: ["financiador", financiadorIdValue],
    queryFn: () => getFinanciadorById(Number(financiadorIdValue)),
    enabled: !!financiadorIdValue,
  });

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
  const { data: motivoRejeicaoSeguroViagem } = useGetMotivoRejeicaoSeguroViagem(
    solicitacaoSeguroViagem?.status === 'rejeitado' ? String(solicitacaoSeguroViagem.id) : ''
  );
  const { data: motivoRejeicaoReconhecimento } = useGetMotivoRejeicaoReconhecimentoConsulado(
    reconhecimentoConsulado?.status === 'rejeitado' ? String(reconhecimentoConsulado.id) : ''
  );
  const createStatusMutation = useCreateDocumentoProfundoStatus();
  const updateStatusMutation = useUpdateDocumentoProfundoStatus();

  useEffect(() => {
    if (!data.cliente?.id) return;

    if (isInitialized.current) {
      return;
    }

    if (isCreating.current) {
      return;
    }

    const initializeStatus = async () => {
      try {
        const { data: freshStatus } = await refetchStatus();

        if (freshStatus) {
          isInitialized.current = true;
          return;
        }

        isCreating.current = true;

        createStatusMutation.mutate({
          cliente_id: data.cliente?.id,
          status_solicitacao_matricula: "nao_enviado",
          status_solicitacao_agendamento: "nao_enviado",
          status_solicitacao_print_voo: "nao_enviado",
          status_solicitacao_reserva_hotel: "nao_enviado",
          status_solicitacao_seguro_viagem: "nao_enviado",
          status_solicitacao_reconhecimento_registo_criminal: "nao_enviado",
          status_outros_documentos_importantes: "nao_enviado",
          status_reconhecimento_termo_consulado: "nao_enviado",
          status_formulario: false,
          status_formulario_schengen: false,
          status_termo_responsabilidade: false,
          status_minuta1: false,
          status_minuta1_schengen: false,
          status_minuta2: false,
          checklist_extrato_bancario: false,
          checklist_declaracao: false,
          checklist_recibo_salarial: false,
          status_geral: "em_andamento",
        }, {
          onSuccess: () => {
            toast.success('Status inicializado com sucesso!');
            isInitialized.current = true;
            isCreating.current = false;
            refetchStatus();
          },
          onError: (error) => {
            console.error('Erro ao criar status:', error);
            toast.error('Erro ao inicializar status');
            isCreating.current = false;
          },
        });

      } catch (error) {
        console.error('Erro ao verificar status:', error);
        isCreating.current = false;
      }
    };

    const timer = setTimeout(() => {
      initializeStatus();
    }, 100);

    return () => clearTimeout(timer);
  }, [data.cliente?.id]);

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

      case 'seguro_viagem':
        return status.status_solicitacao_seguro_viagem === 'pendente' ||
               status.status_solicitacao_seguro_viagem === 'aprovado' ||
               status.status_solicitacao_seguro_viagem === 'rejeitado';

      case 'reconhecimento_registo_criminal':
        return status.status_solicitacao_reconhecimento_registo_criminal === 'pendente' ||
               status.status_solicitacao_reconhecimento_registo_criminal === 'aprovado';

      case 'outros_documentos_importantes':
        return false;

      case 'formulario':
      case 'formulario_schengen':
      case 'termo_responsabilidade':
      case 'minuta1':
      case 'minuta2':
      case 'minuta1_schengen':
      case 'minuta2_schengen':
        return false;

      case 'plano_turistico':
        return status.status_plano_turistico === true;

      default:
        return false;
    }
  };

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

      case 'seguro_viagem':
        return status.status_solicitacao_seguro_viagem;

      case 'reconhecimento_registo_criminal':
        return status.status_solicitacao_reconhecimento_registo_criminal;

      case 'outros_documentos_importantes':
        return status.status_outros_documentos_importantes;

      case 'formulario':
        return status.status_formulario ? 'concluido' : 'nao_enviado';

      case 'formulario_schengen':
        return status.status_formulario_schengen ? 'concluido' : 'nao_enviado';

      case 'termo_responsabilidade':
        return status.status_termo_responsabilidade ? 'concluido' : 'nao_enviado';

      case 'minuta1':
        return status.status_minuta1 ? 'concluido' : 'nao_enviado';

      case 'minuta2':
        return status.status_minuta2 ? 'concluido' : 'nao_enviado';

      case 'minuta1_schengen':
        return status.status_minuta1_schengen ? 'concluido' : 'nao_enviado';

      case 'minuta2_schengen':
        return status.status_minuta2_schengen ? 'concluido' : 'nao_enviado';

      case 'plano_turistico':
        return status.status_plano_turistico ? 'concluido' : 'nao_enviado';

      default:
        return null;
    }
  };

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

  const getActionButtonText = (minutaId: TipoMinuta): string => {
    switch (minutaId) {
      case 'minuta1': return 'Criar Minuta 1';
      case 'minuta1_schengen': return 'Criar Declaração de Estada Prevista';
      case 'minuta2': return 'Criar Minuta 2';
      case 'minuta2_schengen': return 'Criar Carta de Intenção';
      case 'formulario': return 'Criar Formulário';
      case 'formulario_schengen': return 'Emitir Formulário Schengen';
      case 'termo_responsabilidade': return 'Emitir Termo';
      case 'solicitar_matricula': return 'Solicitar Matrícula';
      case 'solicitar_agendamento': return 'Solicitar Agendamento';
      case 'print_voo': return 'Adicionar Voo';
      case 'reserva_hotel': return 'Adicionar Hotel';
      case 'plano_turistico': return 'Criar Plano Turístico';
      case 'seguro_viagem': return 'Solicitar Seguro de Viagem';
      case 'reconhecimento_registo_criminal': return 'Solicitar Reconhecimento';
      case 'outros_documentos_importantes': return 'Ver Checklist';
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
    if (isCardDisabled(minutaId, documentoProfundoStatus!!)) {
      toast.warning('Este documento já foi concluído!');
      return;
    }

    if (!isSchengen) {
      if (minutaId === "minuta1" || minutaId === "minuta2" || minutaId === "formulario" || minutaId === "print_voo" || minutaId === "reserva_hotel") {
        if (solicitacaoMatricula?.status !== 'aprovado') {
          alert.warning(
            'Solicitação de Matrícula Necessária',
            'É preciso primeiro fazer a solicitação de matrícula e ser aprovada.'
          );
          return;
        }
      }
    }

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
    } else if (minutaId === "formulario_schengen") {
      setShowFormularioSchengenModal(true)
    } else if (minutaId === "print_voo") {
      setShowPrintVooModal(true)
    } else if (minutaId === "reserva_hotel") {
      setShowReservaHotelModal(true)
    } else if (minutaId === "plano_turistico") {
      setShowPlanoTuristicoModal(true)
    } else if (minutaId === "minuta1_schengen") {
      setShowMinuta1SchengenModal(true)
    } else if (minutaId === "minuta2_schengen") {
      setShowMinuta2SchengenModal(true)
    } else if (minutaId === "seguro_viagem") {
      setShowSeguroViagemModal(true)
    } else if (minutaId === "reconhecimento_registo_criminal") {
      setShowReconhecimentoRegistoCriminalModal(true)
    } else if (minutaId === "outros_documentos_importantes") {
      setShowOutrosDocumentosImportantesModal(true)
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
    } else if (minutaId === 'formulario_schengen') {
      if (!data.cliente?.id) return

      try {
        const response = await api.post('formulario-schengen/gerar-pdf', {
          ...data,
          cliente: null,
          cliente_id: data.cliente.id,
        }, {
          responseType: 'blob'
        })

        const blob = new Blob([response.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `formulario_schengen_${data.cliente.nome}.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)

        toast.success('Formulário Schengen baixado novamente!')
      } catch (error) {
        console.error('Erro ao baixar formulário Schengen:', error)
        toast.error('Erro ao baixar formulário Schengen')
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
        toast.error('Documento não disponível.')
        return
      }
      const a = document.createElement('a')
      a.href = solicitacaoPrintVoo.comprovativo_url
      a.download = solicitacaoPrintVoo.comprovativo_nome || 'documento_voo.pdf'
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      a.remove()
      toast.success('Documento baixado com sucesso!')
    } else if (minutaId === 'reserva_hotel') {
      if (!solicitacaoReservaHotel?.comprovativo_url) {
        toast.error('Documento não disponível.')
        return
      }
      const a = document.createElement('a')
      a.href = solicitacaoReservaHotel.comprovativo_url
      a.download = solicitacaoReservaHotel.comprovativo_nome || 'documento_hotel.pdf'
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      a.remove()
      toast.success('Documento baixado com sucesso!')
    } else if (minutaId === 'outros_documentos_importantes') {
      if (reconhecimentoNotarioData?.declaracao_autonoma_url) {
        window.open(reconhecimentoNotarioData.declaracao_autonoma_url, '_blank')
        toast.success('Declaração Autónoma baixada com sucesso!')
      } else if (documentoProfundoStatus?.declaracao_servico_url) {
        window.open(documentoProfundoStatus.declaracao_servico_url, '_blank')
        toast.success('Declaração de Serviço baixada com sucesso!')
      } else {
        toast.info('Nenhum documento para download.')
      }
    } else if (minutaId === 'reconhecimento_registo_criminal') {
      if (!solicitacaoReconhecimentoRegistoCriminal?.comprovativo_url) {
        toast.error('Comprovativo não disponível.')
        return
      }
      const a = document.createElement('a')
      a.href = solicitacaoReconhecimentoRegistoCriminal.comprovativo_url
      a.download = solicitacaoReconhecimentoRegistoCriminal.comprovativo_nome || 'comprovativo_reconhecimento_registo_criminal.pdf'
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      a.remove()
      toast.success('Comprovativo baixado com sucesso!')
    } else if (minutaId === 'seguro_viagem') {
      if (!solicitacaoSeguroViagem?.comprovativo_url) {
        toast.error('Documento de seguro não disponível.')
        return
      }
      const a = document.createElement('a')
      a.href = solicitacaoSeguroViagem.comprovativo_url
      a.download = solicitacaoSeguroViagem.comprovativo_nome || 'documento_seguro_viagem.pdf'
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      a.remove()
      toast.success('Documento baixado com sucesso!')
    } else if (minutaId === 'plano_turistico') {
      setShowPlanoTuristicoModal(true)
    } else if (minutaId === 'minuta1_schengen') {
      setShowMinuta1SchengenModal(true)
    } else if (minutaId === 'minuta2_schengen') {
      setShowMinuta2SchengenModal(true)
    }
  }

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
      case 'seguro_viagem':
        updatedStatus.status_solicitacao_seguro_viagem = 'pendente';
        break;
      case 'reconhecimento_registo_criminal':
        updatedStatus.status_solicitacao_reconhecimento_registo_criminal = 'pendente';
        break;
      case 'outros_documentos_importantes':
        updatedStatus.status_outros_documentos_importantes = 'pendente';
        break;
      case 'formulario':
        updatedStatus.status_formulario = true;
        break;
      case 'formulario_schengen':
        updatedStatus.status_formulario_schengen = true;
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
      case 'minuta1_schengen':
        updatedStatus.status_minuta1_schengen = true;
        break;
      case 'minuta2':
        updatedStatus.status_minuta2 = true;
        break;
      case 'minuta2_schengen':
        updatedStatus.status_minuta2_schengen = true;
        break;
      case 'plano_turistico':
        updatedStatus.status_plano_turistico = true;
        break;
    }

    if (
      updatedStatus.status_solicitacao_matricula === 'pendente' &&
      updatedStatus.status_solicitacao_agendamento === 'pendente' &&
      updatedStatus.status_solicitacao_print_voo === 'pendente' &&
      updatedStatus.status_solicitacao_reserva_hotel === 'pendente' &&
      updatedStatus.status_solicitacao_seguro_viagem === 'pendente' &&
      updatedStatus.status_solicitacao_reconhecimento_registo_criminal === 'pendente' &&
      updatedStatus.status_outros_documentos_importantes === 'pendente' &&
      updatedStatus.status_formulario === true &&
      updatedStatus.status_formulario_schengen === true &&
      updatedStatus.status_termo_responsabilidade === true &&
      updatedStatus.status_minuta1 === true &&
      updatedStatus.status_minuta1_schengen === true &&
      updatedStatus.status_minuta2 === true
    ) {
      updatedStatus.status_geral = 'concluido';
    }

    await updateStatusMutation.mutateAsync({
      clienteId: String(data.cliente.id),
      newSolicitacao: updatedStatus
    });
  };

  const handleChecklistChange = async (key: 'checklist_extrato_bancario' | 'checklist_declaracao' | 'checklist_recibo_salarial', value: boolean) => {
    if (!documentoProfundoStatus || !data.cliente?.id) return;

    const updatedStatus = { ...documentoProfundoStatus, [key]: value };

    const checkedCount = [
      updatedStatus.checklist_extrato_bancario,
      updatedStatus.checklist_declaracao,
      updatedStatus.checklist_recibo_salarial,
    ].filter(Boolean).length;

    if (checkedCount === 0) {
      updatedStatus.status_outros_documentos_importantes = 'nao_enviado';
    } else if (checkedCount === 3) {
      updatedStatus.status_outros_documentos_importantes = 'aprovado';
    } else {
      updatedStatus.status_outros_documentos_importantes = 'pendente';
    }

    await updateStatusMutation.mutateAsync({
      clienteId: String(data.cliente.id),
      newSolicitacao: updatedStatus
    });

    refetchStatus();
  };

  useEffect(() => {
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
        data_prevista_chegada: data.dataPrevisaoChegada || '',
        data_prevista_saida: data.dataPrevisaoSaida || '',
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
      {!hideBackButton && (
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar para Processos
          </Button>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Análise de documentos profundos
            </h2>
            <p className="text-muted-foreground mt-1">
              Escolha o documento necessário para seu processo
            </p>
          </div>

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
                  <span className="text-sm text-foreground/80">Financiador: {data.financiador_nome}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
           {minutas(solicitacaoMatricula, isSchengen).map((minuta, index) => {
              const Icon = minuta.icone
              const isSelected = selectedMinuta === minuta.id

              const statusSolicitacao = minuta.status;

              const currentStatus = getDocumentStatus(minuta.id, documentoProfundoStatus);
              const disabled = isCardDisabled(minuta.id, documentoProfundoStatus);

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
                      hasStatus && currentStatus && getStatusColor(currentStatus).split(' ')[2]
                    )}
                  >
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

                          {minuta.id === 'print_voo' && solicitacaoPrintVoo?.data_ida && (
                            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Ida: {new Date(solicitacaoPrintVoo.data_ida).toLocaleDateString('pt-PT')}</span>
                              <span>Volta: {new Date(solicitacaoPrintVoo.data_volta).toLocaleDateString('pt-PT')}</span>
                            </div>
                          )}
                          {minuta.id === 'seguro_viagem' && solicitacaoSeguroViagem?.data_ida && (
                            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Ida: {new Date(solicitacaoSeguroViagem.data_ida).toLocaleDateString('pt-PT')}</span>
                              <span>Volta: {new Date(solicitacaoSeguroViagem.data_volta).toLocaleDateString('pt-PT')}</span>
                            </div>
                          )}
                          {minuta.id === 'solicitar_agendamento' && (
                            <>
                              {solicitacaoAgendamento?.data_agendamento && (
                                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>Data do agendamento: {new Date(solicitacaoAgendamento.data_agendamento).toLocaleDateString('pt-PT')}</span>
                                </div>
                              )}
                              {!solicitacaoAgendamento?.data_agendamento && solicitacaoAgendamento?.created_at && (
                                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>Solicitado em: {new Date(solicitacaoAgendamento.created_at).toLocaleDateString('pt-PT')}</span>
                                </div>
                              )}
                            </>
                          )}
                          {minuta.id === 'termo_responsabilidade' && (
                            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                              {data.financiador_nome && (
                                <span>Financiador: {data.financiador_nome}</span>
                              )}
                              {financiadorData?.numero_documento && (
                                <span>Documento: {financiadorData.tipo_documento === 'bi' ? 'BI' : 'Passaporte'} {financiadorData.numero_documento}</span>
                              )}
                            </div>
                          )}
                          {minuta.id === 'outros_documentos_importantes' && (
                            <div className="mt-2 flex flex-row flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                              <span className={documentoProfundoStatus?.checklist_extrato_bancario ? 'text-green-600' : 'text-red-400'}>
                                {documentoProfundoStatus?.checklist_extrato_bancario ? '✓' : '✗'} Extrato bancário
                              </span>
                              <span className={documentoProfundoStatus?.checklist_declaracao ? 'text-green-600' : 'text-red-400'}>
                                {documentoProfundoStatus?.checklist_declaracao ? '✓' : '✗'} {financiadorData?.tipo_trabalho === 'por_conta_propria' ? 'Decl. Autónoma' : 'Decl. Serviço'}
                              </span>
                              <span className={documentoProfundoStatus?.checklist_recibo_salarial ? 'text-green-600' : 'text-red-400'}>
                                {documentoProfundoStatus?.checklist_recibo_salarial ? '✓' : '✗'} Recibo salarial
                              </span>
                            </div>
                          )}

                          <div className="mt-3 flex flex-col md:flex-row gap-2">
                            {!disabled && (
                              <>
                                <Button
                                  type="button"
                                  variant={minuta.id === 'termo_responsabilidade' && currentStatus === 'nao_enviado' ? 'destructive' : 'secondary'}
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleSelect(minuta.id)
                                  }}
                                  className={cn(
                                    "gap-1",
                                    minuta.id === 'termo_responsabilidade' && currentStatus === 'nao_enviado' &&
                                      "animate-pulse shadow-lg shadow-red-500/50 ring-2 ring-red-500"
                                  )}
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

                            {((currentStatus === 'concluido' && ['minuta1', 'minuta1_schengen', 'minuta2', 'formulario', 'termo_responsabilidade', 'plano_turistico'].includes(minuta.id)) || (
                              minuta.id === 'solicitar_matricula' && currentStatus === 'aprovado' && solicitacaoMatricula?.declaracao_url
                            ) || (
                              minuta.id === 'solicitar_agendamento' && currentStatus === 'aprovado' && solicitacaoAgendamento?.agendamento_url
                            ) || (
                              minuta.id === 'print_voo' && currentStatus === 'aprovado' && solicitacaoPrintVoo?.comprovativo_url
                            ) || (
                              minuta.id === 'reserva_hotel' && currentStatus === 'aprovado' && solicitacaoReservaHotel?.comprovativo_url
                            ) || (
                              minuta.id === 'seguro_viagem' && currentStatus === 'aprovado' && solicitacaoSeguroViagem?.comprovativo_url
                            ) || (
                              minuta.id === 'outros_documentos_importantes' && (reconhecimentoNotarioData?.declaracao_autonoma_url || documentoProfundoStatus?.declaracao_servico_url)
                            )                           ) && (
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
                                {minuta.id === 'solicitar_matricula' ? 'Baixar Declaração' : minuta.id === 'solicitar_agendamento' ? 'Baixar Agendamento' : minuta.id === 'print_voo' ? 'Baixar Documento' : minuta.id === 'reserva_hotel' ? 'Baixar Documento' : minuta.id === 'seguro_viagem' ? 'Baixar Documento' : minuta.id === 'reconhecimento_registo_criminal' ? 'Baixar Comprovativo' : minuta.id === 'plano_turistico' ? 'Baixar Plano Turístico' : minuta.id === 'outros_documentos_importantes' ? 'Baixar Declaração' : 'Download'}
                              </Button>
                            )}

{minuta.id === 'termo_responsabilidade' && (
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

                          {minuta.id === 'seguro_viagem' && currentStatus === 'rejeitado' && motivoRejeicaoSeguroViagem?.motivo_rejeicao && (
                            <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg">
                              <p className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                Motivo da rejeição:
                              </p>
                              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                {motivoRejeicaoSeguroViagem.motivo_rejeicao}
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

      <ModalEmitirFormularioSchengen
        open={showFormularioSchengenModal}
        onOpenChange={setShowFormularioSchengenModal}
        data={data}
        cliente={data.cliente}
        onSuccess={(pdfUrl) => {
          setData((prev) => ({
            ...prev,
            formularioSchengenPdfUrl: pdfUrl,
          }))
          updateDocumentStatus('formulario_schengen')
          refetchStatus()
        }}
      />

      <ModalSolicitarAgendamento
        open={showAgendamentoModal}
        onOpenChange={setShowAgendamentoModal}
        cliente={data.cliente}
        tipoVisto={data.tipoVisto ?? undefined}
        onSuccess={async () => {
          await updateDocumentStatus('solicitar_agendamento');
          refetchStatus();
          refetchAgendamento();
        }}
      />

      <ModalAgendamentoExistente
        open={showAgendamentoExistenteModal}
        onOpenChange={setShowAgendamentoExistenteModal}
        cliente={data.cliente}
        onSuccess={async () => {
          await updateDocumentStatus('solicitar_agendamento');
          refetchStatus();
          refetchAgendamento();
        }}
      />

      <ModalSolicitarPrintVoo
        open={showPrintVooModal}
        onOpenChange={setShowPrintVooModal}
        cliente={data.cliente}
        dataPrevistaChegada={solicitacaoMatricula?.data_prevista_chegada || data.dataPrevisaoChegada}
        dataPrevistaSaida={solicitacaoMatricula?.data_prevista_saida || data.dataPrevisaoSaida}
        onSuccess={async () => {
          await updateDocumentStatus('print_voo');
          refetchStatus();
          refetchPrintVoo();
        }}
      />

      <ModalSolicitarReservaHotel
        open={showReservaHotelModal}
        onOpenChange={setShowReservaHotelModal}
        cliente={data.cliente}
        dataPrevistaChegada={solicitacaoMatricula?.data_prevista_chegada || data.dataPrevisaoChegada}
        dataPrevistaSaida={solicitacaoMatricula?.data_prevista_saida || data.dataPrevisaoSaida}
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

      <ModalSolicitarReconhecimentoRegistoCriminal
        open={showReconhecimentoRegistoCriminalModal}
        onOpenChange={setShowReconhecimentoRegistoCriminalModal}
        cliente={data.cliente}
        onSuccess={async () => {
          await updateDocumentStatus('reconhecimento_registo_criminal');
          refetchStatus();
        }}
      />

      <ModalOutrosDocumentosImportantes
        open={showOutrosDocumentosImportantesModal}
        onOpenChange={setShowOutrosDocumentosImportantesModal}
        cliente={data.cliente}
        financiadorId={data.financiador_id}
        checklistExtrato={documentoProfundoStatus?.checklist_extrato_bancario ?? false}
        checklistDeclaracao={documentoProfundoStatus?.checklist_declaracao ?? false}
        checklistRecibo={documentoProfundoStatus?.checklist_recibo_salarial ?? false}
        declaracaoServicoUrl={documentoProfundoStatus?.declaracao_servico_url}
        declaracaoServicoNome={documentoProfundoStatus?.declaracao_servico_nome}
        onChecklistChange={handleChecklistChange}
        onSuccess={async () => {
          refetchStatus();
        }}
      />

      <ModalSolicitarSeguroViagem
        open={showSeguroViagemModal}
        onOpenChange={setShowSeguroViagemModal}
        cliente={data.cliente}
        dataPrevistaChegada={solicitacaoMatricula?.data_prevista_chegada || data.dataPrevisaoChegada}
        dataPrevistaSaida={solicitacaoMatricula?.data_prevista_saida || data.dataPrevisaoSaida}
        onSuccess={async () => {
          await updateDocumentStatus('seguro_viagem');
          refetchStatus();
          refetchSeguroViagem();
        }}
      />

      <ModalPlanoTuristico
        open={showPlanoTuristicoModal}
        onOpenChange={setShowPlanoTuristicoModal}
        cliente={data.cliente}
        dataPrevistaChegada={solicitacaoMatricula?.data_prevista_chegada || data.dataPrevisaoChegada}
        dataPrevistaSaida={solicitacaoMatricula?.data_prevista_saida || data.dataPrevisaoSaida}
        onSuccess={async () => {
          await updateDocumentStatus('plano_turistico');
          refetchStatus()
        }}
      />

      <ModalPreencherMinuta1Schengen
        open={showMinuta1SchengenModal}
        onOpenChange={setShowMinuta1SchengenModal}
        cliente={data.cliente}
        subtipo={data.subtipo as any}
        subtipoOutroDescricao={data.subtipoOutroDescricao}
        onSuccess={async () => {
          await updateDocumentStatus('minuta1_schengen');
          refetchStatus()
        }}
      />

      <ModalPreencherMinuta2Schengen
        open={showMinuta2SchengenModal}
        onOpenChange={setShowMinuta2SchengenModal}
        cliente={data.cliente}
        subtipo={data.subtipo as any}
        subtipoOutroDescricao={data.subtipoOutroDescricao}
        onSuccess={async () => {
          await updateDocumentStatus('minuta2_schengen');
          refetchStatus()
        }}
      />
    </>
  )
}




