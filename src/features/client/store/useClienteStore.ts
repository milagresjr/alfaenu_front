import { create } from "zustand";
import { ClienteType } from "../types";

type ClienteState = {
  selectedCliente: ClienteType | null;
  setSelectedCliente: (cliente: ClienteType | null) => void;
};

export const useClienteStore = create<ClienteState>((set) => ({
  selectedCliente: null,
  setSelectedCliente: (cliente) => set({ selectedCliente: cliente }),
}));
