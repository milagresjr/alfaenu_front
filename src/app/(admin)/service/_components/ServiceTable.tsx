'use client';

//import { PaginationComponent } from "@/components/ui_old/pagination/Pagination";
import { useEffect, useState } from "react";
import { TableMain } from "@/components/table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { alert } from "@/lib/alert";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Edit, Lock, Plus, Search, Trash, Unlock } from "lucide-react";
import { useAlterarEstadoServico, useDeleteServico, useServicos } from "@/features/service/hooks/useServicesQuery";
import { useServiceStore } from "@/features/service/store/useServiceStore";
import { ServiceType } from "@/features/service/types";
import { useProgress } from "@bprogress/next";
import { formatarDataLong } from "@/lib/helpers";
import { useDebounce } from "@uidotdev/usehooks";
import { Input } from "@/components/ui/input";
import { PaginationComponent } from "@/components/pagination/Pagination";
import { EstadoCell } from "@/features/service/components/EstadoCell";
import { useMemo } from "react";
import { ClipboardList, Wrench, Ban } from "lucide-react";
import { StatCard } from "@/components/StatCard/stat-card";
import { DropdownActions } from "@/components/dropdown-action-menu/drop-actions-menu";

export default function ServiceTable() {

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);

    const debouncedSearch = useDebounce(search, 500);

    const [selected, setSelected] = useState<"ativo" | "inativo" | "todos">(
        "todos"
    );

    const { data, isLoading, isError } = useServicos({ page, per_page: perPage, search: debouncedSearch, estado: selected !== 'todos' ? selected : '' });

    const { setSelectedService } = useServiceStore();

    const router = useRouter();

    const progress = useProgress();

    const deleteService = useDeleteServico();
    const alterarEstado = useAlterarEstadoServico();

    const handleEdit = (service: ServiceType) => {
        setSelectedService(service);
        progress.start();
        router.push(`/service/form`);
    };

    const handleNewService = () => {
        setSelectedService(null);
        progress.start();
        router.push(`/service/form`);
    };

    const queryClient = useQueryClient();

    const handleDelete = async (service: ServiceType) => {
        setSelectedService(service);
        const confirmed = await alert.confirm('Confirmar', 'Tem certeza que deseja excluir este serviço?', 'Sim', 'Não');
        if (confirmed) {
            setSelectedService(null);
            deleteService.mutate(Number(service.id), {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["servicos"],
                        exact: false,
                    });
                    toast.success('Serviço excluído com sucesso!');
                },
                onError: (error) => {
                    console.error("Erro ao excluir o Serviço:", error);
                },
            });
        }
    };

    const toggleEstado = (servico: ServiceType) => {
        alterarEstado.mutate({
            id: Number(servico.id),
            estado: servico.estado === "ativo" ? "inativo" : "ativo",
        },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["servicos"] });
                    toast.success('Estado alterado com sucesso!');
                },
                onError: (error) => {
                    console.error("Erro ao alterar o estado do cliente:", error);
                }
            }
        );
    };

    const cards = [
        {
            key: "todos",
            title: "Total de Serviços",
            value: data?.total_geral.toString(),
            change: "",
            icon: <ClipboardList className="w-6 h-6 text-primary" />, // lista de serviços
        },
        {
            key: "ativo",
            title: "Serviços Ativos",
            value: data?.total_ativos.toString(),
            change: "",
            icon: <Wrench className="w-6 h-6 text-green-500" />, // serviços em atividade
        },
        {
            key: "inativo",
            title: "Serviços Inativos",
            value: data?.total_inativos.toString(),
            change: "",
            icon: <Ban className="w-6 h-6 text-red-500" />, // serviços suspensos/inativos
        },
    ];


    const servicosFiltrados = useMemo(() => {
        if (selected === "ativo") {
            return data?.data.filter(servico => servico.estado === "ativo");
        } else if (selected === "inativo") {
            return data?.data.filter(servico => servico.estado === "inativo");
        }
        return data?.data;
    }, [selected, data]);

    useEffect(() => {
        setPage(1);
    }, [selected]);


    if (isError) {
        return <div>Erro ao carregar serviços</div>;
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 min-h-[calc(100vh-120px)]">

            <div className="flex justify-start items-center my-4">
                <h1 className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
                    Serviços
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cards.map((stat) => (
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
                        placeholder="Buscar serviços..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <button onClick={handleNewService} className="bg-blue-600 px-4 py-2 rounded-md text-white flex gap-1">
                    <Plus />
                    Novo
                </button>
            </div>

            <TableMain
                data={servicosFiltrados || []}
                isLoading={isLoading}
                emptyMessage="Nenhum serviço encontrado."
                columns={[
                    {
                        header: "Nome",
                        accessor: "nome",
                        width: "20%", // maior espaço pois o nome pode ser longo
                    },
                    {
                        header: "Categoria",
                        accessor: (service) => (
                            <span>{service.categoria?.descricao}</span>
                        ),
                        width: "15%",
                    },
                    {
                        header: "Tipo",
                        accessor: "tipo",
                        width: "10%",
                    },
                    {
                        header: "Valor",
                        accessor: "valor",
                        width: "10%",
                    },
                    {
                        header: "Valor Externo",
                        accessor: "valor_externo",
                        width: "15%",
                    },
                    {
                        header: "Estado",
                        accessor: (service: ServiceType) => <EstadoCell servico={service} />,
                        width: "10%",
                    },
                    {
                        header: "Data",
                        accessor: (term: any) => (
                            <span>{formatarDataLong(term.created_at)}</span>
                        ),
                        width: "10%",
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
                            ];
                            return <DropdownActions actions={actions} />;
                        },
                        width: "10%",
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
        </div>
    );
}