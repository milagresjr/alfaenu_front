'use client';

//import { PaginationComponent } from "@/components/ui_old/pagination/Pagination";
import { useEffect, useMemo, useState } from "react";
import { ContratoType } from "@/features/contract/types";
import { TableMain } from "@/components/table";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Edit, File, FileText, Info, Loader2, Lock, Plus, Printer, Search, Trash, Unlock, UserCircle2 } from "lucide-react";
import { useContratos, useDeleteContrato } from "@/features/contract/hooks/useContractQuery";
import { gerarPdfContrato, gerarPdfMovimentoSubconta, gerarPdfServicosContrato } from "@/lib/utils";
import { formatarDataLong } from "@/lib/helpers";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@uidotdev/usehooks";
import { PaginationComponent } from "@/components/pagination/Pagination";
import { Users, UserCheck, CheckCircle2, PauseCircle, XCircle } from "lucide-react";
import { StatCard } from "@/components/StatCard/stat-card";
import { useProgress } from "@bprogress/next";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSubcontas, useSubcontasByContract } from "@/features/subconta/hooks/useSubcontaQuery";
import { DropdownActions } from "@/components/dropdown-action-menu/drop-actions-menu";
import { useMovimentoSubcontaStore } from "@/features/movimento-subconta/store/useMovimentoSubcontaStore";
import { useMovimentos, useMovimentosBySubconta } from "@/features/movimento-subconta/hooks/useMovimentosQuery";
import { FormMovimentoSubconta } from "@/features/movimento-subconta/components/FormMovimentoSubconta";
import Badge from "@/components/ui-old/badge/Badge";

export default function MovimentsTable() {

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);

    const debouncedSearch = useDebounce(search, 500);


    const [loadingId, setLoadingId] = useState<number | null>(null);

    // const { selectedCliente, set } = useContratoStore();

    const [selected, setSelected] = useState<"ativos" | "finalizados" | "suspensos" | "cancelados" | "todos">(
        "todos"
    );


    const router = useRouter();

    const progress = useProgress();

    const deleteContrato = useDeleteContrato();

    const { idContract, idSubconta } = useParams();

    const { data, isLoading, isError } = useMovimentosBySubconta({ idSubconta: String(idSubconta), page, per_page: perPage, search: debouncedSearch, filters: {} });

    const { openDialogFormMovimentoSubconta, setOpenDialogFormMovimentoSubconta } = useMovimentoSubcontaStore();

    const [loadingPrint,setLoadingPrint] = useState(false);


    async function handlePrintClick(idMovimento: number) {
        try {
            setLoadingId(Number(idMovimento)); // ativa loading só nesse movimento
            await gerarPdfMovimentoSubconta(idMovimento);
        } finally {
            setLoadingId(null); // volta ao normal
        }
    }

    if (isError) {
        return <div>Erro ao carregar subcontas</div>;
    }


    useEffect(() => {
        setPage(1);
    }, [selected]);

    function handleEdit() {
        //setSelectedCliente(cliente);
        router.push(`/admin/contract/${idContract}/subconta/form`);
    }

    function handleMovimento(subconta: number) {
        //setSelectedCliente(cliente);
        progress.start();
        router.push(`/contract/${idContract}/subcontas/${subconta}/moviments`);
    }

    function handleBack() {
        progress.start();
        router.back();
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 min-h-[calc(100vh-120px)]">

            <div className="flex justify-start">
                <span onClick={handleBack} className="text-blue-600 cursor-pointer flex items-center ga-2">
                    <ChevronLeft size={18} />
                    <span>Voltar</span>
                </span>
            </div>

            <div className="flex justify-start items-center my-4">
                <h1 className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
                    Movimentos da subcontas #{idSubconta}
                </h1>
            </div>

            <div className="my-4 flex items-center justify-between gap-2">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Buscar movimento..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <button onClick={() => setOpenDialogFormMovimentoSubconta(true)} className="bg-blue-600 px-4 py-2 rounded-md text-white flex gap-1">
                    <Plus />
                    Add Movimento
                </button>
            </div>

            <TableMain
                data={data?.data || []}
                isLoading={isLoading}
                emptyMessage="Nenhum movimento encontrado."
                columns={[
                    {
                        header: "Nome",
                        accessor: (mov) => (
                            <span>
                                {mov.subconta?.nome}
                            </span>
                        )
                    },
                    {
                        header: "Tipo de Movimento",
                        accessor: (mov) => (
                            <Badge color={(mov.tipo === 'entrada') ? 'success' : 'error'}>
                                {mov.tipo === 'entrada' ? 'Entrada' : 'Saida'}
                            </Badge>
                        )
                    },
                    {
                        header: "Valor",
                        accessor: "valor"
                    },
                    {
                        header: "Descrição",
                        accessor: "descricao"
                    },
                    {
                        header: "Data",
                        accessor: (mov) => (
                            <span>
                                {formatarDataLong(String(mov.created_at))}
                            </span>
                        )
                    },
                    {
                        header: "Ações",
                        accessor: (movimento) => {
                            const actions = [
                                // {
                                //     label: "Editar",
                                //     icon: <Edit />,
                                //     onClick: () => handleEdit(),
                                // },
                                {
                                    label: "Excluir",
                                    icon: <Trash />,
                                    onClick: () => handleEdit(),
                                },
                                {
                                    label: `${loadingId === movimento.id ? 'Imprimindo...' : 'Imprimir'}`,
                                    icon: <Printer />,
                                    onClick: () => handlePrintClick(movimento.id!),
                                },
                            ];
                            return <DropdownActions actions={actions} />
                        }

                    }
                ]}
            />

            {/* Paginação */}
            {( data && data.total > 10) && (
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

            <FormMovimentoSubconta />
        </div>
    );
}