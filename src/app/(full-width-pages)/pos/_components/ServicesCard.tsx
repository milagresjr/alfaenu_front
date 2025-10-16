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
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
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
import { ItemServicContratoType } from "@/features/pos/types";
import { ServicosContent } from "./ServiceContent";
import { useGetCaixaAbertoByUser } from "@/features/caixa/hooks/useCaixaQuery";
import CaixaDialog from "@/features/caixa/components/CaixaDialog";
import { useAuthStore } from "@/store/useAuthStore";


export function ServicesCard() {

    const [search, setSearch] = useState('');

    //  const [categoriaSelecionada, setCategoriaSelecionada] = useState<ServiceTypeType | null>(null);

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const searchDebounce = useDebounce(search, 300);

    const { user } = useAuthStore();

    const { data: dataServicos, isLoading: loadingServicos } = useServicos({ page, per_page: perPage, search: searchDebounce });

    const { data: dataCategoriaServico, isLoading: loadingCategoriaServico } = useTipoServicos();

    const { setClienteContrato, setCategoriaSelected, totalPago, categoriaSelected,
        subContaContrato, saldoAtual, clienteContrato,
        itensServicesContrato, setItensServicesContrato,
        openSheetAddService, setOpenSheetAddService
    } = usePOSStore();

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

    const { data: dataCaixa } = useGetCaixaAbertoByUser(Number(user?.id) || 0);
    const [openModalCaixa, setOpenModalCaixa] = useState(false);

    const create = useCreateItensServiceContrato();

    const queryClient = useQueryClient();

    const acao = "abrir";

    async function addServiceContrato(service: ServiceType) {

        if (!dataCaixa || dataCaixa?.status !== 'aberto') {
            const confirmed = await alert.confirm("Atenção", "Para adicionar um serviço, é necessário que você tenha um caixa aberto. Deseja abrir o caixa agora?", "Sim", "Não");
            if (confirmed) {
                // router.push('/operation/my-caixa');
                setOpenModalCaixa(true);
            }
            return;
        }

        const { itensServicesContrato, setItensServicesContrato } = usePOSStore.getState();

        // Verifica se o item já existe na lista
        const itemExistente = itensServicesContrato.find(
            (item) => item.service_id === Number(service.id)
        );

        let novaLista;

        if (itemExistente) {
            //Se já existir, apenas atualiza a quantidade
            novaLista = itensServicesContrato.map((item) =>
                item.service_id === Number(service.id)
                    ? { ...item, qtd: Number(item.qtd) + 1 } // incrementa a quantidade
                    : item
            );
            toast.info("Quantidade do serviço atualizada na lista!");
        } else {
            // Se não existir, adiciona um novo item
            const novoItem: ItemServicContratoType = {
                service_id: Number(service.id),
                servico_nome: service.nome,
                servico_valor: service.valor,
                servico_tipo: service.tipo,
                servico_valor_externo: service.valor_externo,
                qtd: 1,
            };

            novaLista = [...itensServicesContrato, novoItem];

            toast.success("Serviço adicionado na lista!");
        }

        setItensServicesContrato(novaLista);
    }


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
            console.log(data);

            create.mutate(data, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["item-service-contrato"],
                        exact: false,
                    });
                    toast.success("Serviço inserido com sucesso!");
                },
                onError: (error) => {
                    toast.error("Erro ao adicionar serviço!");
                    console.log(error);
                }
            })

        }
    }

    return (
        <>

            {/* CARD SERVICE */}
            <div className="hidden md:block">
                <ServicosContent
                    search={search}
                    loadingCategoriaServico={loadingCategoriaServico}
                    dataCategoriaServico={dataCategoriaServico}
                    categoriaSelected={categoriaSelected}
                    handleChangeCategoria={handleChangeCategoria}
                    setSearch={setSearch}
                    loadingServicos={loadingServicos}
                    dataServicosFiltered={dataServicosFiltered}
                    addServiceContrato={addServiceContrato}
                    clienteContrato={clienteContrato}
                    subContaContrato={subContaContrato}
                    dataServicos={dataServicos}
                    setPage={setPage}
                    setPerPage={setPerPage}
                />
            </div>

            <Sheet open={openSheetAddService} onOpenChange={setOpenSheetAddService}>
                <SheetContent className="w-full md:w-2/3 lg:w-1/2 xl:w-2/5">
                    <SheetHeader>
                        <SheetTitle>Adicionar serviços</SheetTitle>
                        <SheetDescription asChild>
                            <ServicosContent
                                search={search}
                                loadingCategoriaServico={loadingCategoriaServico}
                                dataCategoriaServico={dataCategoriaServico}
                                categoriaSelected={categoriaSelected}
                                handleChangeCategoria={handleChangeCategoria}
                                setSearch={setSearch}
                                loadingServicos={loadingServicos}
                                dataServicosFiltered={dataServicosFiltered}
                                addServiceContrato={addServiceContrato}
                                clienteContrato={clienteContrato}
                                subContaContrato={subContaContrato}
                                dataServicos={dataServicos}
                                setPage={setPage}
                                setPerPage={setPerPage}
                            />
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>

            <CaixaDialog
                acao={acao}
                open={openModalCaixa}
                onOpenChange={setOpenModalCaixa}
                dataCaixa={dataCaixa}
            />
        </>
    )
}