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


export function ServicesCard() {

    const [search, setSearch] = useState('');

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const searchDebounce = useDebounce(search, 300);

    const { data: dataServicos } = useServicos(page, perPage, searchDebounce);

    const { data: dataCategoriaServico } = useTipoServicos();

    const { totalPago, categoriaSelected, subContaContrato } = usePOSStore();

    const dataServicosFiltered =
        !categoriaSelected || categoriaSelected.id === "all"
            ? dataServicos?.data
            : dataServicos?.data.filter(
                (service) => service.categoria_id === categoriaSelected.id
            );

    const create = useCreateItensServiceContrato();

    const queryClient = useQueryClient();

    async function handleServiceClik(service: ServiceType) {

        if (!subContaContrato) {
            toast.error("Selecione uma subconta!");
            return;
        }


        const confirmed = await alert.confirm("Adicionar servico a subconta?");

        if (confirmed) {

            if (Number(service.valor) > Number(totalPago)) {
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
        <div className="flex-1 flex flex-col gap-3 rounded-b-md border border-gray-300 border-t-0">
            <div className="px-4">
                <SearchItem onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex justify-center gap-2 px-4">
                <Carousel className="w-full max-w-lg">
                    <CarouselContent className="-ml-1">
                        {/* Card fixo para "Todas" */}
                        <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                                <CardCategoria selected={(!categoriaSelected || categoriaSelected?.id === "all")} categoria={{ id: "all", descricao: "Todas" }} />
                            </div>
                        </CarouselItem>

                        {dataCategoriaServico?.data.map((categoria, index) => (
                            <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                                <div className="p-1">
                                    <CardCategoria selected={categoria == categoriaSelected} categoria={categoria} />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
            <hr className="" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 h-[calc(100vh-400px)] px-4 overflow-auto custom-scrollbar">
                {dataServicosFiltered?.map((servico) => (
                    <CardService
                        key={servico.id}
                        service={servico}
                        onClick={() => handleServiceClik(servico)}
                    />
                ))}
            </div>
        </div>
    )
}