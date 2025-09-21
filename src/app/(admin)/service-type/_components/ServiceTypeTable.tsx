'use client';

//import { PaginationComponent } from "@/components/ui_old/pagination/Pagination";
import { useState } from "react";
import { TableMain } from "@/components/table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { alert } from "@/lib/alert";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Edit, Lock, Plus, Search, Trash, Unlock } from "lucide-react";
import { useDeleteServico, useServicos } from "@/features/service/hooks/useServicesQuery";
import { useAlterarEstadoServicoType, useDeleteTipoServico, useTipoServicos } from "@/features/service-type/hooks/useServiceTypeQuery";
import { useServiceTypeStore } from "@/features/service-type/store/useServiceTypeStore";
import { ServiceTypeType } from "@/features/service-type/types";
import { useProgress } from "@bprogress/next";
import { formatarDataLong } from "@/lib/helpers";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@uidotdev/usehooks";
import { PaginationComponent } from "@/components/pagination/Pagination";
import { EstadoCell } from "@/features/service-type/components/EstadoCell";
import { useMemo } from "react";
import { ClipboardList, Wrench, Ban } from "lucide-react";
import { StatCard } from "@/components/StatCard/stat-card";
import { DropdownActions } from "@/components/dropdown-action-menu/drop-actions-menu";


export default function ServiceTypeTable() {

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);

    const debouncedSearch = useDebounce(search, 500);

    const [selected, setSelected] = useState<"ativo" | "inativo" | "todos">(
        "todos"
    );

    const { data, isLoading, isError } = useTipoServicos({ page, per_page: perPage, search: debouncedSearch, estado: selected !== 'todos' ? selected : '' });

    const { setSelectedServiceType } = useServiceTypeStore();

    const router = useRouter();

    const progress = useProgress();

    const deleteService = useDeleteTipoServico();
    const alterarEstado = useAlterarEstadoServicoType();

    const handleEdit = (serviceType: ServiceTypeType) => {
        setSelectedServiceType(serviceType);
        progress.start();
        router.push(`/service-type/form`);
    };

    const handleNewServiceType = () => {
        setSelectedServiceType(null);
        progress.start();
        router.push(`/service-type/form`);
    };


    const queryClient = useQueryClient();

    const handleDelete = async (serviceType: ServiceTypeType) => {
        setSelectedServiceType(serviceType);
        const confirmed = await alert.confirm('Confirmar', 'Tem certeza que deseja excluir este tipo de serviço?', 'Sim', 'Não');
        if (confirmed) {
            setSelectedServiceType(null);
            deleteService.mutate(Number(serviceType.id), {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["tipo-servicos"],
                        exact: false,
                    });
                    toast.success('Tipo de Serviço excluído com sucesso!');
                },
                onError: (error) => {
                    console.error("Erro ao excluir o Serviço:", error);
                },
            });
        }
    };

    const toggleEstado = (servicoType: ServiceTypeType) => {
        alterarEstado.mutate({
            id: Number(servicoType.id),
            estado: servicoType.estado === "ativo" ? "inativo" : "ativo",
        },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["tipo-servicos"] });
                    toast.success('Estado alterado com sucesso!');
                },
                onError: (error) => {
                    console.error("Erro ao alterar o estado do cliente:", error);
                }
            }
        );
    };

    if (isError) {
        return <div>Erro ao carregar Tipo Serviços</div>;
    }

    const cards = [
        {
            key: "todos",
            title: "Total de Categoria",
            value: data?.total_geral.toString(),
            change: "",
            icon: <ClipboardList className="w-6 h-6 text-primary" />, // lista de serviços
        },
        {
            key: "ativo",
            title: "Categoria Ativas",
            value: data?.total_ativos.toString(),
            change: "",
            icon: <Wrench className="w-6 h-6 text-green-500" />, // serviços em atividade
        },
        {
            key: "inativo",
            title: "Categoria Inativas",
            value: data?.total_inativos.toString(),
            change: "",
            icon: <Ban className="w-6 h-6 text-red-500" />, // serviços suspensos/inativos
        },
    ];

    const tipoServicoFiltrados = useMemo(() => {
        if (selected === "ativo") {
            return data?.data.filter(tipoServico => tipoServico.estado === "ativo");
        } else if (selected === "inativo") {
            return data?.data.filter(tipoServico => tipoServico.estado === "inativo");
        }
        return data?.data;
    }, [selected, data]);

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 min-h-[calc(100vh-120px)]">

            <div className="flex justify-start items-center my-4">
                <h1 className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
                    Categoria de Serviços
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
                        placeholder="Buscar cliente..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <button onClick={handleNewServiceType} className="bg-blue-600 px-4 py-2 rounded-md text-white flex gap-1">
                    <Plus />
                    Novo
                </button>
            </div>


            <TableMain
                data={tipoServicoFiltrados || []}
                isLoading={isLoading}
                emptyMessage="Nenhum tipo de serviço encontrado."
                columns={[
                    {
                        header: "Nome",
                        accessor: "descricao"
                    },
                    {
                        header: "Estado",
                        accessor: (serviceType: ServiceTypeType) => <EstadoCell servicoType={serviceType} />,
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
                        accessor: (servicoType) => {

                            const actions = [
                                {
                                    label: "Editar",
                                    icon: <Edit />,
                                    onClick: () => handleEdit(servicoType),
                                },
                                {
                                    label: "Excluir",
                                    icon: <Trash />,
                                    onClick: () => handleDelete(servicoType),
                                },
                                {
                                    label: servicoType.estado === "ativo" ? "Inativar" : "Ativar",
                                    icon: servicoType.estado === "ativo" ? <Lock /> : <Unlock />,
                                    onClick: () => toggleEstado(servicoType),
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
        </div>
    );
}