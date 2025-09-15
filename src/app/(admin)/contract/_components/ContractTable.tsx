'use client';

//import { PaginationComponent } from "@/components/ui_old/pagination/Pagination";
import { useState } from "react";
import { ContratoType } from "@/features/contract/types";
import { TableMain } from "@/components/table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { File, Loader2, Plus } from "lucide-react";
import { useContratos, useDeleteContrato } from "@/features/contract/hooks/useContractQuery";
import { gerarPdfContrato } from "@/lib/utils";

export default function ContractTable() {

    // const [search, setSearch] = useState('')
    // const [page, setPage] = useState(1);
    // const [perPage, setPerPage] = useState(15);

    //const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, isError } = useContratos();

    const [loadingId, setLoadingId] = useState<number | null>(null);

    // const { selectedCliente, set } = useContratoStore();

    const router = useRouter();

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

    if (isError) {
        return <div>Erro ao carregar contratos</div>;
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 h-[calc(100vh-120px)]">
            <div className="flex justify-between items-center my-2">
                <h1 className="text-lg text-gray-700 dark:text-gray-300 font-semibold">Contratos</h1>
                <Link href="/contract/form" className="bg-blue-600 px-4 py-1 rounded-md text-white flex gap-1">
                    <Plus />
                    Novo Contrato
                </Link>
            </div>
            <TableMain
                data={data?.data || []}
                isLoading={isLoading}
                emptyMessage="Nenhum cliente encontrado."
                columns={[
                    {
                        header: "Cliente",
                        accessor: "cliente_nome"
                    },
                    {
                        header: "Valor por Pagar",
                        accessor: "valor_por_pagar"
                    },
                    {
                        header: "Valor Pago",
                        accessor: "valor_pago"
                    },
                    {
                        header: "Tipo de Pagamento",
                        accessor: "tipo_pagamento"
                    },
                    {
                        header: "Desconto",
                        accessor: "desconto"
                    },
                    // {
                    //     header: "Estado",
                    //     accessor: (estado) => (
                    //         <span className={`px-2 py-1 rounded-full text-xs ${estado = ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    //             {estado == '1' ? 'Ativo' : 'Inativo'}
                    //         </span>
                    //     )
                    // },
                    {
                        header: "Ações",
                        accessor: (contrato) => (
                            <div className="flex gap-2">
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
                            </div>
                        ),
                    }
                ]}
            />

            {/* Paginação */}
            {/* {data && (
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
            )} */}
        </div>
    );
}