// stores/clienteProcessoStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MyClienteType } from '@/features/myClient/types';

interface ClienteProcessoStore {
  cliente: MyClienteType | null;
  step: number;
  setCliente: (cliente: MyClienteType | null) => void;
  setStep: (step: number) => void;
  clearCliente: () => void;
}

export const useClienteProcessoStore = create<ClienteProcessoStore>()(
  persist(
    (set) => ({
      cliente: null,
      step: 6, // Sempre vai para etapa 6
      
      setCliente: (cliente) => set({ cliente }),
      
      setStep: (step) => set({ step }),
      
      clearCliente: () => set({ cliente: null, step: 6 }),
    }),
    {
      name: 'cliente-processo-storage', // nome no localStorage
    }
  )
);