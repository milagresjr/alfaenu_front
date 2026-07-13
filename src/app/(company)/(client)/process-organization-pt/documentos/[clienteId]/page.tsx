'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProcessoData } from "@/types/processo"
import { api } from "@/services/api"
import { toast } from "react-toastify"
import { Loader2 } from "lucide-react"
import dynamic from "next/dynamic"

const DocumentosContent = dynamic(
  () => import("@/app/(company)/(client)/process-organization-pt/new-process/_components/DocumentosContent"),
  { ssr: false }
)

export default function DocumentosPage() {
  const params = useParams()
  const router = useRouter()
  const clienteId = params.clienteId as string

  const [data, setData] = useState<ProcessoData>({
    cliente: null,
    tipoVisto: null,
    subtipo: null,
    financiamento: null,
    financiamentoOrigem: null,
    financiador_id: null,
    financiador_nome: null,
    minutaSelecionada: null,
    status: "rascunho",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!clienteId) return

    const loadData = async () => {
      try {
        setIsLoading(true)
        const response = await api.get(`/processo/progress/${clienteId}`)
        const processoData = response.data.data;
        console.log("Dados do processo", processoData);
        setData({
          cliente: processoData.cliente,
          tipoVisto: processoData.tipo_visto,
          subtipo: processoData.subtipo,
          financiamento: processoData.financiamento,
          financiamentoOrigem: processoData.financiamento_origem,
          financiador_id: processoData.financiador_id ?? null,
          financiador_nome: processoData.financiador_nome ?? null,
          minutaSelecionada: processoData.minutaSelecionada,
          status: processoData.status,
        })
      } catch (error) {
        console.error("Erro ao carregar dados do processo:", error)
        toast.error("Erro ao carregar dados do processo")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [clienteId])

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Carregando documentos...</p>
        </div>
      </div>
    )
  }

  if (!data.cliente) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Cliente não encontrado.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-200px)] py-4 sm:py-8 w-full">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-card rounded-2xl w-full shadow-xl border p-4 sm:p-6 md:p-8">
          <DocumentosContent
            data={data}
            setData={setData}
            onBack={() => router.push('/process-organization-pt')}
          />
        </div>
      </div>
    </div>
  )
}
