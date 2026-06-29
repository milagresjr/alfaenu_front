'use client'

import { useState, useMemo } from "react"
import { CalendarDays, Search, CheckCircle, XCircle, Clock, AlertCircle, FileText, Upload } from "lucide-react"
import { useDebounce } from "@uidotdev/usehooks"
import { toast } from "react-toastify"
import { TableMain } from "@/components/table"
import { Input } from "@/components/ui/input"
import { StatCard } from "@/components/StatCard/stat-card"
import { DropdownActions } from "@/components/dropdown-action-menu/drop-actions-menu"
import { formatarDataLong } from "@/lib/helpers"
import { Badge } from "@/components/ui/badge"
import {
  useGetAllSolicitacoesAgendamento,
  useAprovarSolicitacaoAgendamento,
  useRejeitarSolicitacaoAgendamento,
  useEnviarAgendamento,
} from "@/features/solicitacao-agendamento/hooks/useAdminSoliAgendamentoQuery"
import { SolicitacaoAgendamentoType, SolicitacaoAgendamentoStatus } from "@/features/solicitacao-agendamento/types"
import { AprovarAgendamentoDialog } from "./AprovarAgendamentoDialog"
import { RejeitarAgendamentoDialog } from "./RejeitarAgendamentoDialog"
import { EnviarAgendamentoForm } from "./EnviarAgendamentoForm"
import { VerMotivoRejeicaoDialog } from "./VerMotivoRejeicaoDialog"
import { VerComprovativoDialog } from "./VerComprovativoDialog"

type FilterType = 'todos' | SolicitacaoAgendamentoStatus

const statusConfig: Record<SolicitacaoAgendamentoStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pendente: {
    label: 'Pendente',
    color: 'text-yellow-600 bg-yellow-100 border-yellow-500',
    icon: <Clock className="h-3 w-3" />,
  },
  aprovado: {
    label: 'Aprovado',
    color: 'text-green-600 bg-green-100 border-green-500',
    icon: <CheckCircle className="h-3 w-3" />,
  },
  rejeitado: {
    label: 'Rejeitado',
    color: 'text-red-600 bg-red-100 border-red-500',
    icon: <XCircle className="h-3 w-3" />,
  },
}

