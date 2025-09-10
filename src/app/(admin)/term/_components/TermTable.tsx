'use client';

//import { PaginationComponent } from "@/components/ui_old/pagination/Pagination";
import { useState } from "react";
import { TableMain } from "@/components/table";
import { useRouter } from "next/navigation";
import { alert } from "@/lib/alert";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { TermoType } from "@/features/term/types";
import { useTermoStore } from "@/features/term/store/useTermoStore";
import { useDeleteTermo, useTermos } from "@/features/term/hooks/useTermosQuery";
import { useProgress } from "@bprogress/next";

export default function TermTable() {

    // const [search, setSearch] = useState('')
    // const [page, setPage] = useState(1);
    // const [perPage, setPerPage] = useState(15);

    //const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, isError } = useTermos();

    const { setSelectedTermo, setConteudoTermo } = useTermoStore();

    const progress = useProgress();

    const router = useRouter();
    const deleteTermo = useDeleteTermo();
    
    const handleEdit = (termo: TermoType) => {
        progress.start();
        setSelectedTermo(termo);
        router.push(`/term/form`);
        progress.stop();
    };

    const queryClient = useQueryClient();

    const handleNewTerm = () => {
        setSelectedTermo(null);
        setConteudoTermo('');
        router.push(`/term/form`);
    };


    const handleDelete = async (termo: TermoType) => {
        setSelectedTermo(termo);
        const confirmed = await alert.confirm('Confirmar', 'Tem certeza que deseja excluir este termo?', 'Sim', 'Não');
        if (confirmed) {
            setSelectedTermo(null);
            deleteTermo.mutate(termo.id, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["termos"],
                        exact: false,
                    });
                    toast.success('Termo excluído com sucesso!');
                },
                onError: (error) => {
                    alert.error("Erro ao excluir o Termo");
                    console.error("Erro ao excluir o Termo:", error);
                },
            });
        }
    };

    if (isError) {
        return <div>Erro ao carregar Termo</div>;
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 h-[calc(100vh-120px)]">
            <div className="flex justify-between items-center my-2">
                <h1 className="text-lg text-gray-700 dark:text-gray-300 font-semibold">Termos</h1>
                <button onClick={handleNewTerm} className="bg-blue-600 px-4 py-1 rounded-md text-white flex gap-1">
                    <Plus />
                    Novo
                </button>
            </div>
            <TableMain
                data={data?.data || []}
                isLoading={isLoading}
                emptyMessage="Nenhum termo encontrado."
                columns={[
                    {
                        header: "Titulo",
                        accessor: "titulo"
                    },
                    {
                        header: "Estado",
                        accessor: (term) => (
                            <span className={`px-2 py-1 rounded-full text-xs ${term.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {term.status ? 'Ativo' : 'Inativo'}
                            </span>
                        )
                    },
                    {
                        header: "Ações",
                        accessor: (term) => (
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(term)}>
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(term)} >
                                    Delete
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