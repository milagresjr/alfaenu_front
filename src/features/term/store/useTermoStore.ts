import { create } from "zustand";
import { TermoType } from "../types";

type TermoState = {
  selectedTermo: TermoType | null;
  setSelectedTermo: (termo: TermoType | null) => void;
  conteudoTermo: string;
  setConteudoTermo: (conteudo: string) => void;
};

export const useTermoStore = create<TermoState>((set) => ({
  selectedTermo: null,
  setSelectedTermo: (termo) => set({ selectedTermo: termo }),
  conteudoTermo: "",
  setConteudoTermo: (conteudo) => set({ conteudoTermo: conteudo }),
}));
