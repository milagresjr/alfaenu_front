'use client'

import { useEffect } from "react"
import { StepProps } from "@/types/processo"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { api } from "@/services/api"
import { useAuthStore } from "@/store/useAuthStore"

export default function StepMinutas({ data, setData }: StepProps) {
  const router = useRouter()
  const { user } = useAuthStore()

  useEffect(() => {
    if (!data.cliente?.id) return

    const clienteId = data.cliente.id

    const saveAndRedirect = async () => {
      setData((prev) => ({ ...prev, status: "em_andamento" }))

      try {
        await api.post('/processo/progress', {
          cliente_id: clienteId,
          utilizador_id: user?.id,
          current_step: 6,
          tipo_visto: data.tipoVisto,
          subtipo: data.subtipo,
          financiamento: data.financiamento,
          financiamento_origem: data.financiamentoOrigem,
          financiador_id: data.financiador_id ? Number(data.financiador_id) : null,
          financiador_nome: data.financiador_nome,
          minuta_selecionada: data.minutaSelecionada,
          status: "em_andamento",
        })
      } catch (error) {
        console.error("Erro ao salvar progresso:", error)
      }

      router.push(`/process-organization-pt/documentos/${clienteId}`)
    }

    saveAndRedirect()
  }, [data.cliente?.id])

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="mt-4 text-muted-foreground">A preparar documentos...</p>
      </div>
    </div>
  )
}
