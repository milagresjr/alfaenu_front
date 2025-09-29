'use client';

//import { PaginationComponent } from "@/components/ui_old/pagination/Pagination";
import { Users, UserCheck, UserX, Settings, Menu, MenuIcon, MoreVertical, Edit, Trash, Lock, Unlock, Info, Search } from "lucide-react";
import { useAlterarEstadoCliente, useClientes, useDeleteCliente } from "@/features/client/hooks/useClientsQuery";
import { useClienteStore } from "@/features/client/store/useClienteStore";
import { ClienteType } from "@/features/client/types";
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
import { EstadoCell } from "@/features/client/components/EstadoCell";
import { useMemo } from "react";
import { useProgress } from "@bprogress/next";
import LoadingDialog from "../../../(full-width-pages)/pos/_components/LoadingDialog";
import { DropdownActions } from "@/components/dropdown-action-menu/drop-actions-menu";
import { ClienteDetailDialog } from "./ClienteDetailDialog";

export default function ClientTable() {

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);

    const debouncedSearch = useDebounce(search, 500);

    const [openDialogDetail,setOpenDialogDetail] = useState(false);

    const { setSelectedCliente } = useClienteStore();

    const [selected, setSelected] = useState<"ativo" | "inativo" | "todos">(
        "todos"
    );

    const { data, isLoading, isError } = useClientes(page, perPage, debouncedSearch, selected !== 'todos' ? selected : '');

    const router = useRouter();

    const progress = useProgress();

    const deleteCliente = useDeleteCliente();
    const alterarEstado = useAlterarEstadoCliente();

    const handleEdit = (cliente: ClienteType) => {
        setSelectedCliente(cliente);
        progress.start();
        router.push(`/client/form`);
    };

    const handleNewCliente = () => {
        setSelectedCliente(null);
        progress.start();
        router.push(`/client/form`);
    };


    const queryClient = useQueryClient();

    const handleDelete = async (cliente: ClienteType) => {
        setSelectedCliente(cliente);
        const confirmed = await alert.confirm('Confirmar', 'Tem certeza que deseja excluir este cliente?', 'Sim', 'Não');
        if (confirmed) {
            setSelectedCliente(null);
            deleteCliente.mutate(cliente.id, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["clientes"],
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

    const toggleEstado = (cliente: ClienteType) => {
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

    function handleDetalhes(cliente: ClienteType) {
        setSelectedCliente(cliente);
        setOpenDialogDetail(true);
    }


    const stats = [
        {
            key: "todos",
            title: "Total de Clientes",
            value: data?.total_geral.toString(),
            change: "",
            icon: <Users className="w-6 h-6 text-blue-600" />,
        },
        {
            key: "ativo",
            title: "Clientes Ativos",
            value: data?.total_ativos.toString(),
            change: "",
            icon: <UserCheck className="w-6 h-6 text-green-600" />,
        },
        {
            key: "inativo",
            title: "Clientes Inativos",
            value: data?.total_inativos.toString(),
            change: "",
            icon: <UserX className="w-6 h-6 text-red-600" />,
        },
    ];


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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <StatCard
                        key={stat.key}
                        title={stat.title}
                        value={stat.value!}
                        change={stat.change}
                        icon={stat.icon}
                        isActive={selected === stat.key}
                        onClick={() => setSelected(stat.key as typeof selected)}
                    />
                ))}
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
                <button onClick={handleNewCliente} className="bg-blue-600 px-4 py-2 rounded-md text-white flex gap-1">
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
                        accessor: "nome"
                    },
                    {
                        header: "Telefone",
                        accessor: "telefone"
                    },
                    {
                        header: "Nº de BI/Passaporte",
                        accessor: "n_bi"
                    },
                    {
                        header: "Estado",
                        accessor: (cliente: ClienteType) => <EstadoCell cliente={cliente} />,
                    },
                    {
                        header: "Data",
                        accessor: (term: any) => (
                            <span>
                                {formatarDataLong(term.created_at)}
                            </span>
                        )
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
                                {
                                    label: cliente.estado === "ativo" ? "Inativar" : "Ativar",
                                    icon: cliente.estado === "ativo" ? <Lock /> : <Unlock />,
                                    onClick: () => toggleEstado(cliente),
                                },
                                {
                                    label: "Detalhes",
                                    icon: <Info />,
                                    onClick: () => handleDetalhes(cliente),
                                },
                            ];
                            return <DropdownActions actions={actions} />
                        }
                    }
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

            <ClienteDetailDialog openDialog={openDialogDetail} onClose={() => setOpenDialogDetail(false)} />
        </div>
    );
}