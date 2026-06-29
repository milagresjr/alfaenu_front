import { create } from "zustand";
import { FinanciadorType } from "../types";

type FinanciadorState = {
  selectedFinanciador: FinanciadorType | null;
  setSelectedFinanciador: (data: FinanciadorType | null) => void;
};

export const useFinanciadorStore = create<FinanciadorState>((set) => ({
  selectedFinanciador: null,
  setSelectedFinanciador: (data) => set({ selectedFinanciador: data }),
}));
