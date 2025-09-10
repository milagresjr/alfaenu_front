import { TermoType } from "@/features/term/types";
import { create } from "zustand";


type ContratoState = {
    openModalTermo: boolean;
    setOpenModalTermo: (isOpen: boolean) => void;
    selectedTermo: TermoType | null;
    setSelectedTermo: (termo: TermoType | null) => void;
    assinaturaCliente: string | null;
    setAssinaturaCliente: (assinaturaCliente: string | null) => void;
    assinaturaUser: string | null;
    setAssinaturaUser: (assinaturaUser: string | null) => void;
}

export const useContratoStore = create<ContratoState>((set) => ({
    openModalTermo: false,
    setOpenModalTermo: (isOpen) => set({ openModalTermo: isOpen }),
    selectedTermo: null,
    setSelectedTermo: (termo) => set({ selectedTermo: termo }),
    assinaturaCliente: null,
    setAssinaturaCliente: (assinaturaCliente) => set({ assinaturaCliente }),
    assinaturaUser: null,
    setAssinaturaUser: (assinaturaUser) => set({ assinaturaUser }),
}));