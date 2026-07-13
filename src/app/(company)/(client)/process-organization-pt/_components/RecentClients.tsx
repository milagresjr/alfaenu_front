'use client';

//import { PaginationComponent } from "@/components/ui_old/pagination/Pagination";
import { Users, UserCheck, UserX, Settings, Menu, MenuIcon, MoreVertical, Edit, Trash, Lock, Unlock, Info, Search, PlayCircle, Trash2 } from "lucide-react";

import { TableMain } from "@/components/table";
import { useRouter } from "next/navigation";
import { alert } from "@/lib/alert";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Input } from "@/components/ui/input";
import { useProgress } from "@bprogress/next";
import { useMyClienteStore } from "@/features/myClient/store/useMyClienteStore";
import { useDeleteMyCliente } from "@/features/myClient/hooks/useMyClientsQuery";
import { MyClienteType } from "@/features/myClient/types";
import { useDeleteProcessoProgress, useProcessoProgressByUser } from "@/features/processo-progress/hooks/useProcessoProgress";
import { ProcessoProgressType } from "@/features/processo-progress/types";
import { useClienteProcessoStore } from "@/features/processo-progress/store/clienteProcessoStore";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";


export default function RecentClients() {

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  const debouncedSearch = useDebounce(search, 500);

  const [openDialogDetail, setOpenDialogDetail] = useState(false);

  const { setSelectedMyCliente } = useMyClienteStore();

  const [selected, setSelected] = useState<"ativo" | "inativo" | "todos">(
    "todos"
  );

  const { setCliente, setStep } = useClienteProcessoStore();

  const { user } = useAuthStore();

  const { data, isLoading, isError } = useProcessoProgressByUser(String(user?.id));

  // console.log("DATA PRA ANALISAR", data);

  // const { data, isLoading, isError } = useMyClientes(page, perPage, debouncedSearch, selected !== 'todos' ? selected : '');

  const router = useRouter();

  const progress = useProgress();

  const deleteCliente = useDeleteMyCliente();

  const deleteProcessProgress = useDeleteProcessoProgress();

  const handleEdit = (cliente: MyClienteType) => {
    setSelectedMyCliente(cliente);
    progress.start();
    router.push(`/client/form`);
  };

  const handleNewProcess = () => {
    progress.start();
    router.push(`/process-organization-pt/new-process`);
  };

  function handleContinueProcess(cliente: MyClienteType) {
    // Guardar cliente no Zustand
    setCliente(cliente);
    setStep(6); // Forçar etapa 6

    // toast.success(`Continuando processo de ${cliente.nome}`);

    // Redirecionar sem parâmetros na URL
    progress.start();
    router.push(`/process-organization-pt/new-process?clienteId=${cliente.id}`);
  }


  const queryClient = useQueryClient();

  const handleRemoveFromRecent = async (item: ProcessoProgressType) => {
    setSelectedMyCliente(item.cliente ?? null);
    const confirmed = await alert.confirm('Confirmar', 'Tem certeza que deseja excluir o processo do cliente?', 'Sim', 'Não');
    if (confirmed) {
      setSelectedMyCliente(null);
      deleteProcessProgress.mutate(item.cliente_id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["processo-progress"],
            exact: false,
          });
          toast.success('Processo excluído com sucesso!');
        },
        onError: (error: any) => {
          console.error("Erro ao excluir o processo:", error);
        },
      });
    }
  };


  // const clientesFiltrados = useMemo(() => {
  //   if (selected === "ativo") {
  //     return data?.data.filter((cliente: any) => cliente.estado === "ativo");
  //   } else if (selected === "inativo") {
  //     return data?.data.filter((cliente: any) => cliente.estado === "inativo");
  //   }
  //   return data?.data;
  // }, [selected, data]);

  useEffect(() => {
    setPage(1);
  }, [selected]);

  if (isError) {
    return <div>Erro ao carregar clientes</div>;
  }


  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 min-h-[calc(100vh-130px)]">

      <div className="flex justify-start items-center my-4">
        <h1 className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
          Org. Processo Portugal
        </h1>
      </div>

      <div className="my-4 flex flex-col-reverse md:flex-row items-center justify-between gap-2">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar por cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <button onClick={handleNewProcess} className="bg-blue-600 px-4 py-2 rounded-md text-white flex justify-center md:justify-start gap-1 w-full md:w-auto">
          <Plus />
          Novo Processo
        </button>
      </div>

      <div>
        <h2 className="text-sm text-gray-600 dark:text-gray-400">Processos Recentes</h2>
        <TableMain
          data={(data as any)?.data || []}
          isLoading={isLoading}
          emptyMessage="Nenhum cliente encontrado."
          columns={[
            {
              header: "Nome",
              accessor: (item: any) => (
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-gray-500" />
                  <span>{item?.cliente?.nome ?? '-'}</span>
                </div>
              ),
            },
            {
              header: "Telefone",
              accessor: (item: any) => (
                <div className="flex items-center gap-2">
                  <span>{item?.cliente?.telefone ?? '-'}</span>
                </div>
              ),
            },
            {
              header: "Nº de BI/Passaporte",
              accessor: (item: any) => (
                <div className="flex items-center gap-2">
                  <span>{item?.cliente?.n_bi ?? '-'}</span>
                </div>
              ),
            },
            {
              header: "Tipo de Visto",
              accessor: (item: any) => (
                <div className="flex items-center gap-2">
                  <span className="capitalize">{item?.tipo_visto ?? '-'}</span>
                </div>
              ),
            },
            {
              header: "",
              accessor: (item: MyClienteType | any) => (
                <div className="flex items-center justify-end gap-2">
                  {/* Botão Continuar */}
                  <Button
                    onClick={() => handleContinueProcess(item.cliente)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm"
                  >
                    <PlayCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Continuar</span>
                  </Button>

                  {/* Botão Remover */}
                  <Button
                    onClick={() => handleRemoveFromRecent(item)}
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    title="Remover da lista"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ),
            }
          ]}
        />
      </div>


      {/* Paginação */}
      {/* {data && (
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
      )} */}

    </div>
  );
}