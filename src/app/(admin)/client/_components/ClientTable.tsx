'use client';

//import { PaginationComponent } from "@/components/ui_old/pagination/Pagination";
import { useState } from "react";
import { useClientes, useDeleteCliente } from "@/features/client/hooks/useClientsQuery";
import { useClienteStore } from "@/features/client/store/useClienteStore";
import { ClienteType } from "@/features/client/types";
import { TableMain } from "@/components/table";
import { useRouter } from "next/navigation";
import { alert } from "@/lib/alert";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ClientTable() {

    // const [search, setSearch] = useState('')
    // const [page, setPage] = useState(1);
    // const [perPage, setPerPage] = useState(15);

    //const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, isError } = useClientes();

    const { selectedCliente, setSelectedCliente } = useClienteStore();

    const router = useRouter();

    const deleteCliente = useDeleteCliente();

    const handleEdit = (cliente: ClienteType) => {
        setSelectedCliente(cliente);
        router.push(`/client/form`);
    };

    const queryClient = useQueryClient();

    const handleDelete = async (cliente: ClienteType) => {
        setSelectedCliente(cliente);
        const confirmed = await alert.confirm('Confirmar', 'Tem certeza que deseja excluir este cliente?', 'Sim', 'Não');
        if (confirmed) {
            setSelectedCliente(null);
            deleteCliente.mutate(cliente.id, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["clientes"],
                        exact: false,
                    });
                    toast.success('Cliente excluído com sucesso!');
                },
                onError: (error) => {
                    console.error("Erro ao excluir a marca:", error);
                },
            });
        }
    };

    if (isError) {
        return <div>Erro ao carregar clientes</div>;
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 h-[calc(100vh-120px)]">
            <div className="flex justify-between items-center my-2">
                <h1 className="text-lg text-gray-700 dark:text-gray-300 font-semibold">Clientes</h1>
                <Link href="/client/form" className="bg-blue-600 px-4 py-1 rounded-md text-white flex gap-1">
                    <Plus />
                    Novo
                </Link>
            </div>
            <TableMain
                data={data?.data || []}
                isLoading={isLoading}
                emptyMessage="Nenhum cliente encontrado."
                columns={[
                    {
                        header: "Nome",
                        accessor: "nome"
                    },
                    {
                        header: "Email",
                        accessor: "email"
                    },
                    {
                        header: "Telefone",
                        accessor: "telefone"
                    },
                    {
                        header: "Data de Nascimento",
                        accessor: "data_nascimento"
                    },
                    {
                        header: "Endereço",
                        accessor: "endereco"
                    },
                    {
                        header: "Número de BI",
                        accessor: "n_bi"
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