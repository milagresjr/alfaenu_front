'use client';

//import { PaginationComponent } from "@/components/ui_old/pagination/Pagination";
import { useEffect, useMemo, useState } from "react";
import { ContratoType } from "@/features/contract/types";
import { TableMain } from "@/components/table";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowDownCircle, ArrowUpCircle, ChevronLeft, Edit, File, FileText, Funnel, Info, Loader2, Lock, Plus, Printer, Search, Trash, Unlock, UserCircle2, Wallet, Wrench } from "lucide-react";
import { useContratos, useDeleteContrato } from "@/features/contract/hooks/useContractQuery";
import { gerarPdfContrato, gerarPdfMovimentoSubconta, gerarPdfMovimentoSubcontaAllMov, gerarPdfServicosContrato } from "@/lib/utils";
import { formatarDataLong, formatarMoeda } from "@/lib/helpers";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@uidotdev/usehooks";
import { PaginationComponent } from "@/components/pagination/Pagination";
import { Users, UserCheck, CheckCircle2, PauseCircle, XCircle } from "lucide-react";
import { StatCard } from "@/components/StatCard/stat-card";
import { useProgress } from "@bprogress/next";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSubcontas, useSubcontasByContract } from "@/features/subconta/hooks/useSubcontaQuery";
import { DropdownActions } from "@/components/dropdown-action-menu/drop-actions-menu";
import { useMovimentoSubcontaStore } from "@/features/movimento-subconta/store/useMovimentoSubcontaStore";
import { FormMovimentoSubconta } from "@/features/movimento-subconta/components/FormMovimentoSubconta";
import { useSubcontaStore } from "@/features/subconta/store/useSubcontaStore";
import { SubcontaType } from "@/features/subconta/type";
import { useSubcontaContratoStore } from "@/features/subcontas-contrato/store/useSubcontaContratoStore";
import { SelectClienteContrato } from "./SelectClienteContrato";
import { SelectSubcontaContrato } from "./SelectSubcontaContrato";
import { useMovimentosBySubconta } from "@/features/movimento-subconta/hooks/useMovimentosQuery";
import Badge from "@/components/ui-old/badge/Badge";
import { FiltroSheet } from "./FiltroSheet";
import { toast } from "react-toastify";

