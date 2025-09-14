import { ContratoType, SubcontaType } from "@/features/contract/types";
import { ServiceTypeType } from "@/features/service-type/types";
import { create } from "zustand";

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
}

export const usePOSStore = create<POStoState>((set) => ({
    clienteContrato: null,
    setClienteContrato: (cliente) => set({ clienteContrato: cliente }),
    subContaContrato: null,
    setSubContaContrato: (subConta) => set({ subContaContrato: subConta }),
    categoriaSelected: null,
    setCategoriaSelected: (categoria) => set({categoriaSelected: categoria}),
    totalPago: 0,
    setTotalPago: (total) => set({totalPago: total}),
    totalSaida: 0,
    setTotalSaida: (total) => set({totalSaida: total}),
    totalPorPagar: 0,
    setTotalPorPagar: (total) => set({totalPorPagar: total}),
}));

    
