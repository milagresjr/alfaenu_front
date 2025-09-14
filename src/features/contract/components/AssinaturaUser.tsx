"use client";

import { useEffect } from "react";
import { useContratoStore } from "../store/useContratoStore";
import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "react-toastify";
import Label from "@/components/form/Label";

export function AssinaturaUser() {

    const { setAssinaturaUser, openModalTermo } = useContratoStore();

    const sigCanvas = useRef<SignatureCanvas>(null);

    // 🔹 Carregar assinatura salva no sessionStorage ao abrir
    useEffect(() => {
        const saved = sessionStorage.getItem("assinatura-user");
        if (saved) {
            setAssinaturaUser(saved);
        }
    }, []);

    // 🔹 Salvar assinatura em localStorage
    const salvar = () => {
        if (!sigCanvas.current) return;
        const dataURL = sigCanvas.current.getCanvas().toDataURL("image/png");
        localStorage.setItem("assinatura-user", dataURL);
        setAssinaturaUser(dataURL);
        toast.success('Assinatura salva com sucesso!');
    };

    // 🔹 Limpar assinatura
    const limpar = () => {
        sigCanvas.current?.clear();
        localStorage.removeItem("assinatura-user");
        setAssinaturaUser(null);
    };

    // Sempre que abrir o modal, carrega a assinatura salva no localStorage
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
        <div className="">
            <Label>Assintura do Usuário</Label>
            <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{ width: 370, height: 150, className: "bg-white border rounded" }}
            />
            <div className="mt-2 flex gap-2">
                <button type="button" onClick={limpar} className="px-2 py-2 bg-gray-600 text-white text-sm rounded-md">Limpar</button>
                <button type="button" onClick={salvar} className="px-2 py-2 bg-green-600 text-white text-sm rounded-md">Salvar</button>
            </div>
        </div>
    )
}