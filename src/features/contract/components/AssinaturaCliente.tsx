"use client";

import { useEffect, useState } from "react";
import { useContratoStore } from "../store/useContratoStore";
import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "react-toastify";
import Label from "@/components/form/Label";

export function AssinaturaCliente() {

    const { setAssinaturaCliente, openModalTermo } = useContratoStore();

    const sigCanvas = useRef<SignatureCanvas>(null);

    // 🔹 Carregar assinatura salva no sessionStorage ao abrir
    useEffect(() => {
        const saved = sessionStorage.getItem("assinatura-cliente");
        if (saved) {
            setAssinaturaCliente(saved);
        }
    }, []);

    function trimCanvasManual(canvas: HTMLCanvasElement): HTMLCanvasElement {
        const ctx = canvas.getContext("2d");
        if (!ctx) return canvas;

        const width = canvas.width;
        const height = canvas.height;

        // Pega todos os pixels do canvas
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;

        let top = null, left = null, right = null, bottom = null;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const alpha = pixels[index + 3]; // canal alpha

                if (alpha > 0) { // encontrou pixel não transparente
                    if (top === null) top = y;
                    if (left === null || x < left) left = x;
                    if (right === null || x > right) right = x;
                    if (bottom === null || y > bottom) bottom = y;
                }
            }
        }

        if (top === null) {
            // nada desenhado → retorna o original
            return canvas;
        }

        const trimmedWidth = right! - left! + 1;
        const trimmedHeight = bottom! - top! + 1;

        // Cria novo canvas só com a parte "assinada"
        const trimmed = document.createElement("canvas");
        trimmed.width = trimmedWidth;
        trimmed.height = trimmedHeight;

        const trimmedCtx = trimmed.getContext("2d");
        if (!trimmedCtx) return canvas;

        trimmedCtx.putImageData(
            ctx.getImageData(left!, top!, trimmedWidth, trimmedHeight),
            0,
            0
        );

        return trimmed;
    }


    // 🔹 Salvar assinatura em localStorage
    const salvar = () => {
         if (!sigCanvas.current) return;
        const dataURL = sigCanvas.current.getCanvas().toDataURL("image/png");
        localStorage.setItem("assinatura-cliente", dataURL);
        setAssinaturaCliente(dataURL);
        toast.success('Assinatura salva com sucesso!');
    };



    // 🔹 Limpar assinatura
    const limpar = () => {
        sigCanvas.current?.clear();
        localStorage.removeItem("assinatura-cliente");
        setAssinaturaCliente(null);

    };

    // Sempre que abrir o modal, carrega a assinatura salva no localStorage
    useEffect(() => {
        if (openModalTermo && sigCanvas.current) {
            const saved = localStorage.getItem("assinatura-cliente");
            if (saved) {
                sigCanvas.current.fromDataURL(saved);
                setAssinaturaCliente(saved);
            }
        }
    }, [openModalTermo]);

    return (
        <div className="">
            <Label>Assintura do Cliente</Label>
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