import { ContratoType, SubcontaType } from "@/features/contract/types";
import { create } from "zustand";

type SubcontaContratoState = {
    clienteResponsavelContrato: ContratoType | null;
    setClienteContrato: (cliente: ContratoType | null) => void;
    subContaContrato: SubcontaType | null;
    setSubContaContrato: (subConta: SubcontaType | null) => void;
    filters: {
        tipo?: string | null;
        dataInicio?: string | null;
        dataFim?: string | null;
        valorMin?: number | null;
        valorMax?: number | null;
    };
    setFilters: (filters: SubcontaContratoState["filters"]) => void;
}

export const useSubcontaContratoStore = create<SubcontaContratoState>((set) => ({
    clienteResponsavelContrato: null,
    setClienteContrato: (cliente) => set({ clienteResponsavelContrato: cliente }),
    subContaContrato: null,
    setSubContaContrato: (subConta) => set({ subContaContrato: subConta }),
    filters: {
        tipo: null,
        dataInicio: null,
        dataFim: null,
        valorMin: null,
        valorMax: null,
    },
    setFilters: (filters) => set({ filters: filters })
}));


