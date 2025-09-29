'use client';

//import { PaginationComponent } from "@/components/ui_old/pagination/Pagination";
import { useEffect, useMemo, useState } from "react";
import { ContratoType } from "@/features/contract/types";
import { TableMain } from "@/components/table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { File, FileText, Loader2, Plus, Printer, Search } from "lucide-react";
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

export default function ContractTable() {

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);

    const debouncedSearch = useDebounce(search, 500);


    const [loadingId, setLoadingId] = useState<number | null>(null);

    // const { selectedCliente, set } = useContratoStore();

    const [selected, setSelected] = useState<"ativos" | "finalizados" | "suspensos" | "cancelados" | "todos">(
        "todos"
    );

    const { data, isLoading, isError } = useContratos(page, perPage, debouncedSearch, selected !== 'todos' ? selected : undefined);

    const router = useRouter();

    const progress = useProgress();

    const deleteContrato = useDeleteContrato();

    // const handleEdit = (cliente: ContratoType) => {
    //     //setSelectedCliente(cliente);
    //     router.push(`/client/form`);
    // };

    // const queryClient = useQueryClient();

    // const handleDelete = async (cliente: ContratoType) => {

    //     const confirmed = await alert.confirm('Confirmar', 'Tem certeza que deseja excluir este cliente?', 'Sim', 'Não');

    //     if (confirmed) {

    //         deleteContrato.mutate(cliente.id, {
    //             onSuccess: () => {
    //                 queryClient.invalidateQueries({
    //                     queryKey: ["clientes"],
    //                     exact: false,
    //                 });
    //                 toast.success('Cliente excluído com sucesso!');
    //             },
    //             onError: (error) => {
    //                 console.error("Erro ao excluir a marca:", error);
    //             },
    //         });
    //     }
    // };

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
        return <div>Erro ao carregar contratos</div>;
    }


    const stats = [
        {
            key: "todos",
            title: "Total de Contratos",
            value: data?.total_geral.toString(),
            change: "",
            icon: <FileText className="w-6 h-6 text-primary" />,
        },
        {
            key: "ativos",
            title: "Contratos Ativos",
            value: data?.total_ativos.toString(),
            change: "",
            icon: <FileText className="w-6 h-6 text-green-500" />, // Ativo → confirmado
        },
        {
            key: "finalizados",
            title: "Contratos Finalizados",
            value: data?.total_finalizados.toString(),
            change: "",
            icon: <CheckCircle2 className="w-6 h-6 text-blue-500" />, // Finalizado → concluído
        },
        {
            key: "suspensos",
            title: "Contratos Suspensos",
            value: data?.total_suspensos.toString(),
            change: "",
            icon: <PauseCircle className="w-6 h-6 text-yellow-500" />, // Suspenso → pausado
        },
        {
            key: "cancelados",
            title: "Contratos Cancelados",
            value: data?.total_cancelados.toString(),
            change: "",
            icon: <XCircle className="w-6 h-6 text-red-500" />, // Cancelado → erro/cancelado
        },
    ];

    const contratosFiltrados = useMemo(() => {
        if (selected === "ativos") {
            return data?.data.filter(cliente => cliente.estado === "ativo");
        } else if (selected === "finalizados") {
            return data?.data.filter(cliente => cliente.estado === "finalizado");
        } else if (selected === "suspensos") {
            return data?.data.filter(cliente => cliente.estado === "suspenso");
        } else if (selected === "cancelados") {
            return data?.data.filter(cliente => cliente.estado === "cancelado");
        }
        return data?.data;
    }, [selected, data]);

    useEffect(() => {
        setPage(1);
    }, [selected]);


    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 min-h-[calc(100vh-120px)]">

            <div className="flex justify-start items-center my-4">
                <h1 className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
                    Contratos
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
                <button onClick={handleNewContrato} className="bg-blue-600 px-4 py-2 rounded-md text-white flex gap-1">
                    <Plus />
                    Novo
                </button>
            </div>

            <TableMain
                data={contratosFiltrados || []}
                isLoading={isLoading}
                emptyMessage="Nenhum contrato encontrado."
                columns={[
                    {
                        header: "Cliente",
                        accessor: "cliente_nome"
                    },
                    {
                        header: "Valor por Pagar",
                        accessor: "valor_por_pagar"
                    },
                    // {
                    //     header: "Valor Pago",
                    //     accessor: "valor_pago"
                    // },
                    // {
                    //     header: "Tipo de Pagamento",
                    //     accessor: "tipo_pagamento"
                    // },
                    {
                        header: "Desconto",
                        accessor: "desconto"
                    },
                    {
                        header: "Estado",
                        accessor: (contrato) => (
                            <span
                                className={`
      px-3 py-1 rounded-full text-sm font-medium
      ${contrato?.estado === "ativo" ? "bg-green-100 text-green-700" :
                                        contrato?.estado === "suspenso" ? "bg-yellow-100 text-yellow-700" :
                                            contrato?.estado === "finalizado" ? "bg-blue-100 text-blue-700" :
                                                contrato?.estado === "cancelado" ? "bg-red-100 text-red-700" :
                                                    "bg-gray-100 text-gray-700"
                                    }
    `}
                            >
                                {contrato?.estado || ""}
                            </span>
                        )
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
                        accessor: (contrato) => (
                            <div className="flex gap-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            className="cursor-pointer"
                                            onClick={() => handlePdfClick(contrato)}
                                            disabled={loadingId === contrato.id} // opcional: desativa botão
                                        >
                                            {loadingId === contrato.id ? (
                                                <Loader2 className="animate-spin" />
                                            ) : (
                                                <File />
                                            )}
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Imprimir Contrato</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            className="cursor-pointer"
                                            onClick={() => handlePdfServicosClick(contrato)}
                                            disabled={loadingId === contrato.id} // opcional: desativa botão
                                        >
                                            {loadingId === contrato.id ? (
                                                <Loader2 className="animate-spin" />
                                            ) : (
                                                <Printer />
                                            )}
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Imprimir Serviços do Contrato</p>
                                    </TooltipContent>
                                </Tooltip>
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