import { create } from "zustand";
import { CentroFormacaoType } from "../types";

type CentroFormacaoState = {
  selectedCentroFormacao: CentroFormacaoType | null;
  setSelectedCentroFormacao: (data: CentroFormacaoType | null) => void;
};

export const useCentroFormacaoStore = create<CentroFormacaoState>((set) => ({
  selectedCentroFormacao: null,
  setSelectedCentroFormacao: (data) => set({ selectedCentroFormacao: data }),
}));
