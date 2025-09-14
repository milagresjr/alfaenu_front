'use client';

//import { PaginationComponent } from "@/components/ui_old/pagination/Pagination";
import { useState } from "react";
import { TableMain } from "@/components/table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { alert } from "@/lib/alert";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { useDeleteServico, useServicos } from "@/features/service/hooks/useServicesQuery";
import { useServiceStore } from "@/features/service/store/useServiceStore";
import { ServiceType } from "@/features/service/types";
import { useProgress } from "@bprogress/next";

export default function ServiceTable() {

    // const [search, setSearch] = useState('')
    // const [page, setPage] = useState(1);
    // const [perPage, setPerPage] = useState(15);

    //const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, isError } = useServicos();

    const { setSelectedService } = useServiceStore();

    const router = useRouter();

    const progress = useProgress();

    const deleteService = useDeleteServico();

    const handleEdit = (service: ServiceType) => {
        setSelectedService(service);
        progress.start();
        router.push(`/service/form`);
    };

    const queryClient = useQueryClient();

    const handleDelete = async (service: ServiceType) => {
        setSelectedService(service);
        const confirmed = await alert.confirm('Confirmar', 'Tem certeza que deseja excluir este serviço?', 'Sim', 'Não');
        if (confirmed) {
            setSelectedService(null);
            deleteService.mutate(Number(service.id), {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["servicos"],
                        exact: false,
                    });
                    toast.success('Serviço excluído com sucesso!');
                },
                onError: (error) => {
                    console.error("Erro ao excluir o Serviço:", error);
                },
            });
        }
    };

    if (isError) {
        return <div>Erro ao carregar Serviços</div>;
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 h-[calc(100vh-120px)]">
            <div className="flex justify-between items-center my-2">
                <h1 className="text-lg text-gray-700 dark:text-gray-300 font-semibold">Serviços</h1>
                <Link href="/service/form" className="bg-blue-600 px-4 py-1 rounded-md text-white flex gap-1">
                    <Plus />
                    Novo
                </Link>
            </div>
            <TableMain
                data={data?.data || []}
                isLoading={isLoading}
                emptyMessage="Nenhum serviço encontrado."
                columns={[
                    {
                        header: "Nome",
                        accessor: "nome"
                    },
                    {
                        header: "Categoria",
                        accessor: (service) => (
                            <span>
                               { service.categoria?.descricao }
                            </span>
                        )
                    },
                    {
                        header: "Tipo",
                        accessor: "tipo"
                    },
                    {
                        header: "Valor",
                        accessor: "valor"
                    },
                    {
                        header: "Valor Externo",
                        accessor: "valor_externo"
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
                        accessor: (cliente) => (
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(cliente)}>
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(cliente)} >
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