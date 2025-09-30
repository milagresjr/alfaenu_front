import Link from "next/link";
import { ClientSection } from "./_components/ClientSection";
import FloatingButton from "./_components/FloatingButton";
import { OrderSummary } from "./_components/OrderSummary";
import { ServicesCard } from "./_components/ServicesCard";
import { ChevronLeft } from "lucide-react";


export default function Page() {
    return (
        <>
            <div className="flex items-center justify-between px-4 pt-2">
                <Link href={'/'} className="text-blue-600 cursor-pointer flex items-center ga-2">
                    <ChevronLeft size={18} />
                    <span>Voltar</span>
                </Link>
                <h1 className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
                    Alfaenu
                </h1>
                <div className="flex items-center gap-4">
                    <div className="text-gray-600 dark:text-gray-300 font-medium">
                        Utilizador: João Silva
                    </div>
                    <div className="h-5 w-px bg-gray-300 dark:bg-gray-600" />
                    <div className="text-gray-600 dark:text-gray-300 font-medium">
                        {new Date().toLocaleDateString()}
                    </div>
                </div>
            </div>
            <div className="flex flex-col-reverse md:flex-row gap-5 md:gap-3 p-4 pt-2">
                <OrderSummary />
                <div className="flex-1 flex flex-col">
                    <ClientSection />
                    <ServicesCard />
                </div>
            </div>
            {/* <FloatingButton /> */}
        </>
    )
}