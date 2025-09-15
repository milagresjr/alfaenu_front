import { TermoType } from "@/features/term/types";
import { create } from "zustand";
import { RefObject } from "react";
import SignatureCanvas from "react-signature-canvas";

type ContratoState = {
  openModalTermo: boolean;
  setOpenModalTermo: (isOpen: boolean) => void;

  openOffCanvas: boolean;
  setOpenOffCanvas: (isOpen: boolean) => void;

  selectedTermo: TermoType | null;
  setSelectedTermo: (termo: TermoType | null) => void;

  assinaturaCliente: string | null;
  setAssinaturaCliente: (assinaturaCliente: string | null) => void;

  assinaturaUser: string | null;
  setAssinaturaUser: (assinaturaUser: string | null) => void;

  salvarAssinatura: (sigCanvas: RefObject<SignatureCanvas>, tipo: "cliente" | "user") => void;
  limparAssinatura: (sigCanvas: RefObject<SignatureCanvas>, tipo: "cliente" | "user") => void;
};

export const useContratoStore = create<ContratoState>((set) => ({
  openModalTermo: false,
  setOpenModalTermo: (isOpen) => set({ openModalTermo: isOpen }),

  selectedTermo: null,
  setSelectedTermo: (termo) => set({ selectedTermo: termo }),

  assinaturaCliente: null,
  setAssinaturaCliente: (assinaturaCliente) => set({ assinaturaCliente }),

  assinaturaUser: null,
  setAssinaturaUser: (assinaturaUser) => set({ assinaturaUser }),

  openOffCanvas: false,
  setOpenOffCanvas: (isOpen) => set({ openOffCanvas: isOpen }),

  // 🔹 Função genérica para salvar assinatura
  salvarAssinatura: (sigCanvas, tipo) => {
    if (!sigCanvas.current) return;
    const dataURL = sigCanvas.current.getCanvas().toDataURL("image/png");
    localStorage.setItem(`assinatura-${tipo}`, dataURL);

    if (tipo === "cliente") {
      set({ assinaturaCliente: dataURL });
    }
    if (tipo === "user") {
      set({ assinaturaUser: dataURL });
    }
  },

  // 🔹 Função genérica para limpar assinatura
  limparAssinatura: (sigCanvas, tipo) => {
    sigCanvas.current?.clear();
    localStorage.removeItem(`assinatura-${tipo}`);

    if (tipo === "cliente") {
      set({ assinaturaCliente: null });
    }
    if (tipo === "user") {
      set({ assinaturaUser: null });
    }
  },
}));
