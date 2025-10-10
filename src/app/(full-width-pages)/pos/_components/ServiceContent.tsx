import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchItem } from "@/features/pos/components/SearchItem";
import { CardService } from "@/features/pos/components/CardService";
import { CustomPagination } from "@/components/custom-pagination/custom-pagination";
import { SubcontaType } from "@/features/contract/types";
import { ServiceType } from "@/features/service/types";


type ServicosContentProps = {
  loadingCategoriaServico: boolean;
  dataCategoriaServico: any;
  categoriaSelected: any;
  handleChangeCategoria: (value: string) => void;
  search: string;
  setSearch: (v: string) => void;
  loadingServicos: boolean;
  dataServicosFiltered: ServiceType[] | undefined;
  addServiceContrato: (servico: any) => void;
  clienteContrato: any;
  subContaContrato: SubcontaType | null;
  dataServicos?: any;
  setPage: (p: number) => void;
  setPerPage: (v: number) => void;
};

export function ServicosContent({
  loadingCategoriaServico,
  dataCategoriaServico,
  categoriaSelected,
  handleChangeCategoria,
  setSearch,
  loadingServicos,
  dataServicosFiltered,
  addServiceContrato,
  clienteContrato,
  subContaContrato,
  dataServicos,
  setPage,
  setPerPage,
}: ServicosContentProps) {
  return (
    <>
      <div className="flex flex-1 flex-col gap-3 rounded-b-md border border-gray-300 dark:border-gray-600 md:border-t-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-4">
          <SearchItem onChange={(e) => setSearch(e.target.value)} />
          <Select
            value={String(categoriaSelected?.id)}
            onValueChange={handleChangeCategoria}
          >
            <SelectTrigger className="w-full md:w-[50%]">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {loadingCategoriaServico ? (
                  <SelectLabel>Carregando...</SelectLabel>
                ) : (
                  <>
                    <SelectItem value="all">Todas categoria</SelectItem>
                    {dataCategoriaServico?.data.map((categoria: any, index: number) => (
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

        <hr />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 pb-4 px-4 items-start min-h-[calc(100vh-300px)] max-h-[calc(100vh-260px)] md:min-h-[calc(100vh-320px)] md:max-h-[calc(100vh-320px)] overflow-auto custom-scrollbar">
          {loadingServicos ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-[200px] rounded-md" />
            ))
          ) : (
            dataServicosFiltered?.map((servico) => (
              <CardService
                key={servico.id}
                service={servico}
                onClick={() => addServiceContrato(servico)}
                disabled={(clienteContrato !== null && !subContaContrato)}
              />
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-end py-2">
        {dataServicos && (
          <CustomPagination
            currentPage={dataServicos.current_page}
            itemsPerPage={dataServicos.per_page}
            totalItems={dataServicos.total}
            lastPage={dataServicos.last_page}
            onPageChange={setPage}
            onItemsPerPageChange={(value) => {
              setPage(1);
              setPerPage(value);
            }}
          />
        )}
      </div>
    </>
  );
}
