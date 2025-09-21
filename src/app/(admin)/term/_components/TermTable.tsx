'use client';

//import { PaginationComponent } from "@/components/ui_old/pagination/Pagination";
import { useState } from "react";
import { TableMain } from "@/components/table";
import { useRouter } from "next/navigation";
import { alert } from "@/lib/alert";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Edit, Plus, Search, Trash } from "lucide-react";
import { TermoType } from "@/features/term/types";
import { useTermoStore } from "@/features/term/store/useTermoStore";
import { useDeleteTermo, useTermos } from "@/features/term/hooks/useTermosQuery";
import { useProgress } from "@bprogress/next";
import { formatarDataLong } from "@/lib/helpers";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@uidotdev/usehooks";
import { PaginationComponent } from "@/components/pagination/Pagination";
import { DropdownActions } from "@/components/dropdown-action-menu/drop-actions-menu";

export default function TermTable() {

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);

    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, isError } = useTermos(page, perPage, debouncedSearch);

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
        progress.start();
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

            <div className="flex justify-start items-center my-4">
                <h1 className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
                    Termos
                </h1>
            </div>

            <div className="my-4 flex items-center justify-between gap-2">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Buscar termos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <button onClick={handleNewTerm} className="bg-blue-600 px-4 py-2 rounded-md text-white flex gap-1">
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
                        header: "Data",
                        accessor: (term: any) => (
                            <span>
                                {formatarDataLong(term.created_at)}
                            </span>
                        )
                    },
                    {
                        header: "Ações",
                        accessor: (termo) => {

                            const actions = [
                                {
                                    label: "Editar",
                                    icon: <Edit />,
                                    onClick: () => handleEdit(termo),
                                },
                                {
                                    label: "Excluir",
                                    icon: <Trash />,
                                    onClick: () => handleDelete(termo),
                                },
                                // {
                                //     label: termo.estado === "ativo" ? "Inativar" : "Ativar",
                                //     icon: termo.estado === "ativo" ? <Lock /> : <Unlock />,
                                //     onClick: () => toggleEstado(termo),
                                // },
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
        </div>
    );
}