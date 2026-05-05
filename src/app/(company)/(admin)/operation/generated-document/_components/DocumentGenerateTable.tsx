"use client";

import { TableMain } from "@/components/table";
import { Input } from "@/components/ui/input";
import { PaginationComponent } from "@/components/pagination/Pagination";
import { useListDocumentPOS } from "@/features/pos/hooks/usePOSQuery";
import { ChevronLeft, Loader2, Plus, Printer, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProgress } from "@bprogress/next";
import { useState } from "react";
import { formatarDataHora, formatarDataLong, formatarMoeda } from "@/lib/helpers";
import Link from "next/link";
import { gerarPdfMovimentoSubcontaByPOS } from "@/lib/utils";
import { useDebounce } from "@uidotdev/usehooks";


export function DocumentGenerateTable() {

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);

    const debouncedSearch = useDebounce(search, 500); // Implementar debounce se necessário

    const [loadingPrintId, setLoadingPrintId] = useState<number | string>("");

    const { data: documents, isLoading, isError } = useListDocumentPOS(page, perPage, debouncedSearch);

    const router = useRouter();
    const progress = useProgress();

    function handleBack() {
        progress.start();
        router.back();
    }

    async function handlePrintDocument(documentId: number) {
        setLoadingPrintId(documentId);
        await gerarPdfMovimentoSubcontaByPOS(documentId);
        setLoadingPrintId("");
    }

    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }

    if (isError) {
        return <div>Error loading documents.</div>;
    }

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
                    Documentos Gerado no POS
                </h1>
            </div>

            {/* Barra de busca e botão */}
            <div className="my-4 flex flex-col-reverse md:flex-row items-end md:items-center justify-between gap-2">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Buscar documento..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Link
                    href={'/pos'}
                    className="bg-blue-600 px-4 py-2 rounded-md text-white flex gap-1"
                >
                    <Plus /> Novo Documento
                </Link>
            </div>

            {/* Tabela */}
            <TableMain
                data={documents?.data || []}
                isLoading={isLoading}
                emptyMessage="Nenhum documento encontrado."
                columns={[
                    { header: "Documento", accessor: "tipo_documento", width: "20%" },
                    { header: "Cliente", accessor: "nome_cliente", width: "20%" },
                    { header: "Forma de pagamento", accessor: "forma_pagamento", width: "10%" },
                    {
                        header: "Total",
                        accessor: (doc: any) => (
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                {formatarMoeda(Number(doc.valor_total))}
                            </span>
                        ),
                        width: "15%",
                    },
                    {
                        header: "Data",
                        accessor: (doc: any) => <span>{formatarDataLong(doc.created_at)}</span>,
                        width: "20%",
                    },
                    {
                        header: "Ações",
                        accessor: (doc: any) => (
                            <button onClick={() => handlePrintDocument(doc.id)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/10">
                                {
                                    loadingPrintId === doc.id ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <Printer size={18} className="text-gray-600 dark:text-gray-300 hover:text-gray-800" />
                                    )
                                }
                            </button>
                        ),
                        width: "15%",
                    }
                ]}
            />

            {/* Paginação */}
            {documents && (
                <PaginationComponent
                    currentPage={documents?.current_page}
                    itemsPerPage={documents?.per_page}
                    totalItems={documents?.total}
                    lastPage={documents?.last_page}
                    onPageChange={setPage}
                    onItemsPerPageChange={(value) => {
                        setPage(1);
                        setPerPage(value);
                    }}
                />
            )}

        </div>
    )
}