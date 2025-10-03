"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";


export function InfoHeader() {

    const { user } = useAuthStore();

    const nomeUtilizador = user?.nome;

    return (
        <>
            <div className="flex flex-col items-start md:flex-row md:items-center justify-between px-4 pt-2">
                <Link href={'/'} className="text-blue-600 cursor-pointer flex items-center ga-2">
                    <ChevronLeft size={18} />
                    <span>Voltar</span>
                </Link>
                <h1 className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
                    Alfaenu
                </h1>
                <div className="flex items-center gap-4">
                    <div className="text-gray-600 dark:text-gray-300 font-medium">
                        Utilizador: {nomeUtilizador}
                    </div>
                    <div className="h-5 w-px bg-gray-300 dark:bg-gray-600" />
                    <div className="text-gray-600 dark:text-gray-300 font-medium">
                        {new Date().toLocaleDateString()}
                    </div>
                </div>
            </div >
        </>
    )
}