'use client';

//import { PaginationComponent } from "@/components/ui_old/pagination/Pagination";
import { useEffect, useMemo, useState } from "react";
import { ContratoType } from "@/features/contract/types";
import { TableMain } from "@/components/table";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Edit, File, FileText, Info, Loader2, Lock, Plus, Printer, Search, Trash, Unlock, UserCircle2 } from "lucide-react";
import { useContratos, useDeleteContrato } from "@/features/contract/hooks/useContractQuery";
import { gerarPdfContrato, gerarPdfServicosContrato } from "@/lib/utils";
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
import { FormMovimentoSubconta } from "@/features/movimento-subconta/components/FormMovimentoSubconta";
import { useSubcontaStore } from "@/features/subconta/store/useSubcontaStore";
import { SubcontaType } from "@/features/subconta/type";
import { useGetCaixaAbertoByUser } from "@/features/caixa/hooks/useCaixaQuery";
import { alert } from "@/lib/alert";
import { useAuthStore } from "@/store/useAuthStore";
import CaixaDialog from "@/features/caixa/components/CaixaDialog";

export default function SubcontaTable() {

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);

    const debouncedSearch = useDebounce(search, 500);


    const [loadingId, setLoadingId] = useState<number | null>(null);

    // const { selectedCliente, set } = useContratoStore();

    const [selected, setSelected] = useState<"ativos" | "finalizados" | "suspensos" | "cancelados" | "todos">(
        "todos"
    );

    const { user } = useAuthStore();

    const router = useRouter();

    const progress = useProgress();

    const deleteContrato = useDeleteContrato();

    const { idContract } = useParams();

    const acao = "abrir";

    const { data, isLoading, isError } = useSubcontasByContract({ idContract: String(idContract), page, per_page: perPage, search: debouncedSearch, estado: selected === 'todos' ? '' : selected });

    const { setOpenDialogFormMovimentoSubconta } = useMovimentoSubcontaStore();

    const { data: dataCaixa } = useGetCaixaAbertoByUser(Number(user?.id) || 0);

    const [openModalCaixa, setOpenModalCaixa] = useState(false);

    const { setSelectedSubconta } = useSubcontaStore();

    async function handlePdfClick(contrato: ContratoType) {
        try {
            setLoadingId(Number(contrato.id)); // ativa loading só nesse contrato
            await gerarPdfContrato(contrato.id);
        } finally {
            setLoadingId(null); // volta ao normal
        }
    }

    async function handlePdfServicosClick(contrato: ContratoType) {
        try {
            setLoadingId(Number(contrato.id)); // ativa loading só nesse contrato
            await gerarPdfServicosContrato(contrato.id);
        } finally {
            setLoadingId(null); // volta ao normal
        }
    }

    const handleNewContrato = () => {
        progress.start();
        router.push(`/contract/form`);
    };

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

    async function handleOpenDialogAddMov(subconta: SubcontaType) {
        //setSelectedCliente(cliente);

        if (!dataCaixa || dataCaixa?.status !== 'aberto') {
            const confirmed = await alert.confirm("Atenção", "Para adicionar um movimento, é necessário que você tenha um caixa aberto. Deseja abrir o caixa agora?");
            if (confirmed) {
                // router.push('/operation/my-caixa');
                setOpenModalCaixa(true);
            }
            return;
        }

        setSelectedSubconta(subconta);
        setOpenDialogFormMovimentoSubconta(true);
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
                    Subcontas do contrato #{idContract}
                </h1>
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
            </div>

            <TableMain
                data={data?.data || []}
                isLoading={isLoading}
                emptyMessage="Nenhum contrato encontrado."
                columns={[
                    {
                        header: "Nome",
                        accessor: "nome"
                    },
                    {
                        header: "Saldo",
                        accessor: "saldo"
                    },
                    {
                        header: "Especificação",
                        accessor: "especificacao"
                    },
                    // {
                    //     header: "Desconto",
                    //     accessor: "status"
                    // },
                    {
                        header: "Estado",
                        accessor: (subconta) => (
                            <span
                                className={`
      px-3 py-1 rounded-full text-sm font-medium
      ${subconta?.status === "ativo" ? "bg-green-100 text-green-700" :
                                        subconta?.status === "suspenso" ? "bg-yellow-100 text-yellow-700" :
                                            subconta?.status === "finalizado" ? "bg-blue-100 text-blue-700" :
                                                subconta?.status === "cancelado" ? "bg-red-100 text-red-700" :
                                                    "bg-gray-100 text-gray-700"
                                    }
    `}
                            >
                                {subconta?.status || ""}
                            </span>
                        )
                    },
                    // {
                    //     header: "Data",
                    //     accessor: (term: any) => (
                    //         <span>
                    //             {formatarDataLong(term.created_at)}
                    //         </span>
                    //     )
                    // },
                    {
                        header: "Ações",
                        accessor: (subconta) => {
                            const actions = [
                                {
                                    label: "Editar",
                                    icon: <Edit />,
                                    onClick: () => handleEdit(),
                                },
                                {
                                    label: "Excluir",
                                    icon: <Trash />,
                                    onClick: () => handleEdit(),
                                },
                                // {
                                //     label: subconta.status === "ativo" ? "Inativar" : "Ativar",
                                //     icon: subconta.status === "ativo" ? <Lock /> : <Unlock />,
                                //     onClick: () => handleEdit(),
                                // },
                                {
                                    label: "Add Movimento",
                                    icon: <Plus />,
                                    onClick: () => handleOpenDialogAddMov(subconta),
                                },
                                {
                                    label: "Movimentos",
                                    icon: <Info />,
                                    onClick: () => handleMovimento(subconta.id!),
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

            <CaixaDialog
                acao={acao}
                open={openModalCaixa}
                onOpenChange={setOpenModalCaixa}
                dataCaixa={dataCaixa}
            />

            <FormMovimentoSubconta />
        </div>
    );
}