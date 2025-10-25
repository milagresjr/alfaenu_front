import { create } from "zustand";
import { CountType } from "../types";

type CountState = {
  selectedCount: CountType | null;
  setSelectedCount: (count: CountType | null) => void;
};

export const useCountStore = create<CountState>((set) => ({
  selectedCount: null,
  setSelectedCount: (count) => set({ selectedCount: count }),
}));
