"use client";

import { AssinaturaCliente } from "./AssinaturaCliente";
import { AssinaturaUser } from "./AssinaturaUser";
import { useContratoStore } from "../store/useContratoStore";

export default function BottomOffCanvas() {

    const { setOpenOffCanvas, openOffCanvas } = useContratoStore();

    return (
        <div className="relative">

            {/* Overlay */}
            {openOffCanvas && (
                <div
                    className="fixed inset-0 bg-black/50 z-999"
                    onClick={() => setOpenOffCanvas(false)}
                />
            )}

            {/* Off-canvas vindo de baixo */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-999 bg-white dark:bg-gray-900 rounded-t-2xl shadow-lg transform transition-transform duration-300 ${openOffCanvas ? "translate-y-0" : "translate-y-full"
                    }`}
            >
                <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
                    <h2 className="text-lg font-semibold dark:text-white">Assinaturas</h2>
                    <button onClick={() => setOpenOffCanvas(false)} className="text-gray-500 hover:text-gray-700">
                        Fechar
                    </button>
                </div>

                <div className="p-4 space-y-4 min-h-[300px]">
                    <p className="dark:text-gray-300">
                        Assina nos espaços em branco.
                    </p>

                    <div className="flex gap-3 flex-wrap justify-center">
                        <AssinaturaCliente />
                        <AssinaturaUser />
                    </div>

                </div>
            </div>
        </div>
    );
}
