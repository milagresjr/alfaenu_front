import { create } from "zustand";
import { MovimentoSubcontaType } from "../type";

type MovimentoSubcontaState = {
    selectedMovimentoSubconta: MovimentoSubcontaType | null;
    setSelectedMovimentoSubconta: (MovimentoSubconta: MovimentoSubcontaType | null) => void;
    openDialogFormMovimentoSubconta: boolean;
    setOpenDialogFormMovimentoSubconta: (open: boolean) => void;
};

export const useMovimentoSubcontaStore = create<MovimentoSubcontaState>((set) => ({
    selectedMovimentoSubconta: null,
    setSelectedMovimentoSubconta: (MovimentoSubconta) => set({ selectedMovimentoSubconta: MovimentoSubconta }),
    openDialogFormMovimentoSubconta: false,
    setOpenDialogFormMovimentoSubconta: (open) => set({ openDialogFormMovimentoSubconta: open }),
}));
