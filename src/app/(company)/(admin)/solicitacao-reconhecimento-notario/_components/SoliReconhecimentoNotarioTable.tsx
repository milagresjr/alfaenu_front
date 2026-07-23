'use client'

import { useState, useMemo } from "react"
import { FolderOpen, Search, CheckCircle, Clock, FileText, Home, MapPin, Info } from "lucide-react"
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
  useGetAllSolicitacoesReconhecimentoNotario,
  useAprovarSolicitacaoReconhecimentoNotario,
} from "@/features/reconhecimento-notario/hooks/useAdminReconhecimentoNotarioQuery"
import { SolicitacaoReconhecimentoNotarioType } from "@/features/reconhecimento-notario/types"
import { AprovarReconhecimentoNotarioDialog } from "./AprovarReconhecimentoNotarioDialog"
import { VerComprovativoDialog } from "./VerComprovativoDialog"
import { DetalhesReconhecimentoNotarioDialog } from "./DetalhesReconhecimentoNotarioDialog"

type FilterType = 'todos' | 'pendente' | 'aprovado'

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
}

export default function SoliReconhecimentoNotarioTable() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('todos')

  const debouncedSearch = useDebounce(search, 500)

  const { data, isLoading, refetch } = useGetAllSolicitacoesReconhecimentoNotario({
    search: debouncedSearch || undefined,
    status: filter !== 'todos' ? filter : undefined,
  })

  const aprovarMutation = useAprovarSolicitacaoReconhecimentoNotario()

  const [selectedSolicitacao, setSelectedSolicitacao] = useState<SolicitacaoReconhecimentoNotarioType | null>(null)
  const [showAprovarDialog, setShowAprovarDialog] = useState(false)
  const [showComprovativoDialog, setShowComprovativoDialog] = useState(false)
  const [openDetalhes, setOpenDetalhes] = useState(false)

  const columns = useMemo(() => [
    {
      header: "Cliente",
      accessor: (row: SolicitacaoReconhecimentoNotarioType) => row.cliente?.nome || 'N/A',
    },
    {
      header: "Tipo Entrega",
      accessor: (row: SolicitacaoReconhecimentoNotarioType) => (
        <div className="flex items-center gap-1">
          {row.tipo_entrega === 'domicilio' ? (
            <Home className="h-3.5 w-3.5 text-primary" />
          ) : (
            <MapPin className="h-3.5 w-3.5 text-primary" />
          )}
          <span className="capitalize">{row.tipo_entrega === 'domicilio' ? 'Ao domicílio' : 'Presencial'}</span>
        </div>
      ),
    },
    {
      header: "Declaração Autónoma",
      accessor: (row: SolicitacaoReconhecimentoNotarioType) => (
        row.declaracao_autonoma_generated
          ? <Badge variant="outline" className="text-green-600 border-green-500">Gerada</Badge>
          : <Badge variant="outline" className="text-muted-foreground">Não gerada</Badge>
      ),
    },
    {
      header: "Status",
      accessor: (row: SolicitacaoReconhecimentoNotarioType) => {
        const config = statusConfig[row.status]
        return (
          <Badge className={`gap-1 ${config.color}`}>
            {config.icon}
            {config.label}
          </Badge>
        )
      },
    },
    {
      header: "Data",
      accessor: (row: SolicitacaoReconhecimentoNotarioType) => formatarDataLong(row.created_at || ''),
    },
    {
      header: "Ações",
      accessor: (row: SolicitacaoReconhecimentoNotarioType) => (
        <DropdownActions
          actions={[
            {
              label: 'Detalhes',
              icon: <Info className="h-4 w-4" />,
              onClick: () => {
                setSelectedSolicitacao(row)
                setOpenDetalhes(true)
              },
            },
            ...(row.comprovativo_url
              ? [{
                  label: 'Ver Comprovativo',
                  icon: <FileText className="h-4 w-4" />,
                  onClick: () => {
                    setSelectedSolicitacao(row)
                    setShowComprovativoDialog(true)
                  },
                }]
              : []),
            ...(row.status === 'pendente'
              ? [{
                  label: 'Aprovar',
                  icon: <CheckCircle className="h-4 w-4" />,
                  onClick: () => {
                    setSelectedSolicitacao(row)
                    setShowAprovarDialog(true)
                  },
                }]
              : []),
          ]}
        />
      ),
    },
  ], [])

  const handleAprovar = async () => {
    if (!selectedSolicitacao) return

    try {
      await aprovarMutation.mutateAsync(selectedSolicitacao.id)
      toast.success('Reconhecimento notário aprovado com sucesso!')
      setShowAprovarDialog(false)
      setSelectedSolicitacao(null)
      refetch()
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      toast.error(err?.response?.data?.message || 'Erro ao aprovar solicitação.')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <FolderOpen className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Reconhecimento Notário</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Total Pendentes"
          value={data?.total_pendentes ?? 0}
          icon={<Clock className="h-5 w-5 text-yellow-600" />}
          className="border-yellow-200 dark:border-yellow-800"
        />
        <StatCard
          title="Total Aprovados"
          value={data?.total_aprovados ?? 0}
          icon={<CheckCircle className="h-5 w-5 text-green-600" />}
          className="border-green-200 dark:border-green-800"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar solicitações..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(['todos', 'pendente', 'aprovado'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {f === 'todos' ? 'Todos' : f === 'pendente' ? 'Pendentes' : 'Aprovados'}
            </button>
          ))}
        </div>
      </div>

      <TableMain
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Nenhuma solicitação encontrada."
      />

      <DetalhesReconhecimentoNotarioDialog
        open={openDetalhes}
        onOpenChange={setOpenDetalhes}
        solicitacao={selectedSolicitacao}
      />

      {selectedSolicitacao && (
        <>
          <AprovarReconhecimentoNotarioDialog
            open={showAprovarDialog}
            onOpenChange={setShowAprovarDialog}
            onConfirm={handleAprovar}
            isLoading={aprovarMutation.isPending}
            clienteNome={selectedSolicitacao.cliente?.nome || 'N/A'}
          />
          <VerComprovativoDialog
            open={showComprovativoDialog}
            onOpenChange={setShowComprovativoDialog}
            comprovativoUrl={selectedSolicitacao.comprovativo_url}
            comprovativoNome={selectedSolicitacao.comprovativo_nome}
            clienteNome={selectedSolicitacao.cliente?.nome || 'N/A'}
          />
        </>
      )}
    </div>
  )
}
