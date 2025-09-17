'use client';

//import { PaginationComponent } from "@/components/ui_old/pagination/Pagination";
import { useState } from "react";
import { TableMain } from "@/components/table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { alert } from "@/lib/alert";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { useDeleteServico, useServicos } from "@/features/service/hooks/useServicesQuery";
import { useTipoServicos } from "@/features/service-type/hooks/useServiceTypeQuery";
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


export default function ServiceTypeTable() {

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);

    const debouncedSearch = useDebounce(search, 500);

    const [selected, setSelected] = useState<"ativos" | "inativos" | "todos">(
        "todos"
    );

    const { data, isLoading, isError } = useTipoServicos({ page, per_page: perPage, search: debouncedSearch });

    const { setSelectedServiceType } = useServiceTypeStore();

    const router = useRouter();

    const progress = useProgress();

    const deleteService = useDeleteServico();

    const handleEdit = (serviceType: ServiceTypeType) => {
        setSelectedServiceType(serviceType);
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

    if (isError) {
        return <div>Erro ao carregar Tipo Serviços</div>;
    }

    const totalServicosAtivo = data?.data.filter(servico => servico.estado === 'ativo').length || 0;
    const totalServicosInativo = data?.data.filter(servico => servico.estado === 'inativo').length || 0;
    const totalServicos = totalServicosAtivo + totalServicosInativo;

    const cards = [
        {
            key: "todos",
            title: "Total de Categoria",
            value: totalServicos.toString(),
            change: "",
            icon: <ClipboardList className="w-6 h-6 text-primary" />, // lista de serviços
        },
        {
            key: "ativos",
            title: "Categoria Ativas",
            value: totalServicosAtivo.toString(),
            change: "",
            icon: <Wrench className="w-6 h-6 text-green-500" />, // serviços em atividade
        },
        {
            key: "inativos",
            title: "Categoria Inativas",
            value: totalServicosInativo.toString(),
            change: "",
            icon: <Ban className="w-6 h-6 text-red-500" />, // serviços suspensos/inativos
        },
    ];

    const tipoServicoFiltrados = useMemo(() => {
        if (selected === "ativos") {
            return data?.data.filter(tipoServico => tipoServico.estado === "ativo");
        } else if (selected === "inativos") {
            return data?.data.filter(tipoServico => tipoServico.estado === "inativo");
        }
        return data?.data;
    }, [selected, data]);

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 min-h-[calc(100vh-120px)]">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cards.map((stat) => (
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
                <h1 className="text-lg text-gray-700 dark:text-gray-300 font-semibold">Tipo de Serviços</h1>
                <Link href="/service-type/form" className="bg-blue-600 px-4 py-1 rounded-md text-white flex gap-1">
                    <Plus />
                    Novo
                </Link>
            </div>
            <div className="my-2 flex justify-start gap-2">
                <Input
                    placeholder='Buscar categorias..'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-1/3"
                />
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
                        header: "Data de Criação",
                        accessor: (term: any) => (
                            <span>
                                {formatarDataLong(term.created_at)}
                            </span>
                        )
                    },
                    {
                        header: "Ações",
                        accessor: (serviceType) => (
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(serviceType)}>
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(serviceType)} >
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