'use client';

import { Search, Plus, Edit, Trash, Wallet } from "lucide-react";
import { TableMain } from "@/components/table";
import { alert } from "@/lib/alert";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { formatarDataLong } from "@/lib/helpers";
import { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Input } from "@/components/ui/input";
import { PaginationComponent } from "@/components/pagination/Pagination";
import { DropdownActions } from "@/components/dropdown-action-menu/drop-actions-menu";
import { FinanciadorDialogCreate } from "./FinanciadorDialogCreate";
import { useFinanciadorStore } from "@/features/financiador/store/useFinanciadorStore";
import { useDeleteFinanciador, useFinanciadores } from "@/features/financiador/hooks/useFinanciadorQuery";
import { FinanciadorType } from "@/features/financiador/types";
import { useAuthStore } from "@/store/useAuthStore";

export default function FinanciadorTable() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [dialogOpen, setDialogOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const { setSelectedFinanciador } = useFinanciadorStore();
  const { user } = useAuthStore();
  const { data, isLoading, isError } = useFinanciadores(
    String(user?.id), page, perPage, debouncedSearch
  );

  console.log("Finacniadores buscados: ",data);

  const deleteFinanciador = useDeleteFinanciador();
  const queryClient = useQueryClient();

  const handleEdit = (item: FinanciadorType) => {
    setSelectedFinanciador(item);
    setDialogOpen(true);
  };

  const handleNew = () => {
    setSelectedFinanciador(null);
    setDialogOpen(true);
  };

  const handleDelete = async (item: FinanciadorType) => {
    setSelectedFinanciador(item);
    const confirmed = await alert.confirm(
      'Confirmar',
      'Tem certeza que deseja excluir este financiador?',
      'Sim',
      'Não'
    );
    if (confirmed) {
      setSelectedFinanciador(null);
      deleteFinanciador.mutate(item.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["financiadores"],
            exact: false,
          });
          toast.success('Financiador excluído com sucesso!');
        },
        onError: () => {
          toast.error('Erro ao excluir financiador!');
        },
      });
    }
  };

  if (isError) {
    return <div>Erro ao carregar financiadores</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 min-h-[calc(100vh-130px)]">
      <div className="flex justify-start items-center my-4">
        <h1 className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
          Financiadores
        </h1>
      </div>

      <div className="my-4 flex items-center justify-between gap-2">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar financiador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <button onClick={handleNew} className="bg-blue-600 px-4 py-2 rounded-md text-white flex gap-1 items-center">
          <Plus size={18} />
          Novo
        </button>
      </div>

      <TableMain
        data={data?.data || []}
        isLoading={isLoading}
        emptyMessage="Nenhum financiador encontrado."
        columns={[
          {
            header: "Nome Completo",
            accessor: "nome_completo",
            width: "30%",
          },
          {
            header: "Telefone",
            accessor: "telefone",
            width: "15%",
          },
          {
            header: "Tipo Documento",
            accessor: "tipo_documento",
            width: "15%",
          },
          {
            header: "Data",
            accessor: (term: any) => (
              <span>{formatarDataLong(term.created_at)}</span>
            ),
            width: "15%",
          },
          {
            header: "Ações",
            accessor: (item: FinanciadorType) => {
              const actions = [
                {
                  label: "Editar",
                  icon: <Edit />,
                  onClick: () => handleEdit(item),
                },
                {
                  label: "Excluir",
                  icon: <Trash />,
                  onClick: () => handleDelete(item),
                },
              ];
              return <DropdownActions actions={actions} />;
            },
            width: "10%",
          },
        ]}
      />

      {data && (
        <PaginationComponent
          currentPage={data.current_page}
          itemsPerPage={data.per_page}
          totalItems={data.total}
          lastPage={data.last_page}
          onPageChange={setPage}
          onItemsPerPageChange={value => {
            setPage(1);
            setPerPage(value);
          }}
        />
      )}

      <FinanciadorDialogCreate
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
