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

export default function ServiceTable() {

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);

    const debouncedSearch = useDebounce(search, 500);

    const [selected, setSelected] = useState<"ativos" | "inativos" | "todos">(
        "todos"
    );

    const { data, isLoading, isError } = useServicos({page, per_page: perPage , search: debouncedSearch});

    const { setSelectedService } = useServiceStore();

    const router = useRouter();

    const progress = useProgress();

    const deleteService = useDeleteServico();

    const handleEdit = (service: ServiceType) => {
        setSelectedService(service);
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

    if (isError) {
        return <div>Erro ao carregar Serviços</div>;
    }

    const totalServicosAtivo = data?.data.filter(servico => servico.estado === 'ativo').length || 0;
    const totalServicosInativo = data?.data.filter(servico => servico.estado === 'inativo').length || 0;
    const totalServicos = totalServicosAtivo + totalServicosInativo;

    const cards = [
        {
            key: "todos",
            title: "Total de Serviços",
            value: totalServicos.toString(),
            change: "",
            icon: <ClipboardList className="w-6 h-6 text-primary" />, // lista de serviços
        },
        {
            key: "ativos",
            title: "Serviços Ativos",
            value: totalServicosAtivo.toString(),
            change: "",
            icon: <Wrench className="w-6 h-6 text-green-500" />, // serviços em atividade
        },
        {
            key: "inativos",
            title: "Serviços Inativos",
            value: totalServicosInativo.toString(),
            change: "",
            icon: <Ban className="w-6 h-6 text-red-500" />, // serviços suspensos/inativos
        },
    ];


    const servicosFiltrados = useMemo(() => {
        if (selected === "ativos") {
            return data?.data.filter(servico => servico.estado === "ativo");
        } else if (selected === "inativos") {
            return data?.data.filter(servico => servico.estado === "inativo");
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
                <h1 className="text-lg text-gray-700 dark:text-gray-300 font-semibold">Serviços</h1>
                <Link href="/service/form" className="bg-blue-600 px-4 py-1 rounded-md text-white flex gap-1">
                    <Plus />
                    Novo
                </Link>
            </div>
            <div className="my-2 flex justify-start gap-2">
                <Input
                    placeholder='Buscar serviço..'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-1/3"
                />
            </div>
            <TableMain
                data={servicosFiltrados || []}
                isLoading={isLoading}
                emptyMessage="Nenhum serviço encontrado."
                columns={[
                    {
                        header: "Nome",
                        accessor: "nome"
                    },
                    {
                        header: "Categoria",
                        accessor: (service) => (
                            <span>
                                {service.categoria?.descricao}
                            </span>
                        )
                    },
                    {
                        header: "Tipo",
                        accessor: "tipo"
                    },
                    {
                        header: "Valor",
                        accessor: "valor"
                    },
                    {
                        header: "Valor Externo",
                        accessor: "valor_externo"
                    },
                    {
                        header: "Estado",
                        accessor: (service: ServiceType) => <EstadoCell servico={service} />,
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