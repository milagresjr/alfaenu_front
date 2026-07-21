'use client'

import { useState, useMemo } from "react"
import { Search, Download, Eye } from "lucide-react"
import { useDebounce } from "@uidotdev/usehooks"
import { toast } from "react-toastify"
import { TableMain } from "@/components/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatarDataLong } from "@/lib/helpers"
import { useGetDeclaracoesServico } from "@/features/documentos-profundo/hooks/useDocumentoProfundoQuery"
import { DocumentoProfundoStatus } from "@/features/documentos-profundo/types"

export default function DeclaracoesServicoTable() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const debouncedSearch = useDebounce(search, 500)

  const { data, isLoading } = useGetDeclaracoesServico(page, 15)

  const filteredData = useMemo(() => {
    if (!data?.data) return []
    if (!debouncedSearch) return data.data
    const term = debouncedSearch.toLowerCase()
    return data.data.filter((item) =>
      item.cliente?.nome?.toLowerCase().includes(term) ||
      item.cliente?.email?.toLowerCase().includes(term)
    )
  }, [data, debouncedSearch])

  const handleDownload = (item: DocumentoProfundoStatus) => {
    if (item.declaracao_servico_url) {
      window.open(item.declaracao_servico_url, '_blank')
    } else {
      toast.info('URL da declaração não disponível.')
    }
  }

  const columns = useMemo(() => [
    {
      header: "Cliente",
      accessor: (row: DocumentoProfundoStatus) => row.cliente?.nome || 'N/A',
    },
    {
      header: "Email",
      accessor: (row: DocumentoProfundoStatus) => row.cliente?.email || '-',
    },
    {
      header: "Ficheiro",
      accessor: (row: DocumentoProfundoStatus) => row.declaracao_servico_nome || '-',
    },
    {
      header: "Data de Envio",
      accessor: (row: DocumentoProfundoStatus) => {
        if (!row.updated_at) return '-'
        return formatarDataLong(row.updated_at)
      },
    },
    {
      header: "Ações",
      accessor: (row: DocumentoProfundoStatus) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload(row)}
            className="gap-1"
          >
            <Download className="h-3.5 w-3.5" />
            Baixar
          </Button>
          {row.declaracao_servico_url && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(row.declaracao_servico_url!, '_blank')}
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ),
    },
  ], [])

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-gray-900 min-h-[calc(100vh-130px)]">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Declarações de Serviço
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Lista de declarações de serviço enviadas pelos clientes
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por cliente ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <TableMain
            data={filteredData}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="Nenhuma declaração de serviço encontrada."
          />
          {data && data.last_page > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">
                Página {data.current_page} de {data.last_page} (total: {data.total})
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= (data.last_page || 1)}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Seguinte
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
