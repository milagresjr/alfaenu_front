import { create } from "zustand";
import { MyClienteType } from "../types";

type ClienteState = {
  selectedMyCliente: MyClienteType | null;
  setSelectedMyCliente: (cliente: MyClienteType | null) => void;
};

export const useMyClienteStore = create<ClienteState>((set) => ({
  selectedMyCliente: null,
  setSelectedMyCliente: (cliente) => set({ selectedMyCliente: cliente }),
}));
