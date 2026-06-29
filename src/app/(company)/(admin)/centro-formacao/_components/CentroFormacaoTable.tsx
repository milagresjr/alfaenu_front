'use client';

import { Search, Plus, Edit, Trash, Eye, GraduationCap } from "lucide-react";
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
import { CentroFormacaoDialogCreate } from "./CentroFormacaoDialogCreate";
import { VerCursosModal } from "./VerCursosModal";
import { useCentroFormacaoStore } from "@/features/centroFormacao/store/useCentroFormacaoStore";
import { useDeleteCentroFormacao, useCentrosFormacao } from "@/features/centroFormacao/hooks/useCentroFormacaoQuery";
import { CentroFormacaoType } from "@/features/centroFormacao/types";

export default function CentroFormacaoTable() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [verCursosCentro, setVerCursosCentro] = useState<CentroFormacaoType | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { setSelectedCentroFormacao } = useCentroFormacaoStore();
  const { data, isLoading, isError } = useCentrosFormacao(page, perPage, debouncedSearch);

  const deleteCentro = useDeleteCentroFormacao();
  const queryClient = useQueryClient();

  const handleEdit = (item: CentroFormacaoType) => {
    setSelectedCentroFormacao(item);
    setDialogOpen(true);
  };

  const handleNew = () => {
    setSelectedCentroFormacao(null);
    setDialogOpen(true);
  };

  const handleDelete = async (item: CentroFormacaoType) => {
    setSelectedCentroFormacao(item);
    const confirmed = await alert.confirm(
      'Confirmar',
      'Tem certeza que deseja excluir este centro de formação?',
      'Sim',
      'Não'
    );
    if (confirmed) {
      setSelectedCentroFormacao(null);
      deleteCentro.mutate(item.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["centros-formacao"],
            exact: false,
          });
          toast.success('Centro de formação excluído com sucesso!');
        },
        onError: () => {
          toast.error('Erro ao excluir centro de formação!');
        },
      });
    }
  };

  const handleVerCursos = (item: CentroFormacaoType) => {
    setVerCursosCentro(item);
  };

  if (isError) {
    return <div>Erro ao carregar centros de formação</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 min-h-[calc(100vh-130px)]">
      <div className="flex justify-start items-center my-4">
        <h1 className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
          Centros de Formações
        </h1>
      </div>

      <div className="my-4 flex items-center justify-between gap-2">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar centro..."
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
        emptyMessage="Nenhum centro de formação encontrado."
        columns={[
          {
            header: "Imagem",
            accessor: (item: CentroFormacaoType) =>
              item.imagem ? (
                <img src={item.imagem as string} alt={item.nome} className="w-16 h-16 object-cover rounded" />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500">Sem imagem</div>
              ),
            width: "10%",
          },
          {
            header: "Nome",
            accessor: "nome",
            width: "25%",
          },
          {
            header: "Descrição",
            accessor: (item: CentroFormacaoType) => (
              <span className="line-clamp-2 text-sm text-muted-foreground">
                {item.descricao || "Sem descrição"}
              </span>
            ),
            width: "35%",
          },
          {
            header: "Data",
            accessor: (item: any) => (
              <span>{formatarDataLong(item.created_at)}</span>
            ),
            width: "15%",
          },
          {
            header: "Ações",
            accessor: (item: CentroFormacaoType) => {
              const actions = [
                {
                  label: "Ver Cursos",
                  icon: <GraduationCap />,
                  onClick: () => handleVerCursos(item),
                },
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
            width: "15%",
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

      <CentroFormacaoDialogCreate
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {verCursosCentro && (
        <VerCursosModal
          open={!!verCursosCentro}
          onOpenChange={(open) => { if (!open) setVerCursosCentro(null); }}
          centroId={verCursosCentro.id!}
          centroNome={verCursosCentro.nome}
        />
      )}
    </div>
  );
}