export function SubContaTable() {

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  const debouncedSearch = useDebounce(search, 500);

  const [openSheet, setOpenSheet] = useState(false);

  const [loadingId, setLoadingId] = useState<number | null>(null);

  // const { selectedCliente, set } = useContratoStore();

  const [selected, setSelected] = useState<"ativos" | "finalizados" | "suspensos" | "cancelados" | "todos">(
    "todos"
  );

  const {
    subContaContrato,
    clienteResponsavelContrato,
    setClienteContrato,
    setSubContaContrato,
    filters,
    setFilters
  } = useSubcontaContratoStore();

  const router = useRouter();

  const progress = useProgress();

  const { data, isLoading, isError } = useMovimentosBySubconta({ idSubconta: String(subContaContrato?.id), page, per_page: perPage, search: debouncedSearch, filters: filters });

  const { setOpenDialogFormMovimentoSubconta } = useMovimentoSubcontaStore();

  const { setSelectedSubconta } = useSubcontaStore();

  const saldoTotal = data?.saldo_total || 0;

  const totalEntradas = data?.total_entradas || 0;

  const totalSaidas = data?.total_saidas || 0;

  useEffect(() => {
    setPage(1);
  }, [selected]);

  function handleEdit() {
    //setSelectedCliente(cliente);
    // router.push(`/admin/contract/${idContract}/subconta/form`);
  }

  function handleOpenDialogAddMov(subconta: any) {
    //setSelectedCliente(cliente);
    setSelectedSubconta(subconta);
    setOpenDialogFormMovimentoSubconta(true);
  }

  function handleLimparFiltros() {
    setFilters({
      tipo: null,
      dataInicio: null,
      dataFim: null,
      valorMin: null,
      valorMax: null,
    });
  }

  // useEffect(() => {
  //   setFilters((item) => [...item, search: search]);
  // }, []);

  function handleBack() {
    progress.start();
    router.back();
  }

  

  async function handlePrintClick(idMovimento: number) {
    try {
      setLoadingId(Number(idMovimento)); // ativa loading só nesse movimento
      await gerarPdfMovimentoSubconta(idMovimento);
    } finally {
      setLoadingId(null); // volta ao normal
    }
  }

  const cards = [
    {
      key: "saldo",
      title: "Saldo Total",
      value: formatarMoeda(Number(saldoTotal)),
      change: "",
      icon: <Wallet className="w-6 h-6 text-yellow-500" />, // saldo total
    },
    {
      key: "entrada",
      title: "Total de Entradas",
      value: formatarMoeda(Number(totalEntradas)),
      change: "",
      icon: <ArrowDownCircle className="w-6 h-6 text-green-500" />, // entradas
    },
    {
      key: "saida",
      title: "Total de Saídas",
      value: formatarMoeda(Number(totalSaidas)),
      change: "",
      icon: <ArrowUpCircle className="w-6 h-6 text-red-500" />, // saídas
    },
  ];

  async function handlePrintAllMov() {
    if (data?.total === 0) {
      toast.warning("Nenhum movimento encontrado para esta subconta.");
      return;
    }
    if (subContaContrato) {
      setLoadingId(-1);
      try {
        await gerarPdfMovimentoSubcontaAllMov(search,filters);
      } finally {
        setLoadingId(null);
        handleLimparFiltros();
      }
    }
  }

  if (isError) {
    return <div>Erro ao carregar subcontas</div>;
  }


  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 min-h-[calc(100vh-120px)]">

      <div className="flex justify-between">

        <span onClick={handleBack} className="text-blue-600 cursor-pointer flex items-center ga-2">
          <ChevronLeft size={18} />
          <span>Voltar</span>
        </span>
        <button
          className="flex items-center gap-2 bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700"
          type="button"
          disabled={!subContaContrato}
          onClick={handlePrintAllMov}
          title={!subContaContrato ? "Selecione uma subconta para exportar nota" : ""}
        >
          <Printer size={18} />
          {loadingId === -1 ? 'Imprimindo...' : 'Imprimir'}
        </button>
      </div>


      <div className="flex justify-start items-center my-4">
        <h1 className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
          Subcontas
        </h1>
      </div>

      <div className="flex justify-between items-center gap-3 my-3">
        <SelectClienteContrato
          selectedClienteContrato={clienteResponsavelContrato}
          onSelectClienteContrato={(clienteContratoSelected) =>
            setClienteContrato(clienteContratoSelected)
          }
          error={!clienteResponsavelContrato}
        />
        <SelectSubcontaContrato
          selectedSubconta={subContaContrato}
          onSelectSubconta={(subContaSelected) =>
            setSubContaContrato(subContaSelected)
          }
          error={!subContaContrato}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((stat) => (
          <StatCard
            key={stat.key}
            title={stat.title}
            value={stat.value!}
            change={stat.change}
            icon={stat.icon}
            isActive={selected === stat.key}
            onClick={() => setSelected(stat.key as typeof selected)}
          />
        ))}
      </div>

      <div className="my-4 flex items-center justify-between gap-2">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar movimento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLimparFiltros}
            className={`flex items-center bg-transparent border border-gray-400 px-3 py-1 rounded-md text-gray-600 dark:text-gray-300 gap-1 hover:bg-gray-400 dark:hover:text-gray-800 hover:text-white
              ${!filters.tipo && !filters.dataInicio && !filters.dataFim && !filters.valorMin && !filters.valorMax ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            type="button"
            disabled={!filters.tipo && !filters.dataInicio && !filters.dataFim && !filters.valorMin && !filters.valorMax}
          >
            <Trash size={15} />
            Limpar
          </button>
          <button onClick={() => setOpenSheet(true)}
            className={`flex items-center bg-transparent border border-green-600 px-3 py-1 rounded-md text-green-600 gap-1 hover:bg-green-600 hover:text-white
            ${!subContaContrato ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="button"
            disabled={!subContaContrato}
          >
            <Funnel size={15} />
            Filtro
          </button>
          <button
            className={`bg-blue-600 px-3 py-1 rounded-md text-white flex items-center gap-1 *:
               ${!subContaContrato ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            type="button"
            onClick={() => subContaContrato && handleOpenDialogAddMov(subContaContrato)}
            disabled={!subContaContrato}
            title={!subContaContrato ? "Selecione uma subconta para adicionar movimento" : ""}
          >
            <Plus size={17} />
            Novo Movimento
          </button>
        </div>
      </div>

      <FiltroSheet
        openSheet={openSheet}
        setOpenSheet={setOpenSheet}
      />

      <TableMain
        data={data?.data || []}
        isLoading={isLoading}
        emptyMessage={subContaContrato ? "Nenhum movimento encontrado" : "Selecione uma subconta para ver os movimentos"}
        columns={[
          {
            header: "Nome",
            accessor: (mov) => (
              <span>
                {mov.subconta?.nome}
              </span>
            ),
            width: '20%'
          },
          {
            header: "Tipo de Movimento",
            accessor: (mov) => (
              <Badge color={(mov.tipo === 'entrada') ? 'success' : 'error'}>
                {mov.tipo === 'entrada' ? 'Entrada' : 'Saida'}
              </Badge>
            ),
            width: '15%'
          },
          {
            header: "Valor",
            accessor: "valor",
            width: '15%'
          },
          {
            header: "Descrição",
            accessor: "descricao",
            width: '25%'
          },
          {
            header: "Data",
            accessor: (mov) => (
              <span>
                {formatarDataLong(String(mov.created_at))}
              </span>
            ),
            width: '15%'
          },
          {
            header: "Ações",
            accessor: (movimento) => {
              const actions = [
                // {
                //     label: "Editar",
                //     icon: <Edit />,
                //     onClick: () => handleEdit(),
                // },
                {
                  label: "Excluir",
                  icon: <Trash />,
                  onClick: () => handleEdit(),
                },
                {
                  label: `${loadingId === movimento.id ? 'Imprimindo...' : 'Imprimir'}`,
                  icon: <Printer />,
                  onClick: () => handlePrintClick(movimento.id!),
                },
              ];
              return <DropdownActions actions={actions} />
            },
            width: '10%'
          }
        ]}
      />

      {/* Paginação */}
      {(data && data.total > 5) && (
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

      <FormMovimentoSubconta />
    </div>
  );
}