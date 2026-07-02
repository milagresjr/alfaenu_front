'use client'

import { useState, useMemo } from "react"
import { Building2, Search, CheckCircle, XCircle, Clock, AlertCircle, FileText, Upload } from "lucide-react"
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
  useGetAllSolicitacoesReservaHotel,
  useAprovarSolicitacaoReservaHotel,
  useRejeitarSolicitacaoReservaHotel,
  useEnviarDocumentoReservaHotel,
} from "@/features/solicitacao-reserva-hotel/hooks/useAdminReservaHotelQuery"
import { SolicitacaoReservaHotelType, SolicitacaoReservaHotelStatus } from "@/features/solicitacao-reserva-hotel/types"
import { AprovarReservaHotelDialog } from "./AprovarReservaHotelDialog"
import { RejeitarReservaHotelDialog } from "./RejeitarReservaHotelDialog"
import { EnviarReservaHotelForm } from "./EnviarReservaHotelForm"
import { VerMotivoRejeicaoDialog } from "./VerMotivoRejeicaoDialog"
import { VerComprovativoDialog } from "./VerComprovativoDialog"

type FilterType = 'todos' | SolicitacaoReservaHotelStatus

const statusConfig: Record<SolicitacaoReservaHotelStatus, { label: string; color: string; icon: React.ReactNode }> = {
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

export default function SoliReservaHotelTable() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('todos')

  const debouncedSearch = useDebounce(search, 500)

  const { data, isLoading, refetch } = useGetAllSolicitacoesReservaHotel({
    search: debouncedSearch || undefined,
    status: filter !== 'todos' ? filter : undefined,
  })

  const aprovarMutation = useAprovarSolicitacaoReservaHotel()
  const rejeitarMutation = useRejeitarSolicitacaoReservaHotel()
  const enviarDocumentoMutation = useEnviarDocumentoReservaHotel()

  const [selectedSolicitacao, setSelectedSolicitacao] = useState<SolicitacaoReservaHotelType | null>(null)
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
      icon: <Building2 className="w-6 h-6 text-blue-600" />,
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
      onError: (error: Error) => {
        const err = error as unknown as AxiosError<{ message: string }>
        toast.error(err?.response?.data?.message || 'Erro ao aprovar solicitação')
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
        onError: (error: Error) => {
          const err = error as unknown as AxiosError<{ message: string }>
          toast.error(err?.response?.data?.message || 'Erro ao rejeitar solicitação')
        },
      }
    )
  }

  const handleEnviarDocumento = (formData: FormData) => {
    if (!selectedSolicitacao) return
    enviarDocumentoMutation.mutate(
      { id: selectedSolicitacao.id, formData },
      {
        onSuccess: () => {
          toast.success('Documento enviado com sucesso!')
          setOpenEnviar(false)
          setSelectedSolicitacao(null)
          refetch()
        },
        onError: (error: Error) => {
          const err = error as unknown as AxiosError<{ message: string }>
          toast.error(err?.response?.data?.message || 'Erro ao enviar documento')
        },
      }
    )
  }

  const handleDownloadDocumento = (solicitacao: SolicitacaoReservaHotelType) => {
    if (!solicitacao.comprovativo_url) {
      toast.error('Documento não disponível.')
      return
    }
    const a = document.createElement('a')
    a.href = solicitacao.comprovativo_url
    a.download = solicitacao.comprovativo_nome || 'documento.pdf'
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    a.remove()
    toast.success('Documento baixado com sucesso!')
  }

  const solicitacoes = data?.data || []

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 min-h-[calc(100vh-130px)]">
      <div className="flex justify-start items-center my-4">
        <h1 className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
          Solicitações de Reserva de Hotel
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
        emptyMessage="Nenhuma solicitação de reserva de hotel encontrada."
        columns={[
          {
            header: "Cliente",
            accessor: (solicitacao: SolicitacaoReservaHotelType) => (
              <span>{solicitacao.cliente?.nome || '-'}</span>
            ),
            width: "18%",
          },
          {
            header: "Data Ida",
            accessor: (solicitacao: SolicitacaoReservaHotelType) => (
              <span>{solicitacao.data_ida ? formatarDataLong(solicitacao.data_ida) : '-'}</span>
            ),
            width: "13%",
          },
          {
            header: "Data Volta",
            accessor: (solicitacao: SolicitacaoReservaHotelType) => (
              <span>{solicitacao.data_volta ? formatarDataLong(solicitacao.data_volta) : '-'}</span>
            ),
            width: "13%",
          },
          {
            header: "Status",
            accessor: (solicitacao: SolicitacaoReservaHotelType) => {
              const cfg = statusConfig[solicitacao.status]
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
            accessor: (solicitacao: SolicitacaoReservaHotelType) => (
              <span>{solicitacao.created_at ? formatarDataLong(solicitacao.created_at) : '-'}</span>
            ),
            width: "15%",
          },
          {
            header: "Ações",
            accessor: (solicitacao: SolicitacaoReservaHotelType) => {
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
                actions.push({
                  label: 'Enviar Documento',
                  icon: <Upload className="h-4 w-4" />,
                  onClick: () => {
                    setSelectedSolicitacao(solicitacao)
                    setOpenEnviar(true)
                  },
                })
                if (solicitacao.comprovativo_url) {
                  actions.push({
                    label: 'Baixar Documento',
                    icon: <FileText className="h-4 w-4" />,
                    onClick: () => handleDownloadDocumento(solicitacao),
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
            width: "30%",
          },
        ]}
      />

      {selectedSolicitacao && (
        <>
          <AprovarReservaHotelDialog
            open={openAprovar}
            onOpenChange={setOpenAprovar}
            onConfirm={handleAprovar}
            isLoading={aprovarMutation.isPending}
            clienteNome={selectedSolicitacao.cliente?.nome || '-'}
          />
          <RejeitarReservaHotelDialog
            open={openRejeitar}
            onOpenChange={setOpenRejeitar}
            onConfirm={handleRejeitar}
            isLoading={rejeitarMutation.isPending}
            clienteNome={selectedSolicitacao.cliente?.nome || '-'}
          />
          <EnviarReservaHotelForm
            open={openEnviar}
            onOpenChange={setOpenEnviar}
            onConfirm={handleEnviarDocumento}
            isLoading={enviarDocumentoMutation.isPending}
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
