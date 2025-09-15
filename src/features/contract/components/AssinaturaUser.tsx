"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useContratoStore } from "../store/useContratoStore";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "react-toastify";
import Label from "@/components/form/Label";

// 🔹 Definimos o tipo que vamos expor para o ref
export interface AssinaturaHandleUser {
  salvar: () => void;
  limpar: () => void;
}

export const AssinaturaUser = forwardRef<AssinaturaHandleUser>((_, ref) => {
  const { setAssinaturaUser, openModalTermo } = useContratoStore();
  const sigCanvas = useRef<SignatureCanvas>(null);

  // Expor métodos para o componente pai (BottomOffCanvas)
  useImperativeHandle(ref, () => ({
    salvar: () => salvar(),
    limpar: () => limpar(),
  }));

  // Carregar assinatura salva
  useEffect(() => {
    const saved = sessionStorage.getItem("assinatura-user");
    if (saved) {
      setAssinaturaUser(saved);
    }
  }, []);

  const salvar = () => {
    if (!sigCanvas.current) return;
    const dataURL = sigCanvas.current
      .getCanvas()
      .toDataURL("image/png");
    localStorage.setItem("assinatura-user", dataURL);
    setAssinaturaUser(dataURL);
  };

  const limpar = () => {
    sigCanvas.current?.clear();
    localStorage.removeItem("assinatura-user");
    setAssinaturaUser(null);
  };

  useEffect(() => {
    if (openModalTermo && sigCanvas.current) {
      const saved = localStorage.getItem("assinatura-user");
      if (saved) {
        sigCanvas.current.fromDataURL(saved);
        setAssinaturaUser(saved);
      }
    }
  }, [openModalTermo]);

  return (
    <div>
      <Label>Assinatura do User</Label>
      <SignatureCanvas
        ref={sigCanvas}
        penColor="black"
        canvasProps={{
          width: 370,
          height: 150,
          className: "bg-white border rounded",
        }}
      />
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={limpar}
          className="px-2 py-2 bg-gray-600 text-white text-sm rounded-md"
        >
          Limpar
        </button>
      </div>
    </div>
  );
});

AssinaturaUser.displayName = "AssinaturaUser";
