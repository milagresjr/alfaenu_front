'use client'

import { useState } from "react"
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react"
import { toast } from "react-toastify"
import { AxiosError } from "axios"
import { TableMain } from "@/components/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownActions } from "@/components/dropdown-action-menu/drop-actions-menu"
import { formatarDataLong } from "@/lib/helpers"
import { alert } from "@/lib/alert"
import {
  useGetDescricoesReservaHotel,
  useCreateDescricaoReservaHotel,
  useUpdateDescricaoReservaHotel,
  useDeleteDescricaoReservaHotel,
  useToggleDescricaoReservaHotelActive,
} from "@/features/solicitacao-reserva-hotel/hooks/useAdminReservaHotelQuery"
import { SolicitacaoReservaHotelDescricaoType } from "@/features/solicitacao-reserva-hotel/types"
import { DescricaoDialog } from "./DescricaoDialog"

export default function DescricaoList() {
  const { data: descricoes, isLoading, refetch } = useGetDescricoesReservaHotel()
  const createMutation = useCreateDescricaoReservaHotel()
  const updateMutation = useUpdateDescricaoReservaHotel()
  const deleteMutation = useDeleteDescricaoReservaHotel()
  const toggleMutation = useToggleDescricaoReservaHotelActive()

  const [openDialog, setOpenDialog] = useState(false)
  const [selectedDescricao, setSelectedDescricao] = useState<SolicitacaoReservaHotelDescricaoType | null>(null)

  const handleCreate = () => {
    setSelectedDescricao(null)
    setOpenDialog(true)
  }

  const handleEdit = (descricao: SolicitacaoReservaHotelDescricaoType) => {
    setSelectedDescricao(descricao)
    setOpenDialog(true)
  }

  const handleDelete = async (descricao: SolicitacaoReservaHotelDescricaoType) => {
    const confirmed = await alert.confirm(
      'Excluir Descrição',
      `Tem certeza que deseja excluir esta descrição?`,
      'Sim, Excluir',
      'Cancelar'
    )
    if (!confirmed) return

    deleteMutation.mutate(descricao.id, {
      onSuccess: () => {
        toast.success('Descrição excluída com sucesso!')
        refetch()
      },
      onError: (error: Error) => {
        const err = error as unknown as AxiosError<{ message: string }>
        toast.error(err?.response?.data?.message || 'Erro ao excluir descrição')
      },
    })
  }

  const handleToggle = (descricao: SolicitacaoReservaHotelDescricaoType) => {
    toggleMutation.mutate(descricao.id, {
      onSuccess: () => {
        toast.success('Status da descrição atualizado com sucesso!')
        refetch()
      },
      onError: (error: Error) => {
        const err = error as unknown as AxiosError<{ message: string }>
        toast.error(err?.response?.data?.message || 'Erro ao alterar status da descrição')
      },
    })
  }

  const handleSave = (data: { descricao: string; status: boolean }, id?: string) => {
    if (id) {
      updateMutation.mutate(
        { id, data },
        {
          onSuccess: () => {
            toast.success('Descrição atualizada com sucesso!')
            setOpenDialog(false)
            setSelectedDescricao(null)
            refetch()
          },
          onError: (error: Error) => {
            const err = error as unknown as AxiosError<{ message: string }>
            toast.error(err?.response?.data?.message || 'Erro ao atualizar descrição')
          },
        }
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Descrição criada com sucesso!')
          setOpenDialog(false)
          refetch()
        },
        onError: (error: Error) => {
          const err = error as unknown as AxiosError<{ message: string }>
          toast.error(err?.response?.data?.message || 'Erro ao criar descrição')
        },
      })
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 min-h-[calc(100vh-130px)]">
      <div className="flex justify-between items-center my-4">
        <h1 className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
          Descrições de Reserva de Hotel
        </h1>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Descrição
        </Button>
      </div>

      <TableMain
        data={descricoes || []}
        isLoading={isLoading}
        emptyMessage="Nenhuma descrição encontrada."
        columns={[
          {
            header: "ID",
            accessor: "id",
            width: "10%",
          },
          {
            header: "Descrição",
            accessor: (descricao: SolicitacaoReservaHotelDescricaoType) => (
              <span className="text-sm line-clamp-2 max-w-md">{descricao.descricao}</span>
            ),
            width: "55%",
          },
          {
            header: "Ativo",
            accessor: (descricao: SolicitacaoReservaHotelDescricaoType) => (
              <Badge variant="outline" className={descricao.status ? 'text-green-600 bg-green-100 border-green-500' : 'text-gray-600 bg-gray-100 border-gray-500'}>
                {descricao.status ? 'Sim' : 'Não'}
              </Badge>
            ),
            width: "10%",
          },
          {
            header: "Criado em",
            accessor: (descricao: SolicitacaoReservaHotelDescricaoType) => (
              <span>{descricao.created_at ? formatarDataLong(descricao.created_at) : '-'}</span>
            ),
            width: "15%",
          },
          {
            header: "Ações",
            accessor: (descricao: SolicitacaoReservaHotelDescricaoType) => (
              <DropdownActions
                actions={[
                  {
                    label: 'Editar',
                    icon: <Pencil className="h-4 w-4" />,
                    onClick: () => handleEdit(descricao),
                  },
                  {
                    label: descricao.status ? 'Desativar' : 'Ativar',
                    icon: descricao.status ? <ToggleRight className="h-4 w-4 text-orange-500" /> : <ToggleLeft className="h-4 w-4 text-green-500" />,
                    onClick: () => handleToggle(descricao),
                  },
                  {
                    label: 'Excluir',
                    icon: <Trash2 className="h-4 w-4 text-red-500" />,
                    onClick: () => handleDelete(descricao),
                  },
                ]}
              />
            ),
            width: "10%",
          },
        ]}
      />

      <DescricaoDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onSave={handleSave}
        descricao={selectedDescricao}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}
