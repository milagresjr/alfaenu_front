"use client";

import { CardCategoria } from "@/features/pos/components/CardCategoria";
import { CardService } from "@/features/pos/components/CardService";
import { SearchItem } from "@/features/pos/components/SearchItem";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useServicos } from "@/features/service/hooks/useServicesQuery";
import { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { useTipoServicos } from "@/features/service-type/hooks/useServiceTypeQuery";
import { usePOSStore } from "@/features/pos/store/usePOSStore";
import { ServiceType } from "@/features/service/types";
import { alert } from "@/lib/alert";
import { toast } from "react-toastify";
import { useCreateItensServiceContrato } from "@/features/pos/hooks/usePOSQuery";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton"
import { CustomPagination } from "@/components/custom-pagination/custom-pagination";
import { SelectClientPOS } from "@/features/pos/components/SelectClientPOS";
import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ServiceTypeType } from "@/features/service-type/types";


export function ServicesCard() {

    const [search, setSearch] = useState('');

    //  const [categoriaSelecionada, setCategoriaSelecionada] = useState<ServiceTypeType | null>(null);

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const searchDebounce = useDebounce(search, 300);

    const { data: dataServicos, isLoading: loadingServicos } = useServicos({ page, per_page: perPage, search: searchDebounce });

    const { data: dataCategoriaServico, isLoading: loadingCategoriaServico } = useTipoServicos();

    const { setClienteContrato, setCategoriaSelected, totalPago, categoriaSelected, subContaContrato, saldoAtual, clienteContrato } = usePOSStore();

    const dataServicosFiltered =
        !categoriaSelected || categoriaSelected.id === "all"
            ? dataServicos?.data
            : dataServicos?.data.filter(
                (service) => service.categoria_id === categoriaSelected.id
            );

    const handleChangeCategoria = (id: string) => {
        if (id === "all") {
            setCategoriaSelected({ id: "all", descricao: "Todas categoria" });
        } else {
            const categoria = dataCategoriaServico?.data.find(
                (c) => String(c.id) === id
            );
            if (categoria) {
                setCategoriaSelected(categoria);
            }
        }
    };

    const create = useCreateItensServiceContrato();

    const queryClient = useQueryClient();

    async function handleServiceClik(service: ServiceType) {


        if (!subContaContrato) {
            toast.error("Selecione uma subconta!");
            return;
        }

        if (clienteContrato?.estado !== "ativo") {
            return;
        }


        const confirmed = await alert.confirm("Adicionar servico a subconta?");

        if (confirmed) {

            if ((Number(service.valor) > Number(totalPago) || Number(service.valor) > Number(saldoAtual)) && service.tipo === "pre-pago") {
                toast.error("Saldo insuficiente para realização deste serviço!");
                return;
            }

            const data = {
                contract_id: Number(subContaContrato.contract_id),
                service_id: Number(service.id),
                subconta_id: Number(subContaContrato.id),
                servico_nome: service.nome,
                servico_tipo: service.tipo,
                servico_valor_externo: service.valor_externo,
                servico_valor: service.valor
            }

            create.mutate(data, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["item-service-contrato"],
                        exact: false,
                    });
                    toast.success("Serviço inserido com sucesso!");
                }
            })

        }
    }

    return (
        <>
            <div className="flex-1 flex flex-col gap-3 rounded-b-md border border-gray-300 dark:border-gray-600 border-t-0">
                <div className="flex items-center justify-between gap-2 p-4">
                    <SearchItem onChange={(e) => setSearch(e.target.value)} />
                    <Select value={String(categoriaSelected?.id)} onValueChange={handleChangeCategoria}>
                        <SelectTrigger className="w-[50%]">
                            <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {loadingCategoriaServico ? (
                                    <SelectLabel>Carregando...</SelectLabel>
                                ) : (
                                    <>
                                        <SelectItem value="all">Todas categoria</SelectItem>
                                        {dataCategoriaServico?.data.map((categoria, index) => (
                                            <SelectItem key={index} value={String(categoria.id)}>
                                                {categoria.descricao}
                                            </SelectItem>
                                        ))}
                                    </>
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {/* <div className="flex justify-center gap-2 px-4">
                    <Carousel className="w-full max-w-lg">
                        <CarouselContent className="-ml-1">
                            <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                                <div className="p-1">
                                    <CardCategoria selected={(!categoriaSelected || categoriaSelected?.id === "all")} categoria={{ id: "all", descricao: "Todas" }} />
                                </div>
                            </CarouselItem>
                            {
                                loadingCategoriaServico ? (
                                    Array.from({ length: 4 }).map((_, index) => (
                                        <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                                            <Skeleton className="h-[40px] rounded-md" />
                                        </CarouselItem>
                                    ))
                                ) :
                                    dataCategoriaServico?.data.map((categoria, index) => (
                                        <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                                            <div className="p-1">
                                                <CardCategoria selected={categoria == categoriaSelected} categoria={categoria} />
                                            </div>
                                        </CarouselItem>
                                    ))
                            }
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div> */}

                <hr className="" />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 pb-4 px-4 items-start min-h-[calc(100vh-318px)] max-h-[calc(100vh-318px)] overflow-auto custom-scrollbar">
                    {loadingServicos ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <Skeleton key={index} className="h-[200px] rounded-md" />
                        ))
                    ) : (
                        dataServicosFiltered?.map((servico) => (
                            <CardService
                                key={servico.id}
                                service={servico}
                                onClick={() => handleServiceClik(servico)}
                                disabled={clienteContrato?.estado !== "ativo"}
                            />
                        ))
                    )}
                </div>

            </div>
            <div className="flex items-center justify-end  py-2">
                {/* Paginação */}
                {dataServicos && (
                    <CustomPagination
                        currentPage={dataServicos.current_page}
                        itemsPerPage={dataServicos.per_page}
                        totalItems={dataServicos.total}
                        lastPage={dataServicos.last_page}
                        onPageChange={setPage}
                        onItemsPerPageChange={value => {
                            setPage(1)
                            setPerPage(value)
                        }}
                    />
                )}
            </div>
        </>
    )
}