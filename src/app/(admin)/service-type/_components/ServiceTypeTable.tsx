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
import { useTipoServicos } from "@/features/service-type/hooks/useServiceTypeQuery";
import { useServiceTypeStore } from "@/features/service-type/store/useServiceTypeStore";
import { ServiceTypeType } from "@/features/service-type/types";
import { useProgress } from "@bprogress/next";

export default function ServiceTypeTable() {

    // const [search, setSearch] = useState('')
    // const [page, setPage] = useState(1);
    // const [perPage, setPerPage] = useState(15);

    //const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, isError } = useTipoServicos();

    const { setSelectedServiceType } = useServiceTypeStore();

    const router = useRouter();

    const progress = useProgress();

    const deleteService = useDeleteServico();

    const handleEdit = (serviceType: ServiceTypeType) => {
        setSelectedServiceType(serviceType);
        progress.start();
        router.push(`/service-type/form`);
    };

    const queryClient = useQueryClient();

    const handleDelete = async (serviceType: ServiceTypeType) => {
        setSelectedServiceType(serviceType);
        const confirmed = await alert.confirm('Confirmar', 'Tem certeza que deseja excluir este tipo de serviço?', 'Sim', 'Não');
        if (confirmed) {
            setSelectedServiceType(null);
            deleteService.mutate(Number(serviceType.id), {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["tipo-servicos"],
                        exact: false,
                    });
                    toast.success('Tipo de Serviço excluído com sucesso!');
                },
                onError: (error) => {
                    console.error("Erro ao excluir o Serviço:", error);
                },
            });
        }
    };

    if (isError) {
        return <div>Erro ao carregar Tipo Serviços</div>;
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 h-[calc(100vh-120px)]">
            <div className="flex justify-between items-center my-2">
                <h1 className="text-lg text-gray-700 dark:text-gray-300 font-semibold">Tipo de Serviços</h1>
                <Link href="/service-type/form" className="bg-blue-600 px-4 py-1 rounded-md text-white flex gap-1">
                    <Plus />
                    Novo
                </Link>
            </div>
            <TableMain
                data={data?.data || []}
                isLoading={isLoading}
                emptyMessage="Nenhum tipo de serviço encontrado."
                columns={[
                    {
                        header: "Nome",
                        accessor: "descricao"
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
                        accessor: (serviceType) => (
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(serviceType)}>
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(serviceType)} >
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