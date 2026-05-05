'use client';

//import { PaginationComponent } from "@/components/ui_old/pagination/Pagination";
import { Users, UserCheck, UserX, Settings, Menu, MenuIcon, MoreVertical, Edit, Trash, Lock, Unlock, Info, Search } from "lucide-react";
import { TableMain } from "@/components/table";
import { useRouter } from "next/navigation";
import { alert } from "@/lib/alert";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { formatarDataLong } from "@/lib/helpers";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Input } from "@/components/ui/input";
import { PaginationComponent } from "@/components/pagination/Pagination";
import { StatCard } from "@/components/StatCard/stat-card";
import { useMemo } from "react";
import { useProgress } from "@bprogress/next";
import { DropdownActions } from "@/components/dropdown-action-menu/drop-actions-menu";
import LoadingDialog from "@/app/(full-width-pages)/pos/_components/LoadingDialog";
import { ClientDialogCreate } from "./ClientDialogCreate";
import { useMyClienteStore } from "@/features/myClient/store/useMyClienteStore";
import { useAlterarEstadoMyCliente, useDeleteMyCliente, useMyClientes } from "@/features/myClient/hooks/useMyClientsQuery";
import { MyClienteType } from "@/features/myClient/types";


export default function MyClientsTable() {

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  const debouncedSearch = useDebounce(search, 500);

  const [dialogOpen, setDialogOpen] = useState(false)

  const handleClientCreated = (data: any) => {
    console.log("Cliente criado:", data)
    // Atualizar lista de clientes, mostrar toast, etc.
  }

  const { setSelectedMyCliente } = useMyClienteStore();

  const [selected, setSelected] = useState<"ativo" | "inativo" | "todos">(
    "todos"
  );

  const { data, isLoading, isError } = useMyClientes(page, perPage, debouncedSearch, selected !== 'todos' ? selected : '');

  const router = useRouter();

  const progress = useProgress();

  const deleteCliente = useDeleteMyCliente();
  const alterarEstado = useAlterarEstadoMyCliente();

  const handleEdit = (cliente: MyClienteType) => {
    setSelectedMyCliente(cliente);
    setDialogOpen(true);
  };

  const handleNewCliente = () => {
    setSelectedMyCliente(null);
    progress.start();
    router.push(`/client/form`);
  };


  const queryClient = useQueryClient();

  const handleDelete = async (cliente: MyClienteType) => {
    setSelectedMyCliente(cliente);
    const confirmed = await alert.confirm('Confirmar', 'Tem certeza que deseja excluir este cliente?', 'Sim', 'Não');
    if (confirmed) {
      setSelectedMyCliente(null);
      deleteCliente.mutate(cliente.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["myclientes"],
            exact: false,
          });
          toast.success('Cliente excluído com sucesso!');
        },
        onError: (error) => {
          console.error("Erro ao excluir a marca:", error);
        },
      });
    }
  };

  const toggleEstado = (cliente: MyClienteType) => {
    alterarEstado.mutate({
      id: Number(cliente.id),
      estado: cliente.estado === "ativo" ? "inativo" : "ativo",
    },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["clientes"] });
          toast.success('Estado alterado com sucesso!');
        },
        onError: (error) => {
          console.error("Erro ao alterar o estado do cliente:", error);
        }
      }
    );
  };


  const clientesFiltrados = useMemo(() => {
    if (selected === "ativo") {
      return data?.data.filter(cliente => cliente.estado === "ativo");
    } else if (selected === "inativo") {
      return data?.data.filter(cliente => cliente.estado === "inativo");
    }
    return data?.data;
  }, [selected, data]);

  useEffect(() => {
    setPage(1);
  }, [selected]);

  if (isError) {
    return <div>Erro ao carregar clientes</div>;
  }

  if (alterarEstado.isPending) {
    return (
      <LoadingDialog />
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 min-h-[calc(100vh-130px)]">

      <div className="flex justify-start items-center my-4">
        <h1 className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
          Clientes
        </h1>
      </div>

      <div className="my-4 flex items-center justify-between gap-2">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <button onClick={() => setDialogOpen(true)} className="bg-blue-600 px-4 py-2 rounded-md text-white flex gap-1">
          <Plus />
          Novo
        </button>
      </div>

      <TableMain
        data={clientesFiltrados || []}
        isLoading={isLoading}
        emptyMessage="Nenhum cliente encontrado."
        columns={[
          {
            header: "Nome",
            accessor: "nome",
            width: "30%", // ocupa a maior parte
          },
          {
            header: "Telefone",
            accessor: "telefone",
            width: "15%",
          },
          {
            header: "Nº de BI/Passaporte",
            accessor: "n_bi",
            width: "20%",
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
            accessor: (cliente) => {
              const actions = [
                {
                  label: "Editar",
                  icon: <Edit />,
                  onClick: () => handleEdit(cliente),
                },
                {
                  label: "Excluir",
                  icon: <Trash />,
                  onClick: () => handleDelete(cliente),
                },
                // {
                //   label: cliente.estado === "ativo" ? "Inativar" : "Ativar",
                //   icon: cliente.estado === "ativo" ? <Lock /> : <Unlock />,
                //   onClick: () => toggleEstado(cliente),
                // },
              ];
              return <DropdownActions actions={actions} />;
            },
            width: "10%", // só precisa de pouco espaço
          },
        ]}
      />


      {/* Paginação */}
      {data && (
        <PaginationComponent
          currentPage={data.current_page}
          itemsPerPage={data.per_page}
          totalItems={data.total}
          lastPage={data.last_page}
          onPageChange={setPage}
          onItemsPerPageChange={value => {
            setPage(1)
            setPerPage(value)
          }}
        />
      )}

      <ClientDialogCreate
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleClientCreated}
      />
    </div>
  );
}