import { create } from "zustand";
import { SubcontaType } from "../type";

type SubcontaState = {
  selectedSubconta: SubcontaType | null;
  setSelectedSubconta: (subconta: SubcontaType | null) => void;
};

export const useSubcontaStore = create<SubcontaState>((set) => ({
  selectedSubconta: null,
  setSelectedSubconta: (subconta) => set({ selectedSubconta: subconta }),
}));
