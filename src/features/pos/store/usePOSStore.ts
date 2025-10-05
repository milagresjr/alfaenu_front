import { ContratoType, SubcontaType } from "@/features/contract/types";
import { ServiceTypeType } from "@/features/service-type/types";
import { create } from "zustand";
import { ItemServicContratoType } from "../types";

type POStoState = {
    clienteContrato: ContratoType | null;
    setClienteContrato: (cliente: ContratoType | null) => void;
    subContaContrato: SubcontaType | null;
    setSubContaContrato: (subConta: SubcontaType | null) => void;
    categoriaSelected: ServiceTypeType | null;
    setCategoriaSelected: (categoria: ServiceTypeType | null) => void;
    totalPago: number;
    setTotalPago: (total: number) => void;
    totalSaida: number;
    setTotalSaida: (total: number) => void;
    totalPorPagar: number;
    setTotalPorPagar: (total: number) => void;
    saldoAtual: number;
    setSaldoAtual: (total: number) => void;
    updateEstado: (estado: string) => void;

    itensServicesContrato: ItemServicContratoType[],
    setItensServicesContrato: (
        updater:
            | ItemServicContratoType[]
            | ((prev: ItemServicContratoType[]) => ItemServicContratoType[])
    ) => void;
}

export const usePOSStore = create<POStoState>((set) => ({
    clienteContrato: null,
    setClienteContrato: (cliente) => set({ clienteContrato: cliente }),
    subContaContrato: null,
    setSubContaContrato: (subConta) => set({ subContaContrato: subConta }),
    categoriaSelected: { id: "all", descricao: "Todas categoria" },
    setCategoriaSelected: (categoria) => set({ categoriaSelected: categoria }),
    totalPago: 0,
    setTotalPago: (total) => set({ totalPago: total }),
    totalSaida: 0,
    setTotalSaida: (total) => set({ totalSaida: total }),
    totalPorPagar: 0,
    setTotalPorPagar: (total) => set({ totalPorPagar: total }),
    saldoAtual: 0,
    setSaldoAtual: (total) => set({ saldoAtual: total }),
    updateEstado: (estado) => set((state) =>
        state.clienteContrato
            ? { clienteContrato: { ...state.clienteContrato, estado } }
            : state
    ),

    itensServicesContrato: [],
    setItensServicesContrato: (updater) =>
        set((state) => ({
            itensServicesContrato:
                typeof updater === "function" ? updater(state.itensServicesContrato) : updater,
        })),
}));


