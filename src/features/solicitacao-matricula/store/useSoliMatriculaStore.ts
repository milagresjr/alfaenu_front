import { create } from "zustand";
import { SolicitacaoMatriculaType } from "../types";

type SoliMatriculaState = {
  selectedSolicitacao: SolicitacaoMatriculaType | null;
  setSelectedSolicitacao: (solicitacao: SolicitacaoMatriculaType | null) => void;
};

export const useSoliMatriculaStore = create<SoliMatriculaState>((set) => ({
  selectedSolicitacao: null,
  setSelectedSolicitacao: (solicitacao) => set({ selectedSolicitacao: solicitacao }),
}));
