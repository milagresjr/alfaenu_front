"use client";

import { AssinaturaCliente, AssinaturaHandleCliente } from "./AssinaturaCliente";
import { AssinaturaHandleUser, AssinaturaUser } from "./AssinaturaUser";
import { useContratoStore } from "../store/useContratoStore";
import { toast } from "react-toastify";
import { useRef } from "react";

export default function BottomOffCanvas() {
    const { setOpenOffCanvas, openOffCanvas, salvarAssinatura } = useContratoStore();

    // refs dos dois canvases
    const clienteRef = useRef<AssinaturaHandleCliente>(null);
    const userRef = useRef<AssinaturaHandleUser>(null);

    const salvarTudo = () => {
        clienteRef.current?.salvar();
        userRef.current?.salvar();
        toast.success("Assinaturas salvas com sucesso!");
    };

    return (
        <div className="relative">
            {openOffCanvas && (
                <div
                    className="fixed inset-0 bg-black/50 z-999"
                    onClick={() => setOpenOffCanvas(false)}
                />
            )}

            <div
                className={`fixed bottom-0 left-0 right-0 z-999 bg-white dark:bg-gray-900 rounded-t-2xl shadow-lg transform transition-transform duration-300 ${openOffCanvas ? "translate-y-0" : "translate-y-full"
                    }`}
            >
                <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
                    <h2 className="text-lg font-semibold dark:text-white">Assinaturas</h2>
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={() => setOpenOffCanvas(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Fechar
                        </button>
                        <button
                            type="button"
                            onClick={salvarTudo}
                            className="px-2 py-2 bg-green-600 text-white text-sm rounded-md"
                        >
                            Salvar Assinaturas
                        </button>
                    </div>
                </div>

                <div className="p-4 space-y-4 min-h-[300px]">
                    <p className="dark:text-gray-300">Assina nos espaços em branco.</p>
                    <div className="flex gap-3 flex-wrap justify-center">
                        <AssinaturaCliente ref={clienteRef} />
                        <AssinaturaUser ref={userRef} />
                    </div>
                </div>
            </div>
        </div>
    );
}
