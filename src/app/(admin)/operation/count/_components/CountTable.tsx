'use client';

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Plus, Search, Banknote, Lock, Unlock, Info, Edit, Trash, ChevronLeft, File } from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";
import { useProgress } from "@bprogress/next";

import { Input } from "@/components/ui/input";
import { PaginationComponent } from "@/components/pagination/Pagination";
import { StatCard } from "@/components/StatCard/stat-card";
import { TableMain } from "@/components/table";
import { alert } from "@/lib/alert";
import { formatarDataLong, formatarMoeda } from "@/lib/helpers";

import { DropdownActions } from "@/components/dropdown-action-menu/drop-actions-menu";

// 🧾 Hooks específicos de Contas
import { CountType } from "@/features/count/types";
import { useCountStore } from "@/features/count/store/useCountStore";
import { useAlterarEstadoCount, useCounts, useDeleteCount } from "@/features/count/hooks/useCountQuery";
import LoadingDialog from "@/app/(full-width-pages)/pos/_components/LoadingDialog";
import { EstadoCell } from "@/features/count/components/EstadoCell";
import { RelatorioIntervaloDialog } from "./RelatorioIntervaloDialog";
import { gerarRelatorioContaFinanceira } from "@/lib/utils";

export default function CountTable() {

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);
    const [selected, setSelected] = useState<"ativo" | "inativo" | "todos">("todos");

    const debouncedSearch = useDebounce(search, 500);
    const { setSelectedCount, selectedCount } = useCountStore();

    const [openDialogRelInt, setOpenDialogRelInt] = useState(false);
    const [loadingRelatorio, setLoadingRelatorio] = useState(false);

    const { data, isLoading, isError } = useCounts(page, perPage, debouncedSearch, selected !== 'todos' ? selected : '');
    const deleteConta = useDeleteCount();
    const alterarEstado = useAlterarEstadoCount();

    const queryClient = useQueryClient();
    const router = useRouter();
    const progress = useProgress();

    // 🧩 Ações
    const handleEdit = (conta: CountType) => {
        setSelectedCount(conta);
        progress.start();
        router.push(`/operation/count/form`);
    };

    const handleNewConta = () => {
        setSelectedCount(null);
        progress.start();
        router.push(`/operation/count/form`);
    };

    const handleDelete = async (conta: CountType) => {
        setSelectedCount(conta);
        const confirmed = await alert.confirm(
            'Confirmar',
            'Tem certeza que deseja excluir esta conta?',
            'Sim',
            'Não'
        );
        if (confirmed) {
            deleteConta.mutate(Number(conta.id), {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["contas"] });
                    toast.success('Conta excluída com sucesso!');
                },
                onError: (error: any) => {
                    console.error("Erro ao excluir conta:", error);
                },
            });
        }
    };

    const toggleEstado = (conta: CountType) => {
        alterarEstado.mutate(
            {
                id: Number(conta.id),
                estado: conta.estado === "ativo" ? "inativo" : "ativo",
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["contas"] });
                    toast.success('Estado alterado com sucesso!');
                },
                onError: (error: any) => {
                    console.error("Erro ao alterar estado da conta:", error);
                },
            }
        );
    };


    // 📊 Estatísticas
    const stats = [
        {
            key: "todos",
            title: "Total de Contas",
            value: data?.total_geral?.toString() ?? "0",
            change: "",
            icon: <Banknote className="w-6 h-6 text-blue-600" />,
        },
        {
            key: "ativo",
            title: "Contas Ativas",
            value: data?.total_ativos?.toString() ?? "0",
            change: "",
            icon: <Unlock className="w-6 h-6 text-green-600" />,
        },
        {
            key: "inativo",
            title: "Contas Inativas",
            value: data?.total_inativos?.toString() ?? "0",
            change: "",
            icon: <Lock className="w-6 h-6 text-red-600" />,
        },
    ];

    // 🔍 Filtro de estado
    const contasFiltradas = useMemo(() => {
        if (selected === "ativo") {
            return data?.data.filter(conta => conta.estado === "ativo");
        } else if (selected === "inativo") {
            return data?.data.filter(conta => conta.estado === "inativo");
        }
        return data?.data;
    }, [selected, data]);

    function handleBack() {
        progress.start();
        router.back();
    }

    async function handleGerarRelatorio(datas: { data_inicial: string; data_final: string }) {
        try {
            setLoadingRelatorio(true);
            await gerarRelatorioContaFinanceira(
                Number(selectedCount?.id),
                datas.data_inicial,
                datas.data_final
            );
        } catch (error) {
            console.error("Erro ao gerar relatório:", error);
            toast.error("Erro ao gerar relatório.");
        } finally {
            setLoadingRelatorio(false);
            setOpenDialogRelInt(false);
        }
    };

    useEffect(() => {
        setPage(1);
    }, [selected]);

    if (isError) return <div>Erro ao carregar contas.</div>;
    if (alterarEstado.isPending) return <LoadingDialog />;

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
                    Contas Financeiras
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
                        placeholder="Buscar conta..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <button
                    onClick={handleNewConta}
                    className="bg-blue-600 px-4 py-2 rounded-md text-white flex gap-1"
                >
                    <Plus /> Nova Conta
                </button>
            </div>

            {/* Tabela */}
            <TableMain
                data={contasFiltradas || []}
                isLoading={isLoading}
                emptyMessage="Nenhuma conta encontrada."
                columns={[
                    { header: "Descrição", accessor: "nome", width: "20%" },
                    { header: "IBAN", accessor: "iban", width: "20%" },
                    { header: "Tipo", accessor: "tipo", width: "10%" },
                    {
                        header: "Total Entradas",
                        accessor: (conta: CountType) => (
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                {formatarMoeda(Number(conta.total_entradas))}
                            </span>
                        ),
                        width: "15%",
                    },
                    {
                        header: "Total Saídas",
                        accessor: (conta: CountType) => (
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                {formatarMoeda(Number(conta.total_saidas))}
                            </span>
                        ),
                        width: "15%",
                    },
                    {
                        header: "Saldo",
                        accessor: (conta: CountType) => (
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                {formatarMoeda(Number(conta.saldo_atual))}
                            </span>
                        ),
                        width: "15%",
                    },
                    {
                        header: "Estado",
                        accessor: (conta: CountType) => <EstadoCell conta={conta} />,
                        width: "15%",
                    },
                    {
                        header: "Data",
                        accessor: (term: any) => <span>{formatarDataLong(term.created_at)}</span>,
                        width: "20%",
                    },
                    {
                        header: "Ações",
                        accessor: (conta: CountType) => {
                            const actions = [
                                { label: "Editar", icon: <Edit />, onClick: () => handleEdit(conta) },
                                { label: "Excluir", icon: <Trash />, onClick: () => handleDelete(conta) },
                                {
                                    label: conta.estado === "ativo" ? "Inativar" : "Ativar",
                                    icon: conta.estado === "ativo" ? <Lock /> : <Unlock />,
                                    onClick: () => toggleEstado(conta),
                                },
                            ];
                            return (
                                <div className="flex gap-2">
                                    <DropdownActions actions={actions} />
                                    <button title="Imprimir relatorio da conta"
                                        onClick={() => {
                                            setSelectedCount(conta);
                                            setOpenDialogRelInt(true);
                                        }}
                                    ><File size={20} /></button>
                                </div>
                            );
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

            <RelatorioIntervaloDialog
                open={openDialogRelInt}
                onOpenChange={setOpenDialogRelInt}
                onGerarRelatorio={handleGerarRelatorio}
                isLoading={loadingRelatorio}
            />

        </div>
    );
}
