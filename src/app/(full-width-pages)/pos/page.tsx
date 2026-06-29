import type { Metadata } from "next";
import Link from "next/link";
import { ClientSection } from "./_components/ClientSection";
import FloatingButton from "./_components/FloatingButton";
import { OrderSummary } from "./_components/OrderSummary";
import { ServicesCard } from "./_components/ServicesCard";
import { ChevronLeft } from "lucide-react";
import { InfoHeader } from "./_components/InfoHeader";

export const metadata: Metadata = {
  title: "Ponto de Venda",
  description: "Sistema de ponto de venda (POS) do Alfaenu",
};


export default function Page() {
    return (
        <>
            <InfoHeader />
            <div className="flex flex-col md:flex-row gap-5 md:gap-3 p-4 pt-2">
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