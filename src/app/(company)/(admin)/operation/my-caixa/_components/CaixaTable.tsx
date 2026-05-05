'use client';

import { useState } from "react";
import { Plus, Printer, Search} from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";
import { Input } from "@/components/ui/input";
import { PaginationComponent } from "@/components/pagination/Pagination";
import { TableMain } from "@/components/table";
import Badge from "@/components/ui-old/badge/Badge";
import { useCaixas } from "@/features/caixa/hooks/useCaixaQuery";
import { CaixaType } from "@/features/caixa/types";
import { gerarPdfAberturaCaixa, gerarPdfFechoCaixa } from "@/lib/utils";

export default function CaixaTable() {

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);

    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, isError } = useCaixas(page, perPage, debouncedSearch);

    if (isError) return <div>Erro ao carregar movFinanceiras.</div>;

    return (
        <>

            {/* Barra de busca e botão */}
            {/* <div className="my-4 flex flex-col-reverse md:flex-row items-end md:items-center justify-between gap-2">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Buscar transação..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div> */}

            {/* Tabela */}
            <TableMain
                data={data?.data || []}
                isLoading={isLoading}
                emptyMessage="Nenhuma movFinanceira encontrada."
                columns={[
                    { header: "Abertura", accessor: "data_abertura", width: "20%" },
                    { header: "Fecho", accessor: "data_fecho", width: "20%" },
                    {
                        header: "Saldo Inicial", accessor: (caixa: CaixaType) => (
                            <span>{caixa?.saldo_inicial}</span>
                        ), width: "20%"
                    },
                    {
                        header: "Saldo Final", accessor: (caixa: CaixaType) => (
                            <span>{caixa?.saldo_final}</span>
                        ), width: "20%"
                    },
                    {
                        header: "Estado",
                        accessor: (caixa: CaixaType) => (
                            <Badge color={`${caixa.status === 'aberto' ? 'success' : 'error'}`}>
                                {caixa.status === "aberto" ? "Aberto" : "Fechado"}
                            </Badge>
                        ),
                        width: "20%",
                    },
                {
                    header: "Ações",
                    accessor: (caixa: CaixaType) => (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                title="Imprimir PDF Abertura"
                                onClick={() => gerarPdfAberturaCaixa(caixa.id)}
                                className="inline-flex items-center gap-2 px-2 py-1 border rounded hover:bg-gray-100 hover:text-gray-800 text-sm"
                            >
                                <Printer size={20}/>
                                <span className="sr-only">Abertura (PDF)</span>
                            </button>

                            <button
                                type="button"
                                title="Imprimir PDF Fecho"
                                onClick={() => gerarPdfFechoCaixa(caixa.id)}
                                className="inline-flex items-center gap-2 px-2 py-1 border rounded hover:bg-gray-100 hover:text-gray-800 text-sm"
                            >
                                <Printer size={20}/>
                                <span className="sr-only">Fecho (PDF)</span>
                            </button>
                        </div>
                    ),
                    width: "20%",
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
                    onItemsPerPageChange={(value) => {
                        setPage(1);
                        setPerPage(value);
                    }}
                />
            )}

        </>
    );
}
