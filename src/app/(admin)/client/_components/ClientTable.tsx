'use client';

//import { PaginationComponent } from "@/components/ui_old/pagination/Pagination";
import { Users, UserCheck, UserX, ToggleLeft, Loader2 } from "lucide-react";
import { useAlterarEstadoCliente, useClientes, useDeleteCliente } from "@/features/client/hooks/useClientsQuery";
import { useClienteStore } from "@/features/client/store/useClienteStore";
import { ClienteType } from "@/features/client/types";
import { TableMain } from "@/components/table";
import { useRouter } from "next/navigation";
import { alert } from "@/lib/alert";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import Link from "next/link";
import { formatarDataLong } from "@/lib/helpers";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Input } from "@/components/ui/input";
import { PaginationComponent } from "@/components/pagination/Pagination";
import { StatCard } from "@/components/StatCard/stat-card";
import { EstadoCell } from "@/features/client/components/EstadoCell";
import { useMemo } from "react";

export default function ClientTable() {

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);

    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, isError } = useClientes(page, perPage, debouncedSearch);

    const { selectedCliente, setSelectedCliente } = useClienteStore();

    const [loadingId, setLoadingId] = useState<number | null>(null);

    const [selected, setSelected] = useState<"ativos" | "inativos" | "todos">(
        "todos"
    );

    const router = useRouter();

    const deleteCliente = useDeleteCliente();
    const alterarEstado = useAlterarEstadoCliente();

    const handleEdit = (cliente: ClienteType) => {
        setSelectedCliente(cliente);
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

    if (isError) {
        return <div>Erro ao carregar clientes</div>;
    }

    const totalClientesAtivo = data?.data.filter(cliente => cliente.estado === 'ativo').length || 0;
    const totalClientesInativo = data?.data.filter(cliente => cliente.estado === 'inativo').length || 0;
    const totalClientes = totalClientesAtivo + totalClientesInativo;

    const stats = [
        {
            key: "todos",
            title: "Total de Clientes",
            value: totalClientes.toString(),
            change: "",
            icon: <Users className="w-6 h-6 text-primary" />,
        },
        {
            key: "ativos",
            title: "Clientes Ativos",
            value: totalClientesAtivo.toString(),
            change: "",
            icon: <UserCheck className="w-6 h-6 text-primary" />,
        },
        {
            key: "inativos",
            title: "Clientes Inativos",
            value: totalClientesInativo.toString(),
            change: "",
            icon: <UserX className="w-6 h-6 text-primary" />,
        },
    ];


    const clientesFiltrados = useMemo(() => {
        if (selected === "ativos") {
            return data?.data.filter(cliente => cliente.estado === "ativo");
        } else if (selected === "inativos") {
            return data?.data.filter(cliente => cliente.estado === "inativo");
        }
        return data?.data;
    }, [selected, data]);


    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 min-h-[calc(100vh-130px)]">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <StatCard
                        key={stat.key}
                        title={stat.title}
                        value={stat.value}
                        change={stat.change}
                        icon={stat.icon}
                        isActive={selected === stat.key}
                        onClick={() => setSelected(stat.key as typeof selected)}
                    />
                ))}
            </div>

            <div className="flex justify-between items-center my-2">
                <h1 className="text-lg text-gray-700 dark:text-gray-300 font-semibold">Clientes</h1>
                <Link href="/client/form" className="bg-blue-600 px-4 py-1 rounded-md text-white flex gap-1">
                    <Plus />
                    Novo
                </Link>
            </div>
            <div className="my-2 flex justify-start gap-2">
                <Input
                    placeholder='Buscar cliente..'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-1/3"
                />
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
                        header: "Email",
                        accessor: "email"
                    },
                    {
                        header: "Telefone",
                        accessor: "telefone"
                    },
                    {
                        header: "Data de Nasc",
                        accessor: "data_nascimento"
                    },
                    {
                        header: "Endereço",
                        accessor: "endereco"
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
                        header: "Data de Criação",
                        accessor: (term: any) => (
                            <span>
                                {formatarDataLong(term.created_at)}
                            </span>
                        )
                    },
                    {
                        header: "Ações",
                        accessor: (cliente) => (
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(cliente)}>
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(cliente)} >
                                    Delete
                                </button>
                            </div>
                        ),
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
        </div>
    );
}