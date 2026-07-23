'use client'

import { useState, useMemo } from "react"
import { FileSignature, Search, CheckCircle, XCircle, Clock, AlertCircle, FileText, Info } from "lucide-react"
import { useDebounce } from "@uidotdev/usehooks"
import { toast } from "react-toastify"
import { AxiosError } from "axios"
import { TableMain } from "@/components/table"
import { Input } from "@/components/ui/input"
import { StatCard } from "@/components/StatCard/stat-card"
import { DropdownActions } from "@/components/dropdown-action-menu/drop-actions-menu"
import { formatarDataLong } from "@/lib/helpers"
import { Badge } from "@/components/ui/badge"
import {
  useGetAllReconhecimentosConsulado,
  useAprovarReconhecimentoConsulado,
  useRejeitarReconhecimentoConsulado,
} from "@/features/solicitacao-reconhecimento-consulado/hooks/useAdminReconhecimentoConsuladoQuery"
import { ReconhecimentoConsuladoType, ReconhecimentoConsuladoStatus } from "@/features/solicitacao-reconhecimento-consulado/types"
import { AprovarReconhecimentoConsuladoDialog } from "./AprovarReconhecimentoConsuladoDialog"
import { RejeitarReconhecimentoConsuladoDialog } from "./RejeitarReconhecimentoConsuladoDialog"
import { VerMotivoRejeicaoDialog } from "./VerMotivoRejeicaoDialog"
import { VerComprovativoDialog } from "./VerComprovativoDialog"
import { DetalhesReconhecimentoConsuladoDialog } from "./DetalhesReconhecimentoConsuladoDialog"

type FilterType = 'todos' | ReconhecimentoConsuladoStatus

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
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
  nao_enviado: {
    label: 'Não enviado',
    color: 'text-gray-600 bg-gray-100 border-gray-500',
    icon: <AlertCircle className="h-3 w-3" />,
  },
  enviado: {
    label: 'Enviado',
    color: 'text-blue-600 bg-blue-100 border-blue-500',
    icon: <FileText className="h-3 w-3" />,
  },
}

export default function SoliReconhecimentoConsuladoTable() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('todos')

  const debouncedSearch = useDebounce(search, 500)

  const { data, isLoading, refetch } = useGetAllReconhecimentosConsulado({
    search: debouncedSearch || undefined,
    status: filter !== 'todos' ? filter : undefined,
  })

  const aprovarMutation = useAprovarReconhecimentoConsulado()
  const rejeitarMutation = useRejeitarReconhecimentoConsulado()

  const [selectedSolicitacao, setSelectedSolicitacao] = useState<ReconhecimentoConsuladoType | null>(null)
  const [openAprovar, setOpenAprovar] = useState(false)
  const [openRejeitar, setOpenRejeitar] = useState(false)
  const [openMotivo, setOpenMotivo] = useState(false)
  const [openComprovativo, setOpenComprovativo] = useState(false)
  const [openDetalhes, setOpenDetalhes] = useState(false)

  const stats = useMemo(() => [
    {
      key: 'todos' as const,
      title: 'Total',
      value: data?.total?.toString() || '0',
      change: '',
      icon: <FileSignature className="w-6 h-6 text-blue-600" />,
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
    aprovarMutation.mutate(String(selectedSolicitacao.id), {
      onSuccess: () => {
        toast.success('Reconhecimento aprovado com sucesso!')
        setOpenAprovar(false)
        setSelectedSolicitacao(null)
        refetch()
      },
      onError: (error: Error) => {
        const err = error as unknown as AxiosError<{ message: string }>
        toast.error(err?.response?.data?.message || 'Erro ao aprovar reconhecimento')
      },
    })
  }

  const handleRejeitar = (motivo: string) => {
    if (!selectedSolicitacao) return
    rejeitarMutation.mutate(
      { id: String(selectedSolicitacao.id), motivo },
      {
        onSuccess: () => {
          toast.success('Reconhecimento rejeitado com sucesso!')
          setOpenRejeitar(false)
          setSelectedSolicitacao(null)
          refetch()
        },
        onError: (error: Error) => {
          const err = error as unknown as AxiosError<{ message: string }>
          toast.error(err?.response?.data?.message || 'Erro ao rejeitar reconhecimento')
        },
      }
    )
  }

  const solicitacoes = data?.data || []

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 min-h-[calc(100vh-130px)]">
      <div className="flex justify-start items-center my-4">
        <h1 className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
          Reconhecimento no Consulado
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
            placeholder="Buscar por cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <TableMain
        data={solicitacoes}
        isLoading={isLoading}
        emptyMessage="Nenhum reconhecimento encontrado."
        columns={[
          {
            header: "Cliente",
            accessor: (solicitacao: ReconhecimentoConsuladoType) => (
              <span>{solicitacao.cliente?.nome || '-'}</span>
            ),
            width: "18%",
          },
          {
            header: "Data Documento",
            accessor: (solicitacao: ReconhecimentoConsuladoType) => (
              <span>{solicitacao.data_documento ? formatarDataLong(solicitacao.data_documento) : '-'}</span>
            ),
            width: "15%",
          },
          {
            header: "Status",
            accessor: (solicitacao: ReconhecimentoConsuladoType) => {
              const cfg = statusConfig[solicitacao.status] || { label: solicitacao.status, color: 'text-gray-600 bg-gray-100 border-gray-500', icon: <AlertCircle className="h-3 w-3" /> }
              return (
                <Badge variant="outline" className={`gap-1 ${cfg.color}`}>
                  {cfg.icon}
                  {cfg.label}
                </Badge>
              )
            },
            width: "11%",
          },
          {
            header: "Data",
            accessor: (solicitacao: ReconhecimentoConsuladoType) => (
              <span>{solicitacao.created_at ? formatarDataLong(solicitacao.created_at) : '-'}</span>
            ),
            width: "15%",
          },
          {
            header: "Ações",
            accessor: (solicitacao: ReconhecimentoConsuladoType) => {
              const actions = [
                {
                  label: 'Detalhes',
                  icon: <Info className="h-4 w-4" />,
                  onClick: () => {
                    setSelectedSolicitacao(solicitacao)
                    setOpenDetalhes(true)
                  },
                },
              ]

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

              if (solicitacao.status === 'pendente' || solicitacao.status === 'enviado') {
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
            width: "30%",
          },
        ]}
      />

      <DetalhesReconhecimentoConsuladoDialog
        open={openDetalhes}
        onOpenChange={setOpenDetalhes}
        solicitacao={selectedSolicitacao}
      />

      {selectedSolicitacao && (
        <>
          <AprovarReconhecimentoConsuladoDialog
            open={openAprovar}
            onOpenChange={setOpenAprovar}
            onConfirm={handleAprovar}
            isLoading={aprovarMutation.isPending}
            clienteNome={selectedSolicitacao.cliente?.nome || '-'}
          />
          <RejeitarReconhecimentoConsuladoDialog
            open={openRejeitar}
            onOpenChange={setOpenRejeitar}
            onConfirm={handleRejeitar}
            isLoading={rejeitarMutation.isPending}
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
