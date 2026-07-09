"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "react-toastify"
import { FolderOpen } from "lucide-react"
import { useGetConfigReconhecimentoNotario, useUpdateConfigReconhecimentoNotario } from "@/features/reconhecimento-notario/hooks/useAdminReconhecimentoNotarioQuery"

export default function ConfigReconhecimentoNotarioForm() {
  const { data: config, isLoading } = useGetConfigReconhecimentoNotario()
  const updateConfig = useUpdateConfigReconhecimentoNotario()

  const [precoBase, setPrecoBase] = useState("")
  const [taxaDomicilio, setTaxaDomicilio] = useState("")
  const [enderecoAgencia, setEnderecoAgencia] = useState("")

  useEffect(() => {
    if (config) {
      setPrecoBase(String(config.preco_base))
      setTaxaDomicilio(String(config.taxa_domicilio))
      setEnderecoAgencia(config.endereco_agencia)
    }
  }, [config])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!precoBase || !taxaDomicilio || !enderecoAgencia) {
      toast.error("Preencha todos os campos.")
      return
    }

    try {
      await updateConfig.mutateAsync({
        preco_base: Number(precoBase),
        taxa_domicilio: Number(taxaDomicilio),
        endereco_agencia: enderecoAgencia,
      })
      toast.success("Configuração atualizada com sucesso!")
    } catch {
      toast.error("Erro ao atualizar configuração.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="space-y-4 w-full md:w-[95%]">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full md:w-[95%]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-teal-500" />
            <CardTitle>Configuração - Reconhecimento Notário</CardTitle>
          </div>
          <CardDescription>
            Altere os valores padrão para preços e endereço da agência.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="preco_base">Preço Base (Kz)</Label>
                <Input
                  id="preco_base"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ex: 5000"
                  value={precoBase}
                  onChange={(e) => setPrecoBase(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxa_domicilio">Taxa de Domicílio (Kz)</Label>
                <Input
                  id="taxa_domicilio"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ex: 2000"
                  value={taxaDomicilio}
                  onChange={(e) => setTaxaDomicilio(e.target.value)}
                  className="h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco_agencia">Endereço da Agência</Label>
              <Textarea
                id="endereco_agencia"
                placeholder="Ex: Rua 1, Edifício 2, 3º Andar, Luanda"
                rows={3}
                value={enderecoAgencia}
                onChange={(e) => setEnderecoAgencia(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700"
                disabled={updateConfig.isPending}
              >
                {updateConfig.isPending ? "A salvar..." : "Salvar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