export default function SoliAgendamentoTable() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('todos')

  const debouncedSearch = useDebounce(search, 500)

  const { data, isLoading, refetch } = useGetAllSolicitacoesAgendamento({
    search: debouncedSearch || undefined,
    status: filter !== 'todos' ? filter : undefined,
  })

  const aprovarMutation = useAprovarSolicitacaoAgendamento()
  const rejeitarMutation = useRejeitarSolicitacaoAgendamento()
  const enviarAgendamentoMutation = useEnviarAgendamento()

  const [selectedSolicitacao, setSelectedSolicitacao] = useState<SolicitacaoAgendamentoType | null>(null)
  const [openAprovar, setOpenAprovar] = useState(false)
  const [openRejeitar, setOpenRejeitar] = useState(false)
  const [openEnviar, setOpenEnviar] = useState(false)
  const [openMotivo, setOpenMotivo] = useState(false)
  const [openComprovativo, setOpenComprovativo] = useState(false)

  const stats = useMemo(() => [
    {
      key: 'todos' as const,
      title: 'Total de Solicitações',
      value: data?.total?.toString() || '0',
      change: '',
      icon: <CalendarDays className="w-6 h-6 text-blue-600" />,
    },
    {
      key: 'pendente' as const,
      title: 'Pendentes',
      value: data?.total_pendentes?.toString() || '0',
      change: '',
      icon: <Clock className="w-6 h-6 text-yellow-600" />,
    },
    {
      key: 'aprovado' as const,
      title: 'Aprovados',
      value: data?.total_aprovados?.toString() || '0',
      change: '',
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    },
    {
      key: 'rejeitado' as const,
      title: 'Rejeitados',
      value: data?.total_rejeitados?.toString() || '0',
      change: '',
      icon: <XCircle className="w-6 h-6 text-red-600" />,
    },
  ], [data])

  const handleAprovar = () => {
    if (!selectedSolicitacao) return
    aprovarMutation.mutate(selectedSolicitacao.id, {
      onSuccess: () => {
        toast.success('Solicitação aprovada com sucesso!')
        setOpenAprovar(false)
        setOpenEnviar(true)
        refetch()
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Erro ao aprovar solicitação')
      },
    })
  }

  const handleRejeitar = (motivo: string) => {
    if (!selectedSolicitacao) return
    rejeitarMutation.mutate(
      { id: selectedSolicitacao.id, motivo },
      {
        onSuccess: () => {
          toast.success('Solicitação rejeitada com sucesso!')
          setOpenRejeitar(false)
          setSelectedSolicitacao(null)
          refetch()
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao rejeitar solicitação')
        },
      }
    )
  }

  const handleEnviarAgendamento = (formData: FormData) => {
    if (!selectedSolicitacao) return
    enviarAgendamentoMutation.mutate(
      { id: selectedSolicitacao.id, formData },
      {
        onSuccess: () => {
          toast.success('Agendamento enviado com sucesso!')
          setOpenEnviar(false)
          setSelectedSolicitacao(null)
          refetch()
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao enviar agendamento')
        },
      }
    )
  }

  const handleDownloadAgendamento = (solicitacao: SolicitacaoAgendamentoType) => {
    if (!solicitacao.agendamento_url) {
      toast.error('URL do agendamento não disponível.')
      return
    }
    const a = document.createElement('a')
    a.href = solicitacao.agendamento_url
    a.download = solicitacao.agendamento_nome || 'agendamento.pdf'
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    a.remove()
    toast.success('Agendamento baixado com sucesso!')
  }

  const solicitacoes = data?.data || []

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 min-h-[calc(100vh-130px)]">
      <div className="flex justify-start items-center my-4">
        <h1 className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
          Solicitações de Agendamento
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.key}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            isActive={filter === stat.key}
            onClick={() => setFilter(stat.key)}
          />
        ))}
      </div>

      <div className="my-4 flex items-center justify-between gap-2">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar por cliente ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <TableMain
        data={solicitacoes}
        isLoading={isLoading}
        emptyMessage="Nenhuma solicitação de agendamento encontrada."
        columns={[
          {
            header: "Cliente",
            accessor: (solicitacao: SolicitacaoAgendamentoType) => (
              <span>{solicitacao.cliente?.nome || '-'}</span>
            ),
            width: "20%",
          },
          {
            header: "Telefone",
            accessor: "telefone",
            width: "15%",
          },
          {
            header: "Status",
            accessor: (solicitacao: SolicitacaoAgendamentoType) => {
              const cfg = statusConfig[solicitacao.status]
              return (
                <Badge variant="outline" className={`gap-1 ${cfg.color}`}>
                  {cfg.icon}
                  {cfg.label}
                </Badge>
              )
            },
            width: "12%",
          },
          {
            header: "Data",
            accessor: (solicitacao: SolicitacaoAgendamentoType) => (
              <span>{solicitacao.created_at ? formatarDataLong(solicitacao.created_at) : '-'}</span>
            ),
            width: "15%",
          },
          {
            header: "Agendamento",
            accessor: (solicitacao: SolicitacaoAgendamentoType) => {
              if (solicitacao.data_agendamento) {
                return (
                  <span className="text-sm">{formatarDataLong(solicitacao.data_agendamento)}</span>
                )
              }
              return <span className="text-sm text-muted-foreground">-</span>
            },
            width: "15%",
          },
          {
            header: "Ações",
            accessor: (solicitacao: SolicitacaoAgendamentoType) => {
              const actions = []

              if (solicitacao.comprovativo_url) {
                actions.push({
                  label: 'Ver Comprovativo',
                  icon: <FileText className="h-4 w-4" />,
                  onClick: () => {
                    setSelectedSolicitacao(solicitacao)
                    setOpenComprovativo(true)
                  },
                })
              }

              if (solicitacao.status === 'pendente') {
                actions.push({
                  label: 'Aprovar',
                  icon: <CheckCircle className="h-4 w-4 text-green-600" />,
                  onClick: () => {
                    setSelectedSolicitacao(solicitacao)
                    setOpenAprovar(true)
                  },
                })
                actions.push({
                  label: 'Rejeitar',
                  icon: <XCircle className="h-4 w-4 text-red-600" />,
                  onClick: () => {
                    setSelectedSolicitacao(solicitacao)
                    setOpenRejeitar(true)
                  },
                })
              }

              if (solicitacao.status === 'aprovado') {
                if (!solicitacao.data_agendamento) {
                  actions.push({
                    label: 'Enviar Agendamento',
                    icon: <Upload className="h-4 w-4" />,
                    onClick: () => {
                      setSelectedSolicitacao(solicitacao)
                      setOpenEnviar(true)
                    },
                  })
                } else {
                  actions.push({
                    label: 'Baixar PDF Agendamento',
                    icon: <FileText className="h-4 w-4" />,
                    onClick: () => handleDownloadAgendamento(solicitacao),
                  })
                }
              }

              if (solicitacao.status === 'rejeitado') {
                actions.push({
                  label: 'Ver Motivo',
                  icon: <AlertCircle className="h-4 w-4" />,
                  onClick: () => {
                    setSelectedSolicitacao(solicitacao)
                    setOpenMotivo(true)
                  },
                })
              }

              return <DropdownActions actions={actions} />
            },
            width: "23%",
          },
        ]}
      />

      {selectedSolicitacao && (
        <>
          <AprovarAgendamentoDialog
            open={openAprovar}
            onOpenChange={setOpenAprovar}
            onConfirm={handleAprovar}
            isLoading={aprovarMutation.isPending}
            clienteNome={selectedSolicitacao.cliente?.nome || '-'}
            telefone={selectedSolicitacao.telefone}
          />
          <RejeitarAgendamentoDialog
            open={openRejeitar}
            onOpenChange={setOpenRejeitar}
            onConfirm={handleRejeitar}
            isLoading={rejeitarMutation.isPending}
            clienteNome={selectedSolicitacao.cliente?.nome || '-'}
            telefone={selectedSolicitacao.telefone}
          />
          <EnviarAgendamentoForm
            open={openEnviar}
            onOpenChange={setOpenEnviar}
            onConfirm={handleEnviarAgendamento}
            isLoading={enviarAgendamentoMutation.isPending}
            clienteNome={selectedSolicitacao.cliente?.nome || '-'}
          />
          <VerMotivoRejeicaoDialog
            open={openMotivo}
            onOpenChange={setOpenMotivo}
            motivo={selectedSolicitacao.motivo_rejeicao || ''}
            clienteNome={selectedSolicitacao.cliente?.nome || '-'}
          />
          <VerComprovativoDialog
            open={openComprovativo}
            onOpenChange={setOpenComprovativo}
            comprovativoUrl={selectedSolicitacao.comprovativo_url}
            comprovativoNome={selectedSolicitacao.comprovativo_nome}
            clienteNome={selectedSolicitacao.cliente?.nome || '-'}
          />
        </>
      )}
    </div>
  )
}
