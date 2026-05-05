'use client';

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Plus, Search, Banknote, Lock, Unlock, Info, Edit, Trash, ChevronLeft } from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";
import { useProgress } from "@bprogress/next";

import { Input } from "@/components/ui/input";
import { PaginationComponent } from "@/components/pagination/Pagination";
import { StatCard } from "@/components/StatCard/stat-card";
import { TableMain } from "@/components/table";
import { alert } from "@/lib/alert";
import { formatarDataLong, formatarMoeda } from "@/lib/helpers";

import { DropdownActions } from "@/components/dropdown-action-menu/drop-actions-menu";
import LoadingDialog from "@/app/(full-width-pages)/pos/_components/LoadingDialog";
import { useDeleteMovFinanceira, useMovFinanceiras } from "@/features/movimentacoes-financeiras/hooks/movFinanceirasQuery";
import { MovimentacoesFinanceirasType } from "@/features/movimentacoes-financeiras/types";
import Badge from "@/components/ui-old/badge/Badge";

export default function MovFinanceiraTable() {

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);

    const debouncedSearch = useDebounce(search, 500);

    const [selected, setSelected] = useState<"entrada" | "saida" | "todos">("todos");

    const { data, isLoading, isError } = useMovFinanceiras(page, perPage, debouncedSearch);
    const deleteMovFinanceira = useDeleteMovFinanceira();

    const queryClient = useQueryClient();
    const router = useRouter();
    const progress = useProgress();

    // 🧩 Ações
    const handleEdit = (movFinanceira: MovimentacoesFinanceirasType) => {

        progress.start();
        router.push(`/operation/mov-financeiras/form`);
    };

    const handleNewMovFinanceira = () => {

        progress.start();
        router.push(`/operation/mov-financeiras/form`);
    };

    const handleDelete = async (movFinanceira: MovimentacoesFinanceirasType) => {

        const confirmed = await alert.confirm(
            'Confirmar',
            'Tem certeza que deseja excluir esta movFinanceira?',
            'Sim',
            'Não'
        );
        if (confirmed) {
            deleteMovFinanceira.mutate(Number(movFinanceira.id), {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["mov-financeiras"] });
                    toast.success('Transação excluída com sucesso!');
                },
                onError: (error: any) => {
                    console.error("Erro ao excluir Transação:", error);
                },
            });
        }
    };

    // 📊 Estatísticas
    const stats = [
        {
            key: "entrada",
            title: "Total de Entradas",
            value: formatarMoeda(Number(data?.total_entradas) ?? 0),
            change: "",
            icon: <Banknote className="w-6 h-6 text-blue-600" />,
        },
        {
            key: "saida",
            title: "Total de Saídas",
            value: formatarMoeda(Number(data?.total_saidas) ?? 0),
            change: "",
            icon: <Banknote className="w-6 h-6 text-red-600" />,
        },
        {
            key: "todos",
            title: "Saldo",
            value: formatarMoeda(Number(data?.total_saldo) ?? 0),
            change: "",
            icon: <Banknote className="w-6 h-6 text-green-600" />,
        },
    ];

    // 🔍 Filtro de estado
    const movFinanceirasFiltradas = useMemo(() => {
        if (selected === "entrada") {
            return data?.data.filter(movFinanceira => movFinanceira.tipo === "entrada");
        } else if (selected === "saida") {
            return data?.data.filter(movFinanceira => movFinanceira.tipo === "saida");
        }
        return data?.data;
    }, [selected, data]);

    function handleBack() {
        progress.start();
        router.back();
    }

    useEffect(() => {
        setPage(1);
    }, [selected]);

    if (isError) return <div>Erro ao carregar movFinanceiras.</div>;

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 min-h-[calc(100vh-130px)]">

            <div className="flex justify-start">
                <span onClick={handleBack} className="text-blue-600 cursor-pointer flex items-center ga-2">
                    <ChevronLeft size={18} />
                    <span>Voltar</span>
                </span>
            </div>

            <div className="flex justify-start items-center my-4">
                <h1 className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
                    Transações Financeiras
                </h1>
            </div>

            {/* Cards de Estatísticas */}
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

            {/* Barra de busca e botão */}
            <div className="my-4 flex flex-col-reverse md:flex-row items-end md:items-center justify-between gap-2">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Buscar transação..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <button
                    onClick={handleNewMovFinanceira}
                    className="bg-blue-600 px-4 py-2 rounded-md text-white flex gap-1"
                >
                    <Plus /> Nova Transação
                </button>
            </div>

            {/* Tabela */}
            <TableMain
                data={movFinanceirasFiltradas || []}
                isLoading={isLoading}
                emptyMessage="Nenhuma Movimentação Financeira Encontrada."
                columns={[
                    { header: "Descrição", accessor: "descricao", width: "20%" },
                    {
                        header: "Conta", accessor: (movFinanceira: any) => (
                            <span>{movFinanceira?.conta_financeira.nome}</span>
                        ), width: "20%"
                    },

                    {
                        header: "Tipo",
                        accessor: (movFinanceira: MovimentacoesFinanceirasType) => (
                            movFinanceira.tipo == 'entrada' ?
                                <Badge color="success">Receita</Badge>
                                : <Badge color="error">Despesa</Badge>
                        ),
                        width: "15%",
                    },
                    {
                        header: "Valor",
                        accessor: (movFinanceira: MovimentacoesFinanceirasType) => (
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                {Number(movFinanceira.valor).toLocaleString("pt-PT", {
                                    style: "currency",
                                    currency: "AOA",
                                })}
                            </span>
                        ),
                        width: "15%",
                    },
                    {
                        header: "Data",
                        accessor: (term: any) => <span>{formatarDataLong(term.created_at)}</span>,
                        width: "20%",
                    },
                    {
                        header: "Ações",
                        accessor: (movFinanceira: MovimentacoesFinanceirasType) => {
                            const actions = [
                                { label: "Editar", icon: <Edit />, onClick: () => handleEdit(movFinanceira) },
                                { label: "Excluir", icon: <Trash />, onClick: () => handleDelete(movFinanceira) },

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
                    onItemsPerPageChange={(value) => {
                        setPage(1);
                        setPerPage(value);
                    }}
                />
            )}

        </div>
    );
}
