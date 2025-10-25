import { create } from "zustand";
import { MovimentacoesFinanceirasType } from "../types";

type MovFinanceiraState = {
  selectedMovFinanceira: MovimentacoesFinanceirasType | null;
  setSelectedMovFinanceira: (movFinanceira: MovimentacoesFinanceirasType | null) => void;
};

export const useMovFinanceiraStore = create<MovFinanceiraState>((set) => ({
  selectedMovFinanceira: null,
  setSelectedMovFinanceira: (movFinanceira) => set({ selectedMovFinanceira: movFinanceira }),
}));
