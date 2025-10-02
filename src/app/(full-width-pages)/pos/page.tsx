import Link from "next/link";
import { ClientSection } from "./_components/ClientSection";
import FloatingButton from "./_components/FloatingButton";
import { OrderSummary } from "./_components/OrderSummary";
import { ServicesCard } from "./_components/ServicesCard";
import { ChevronLeft } from "lucide-react";
import { InfoHeader } from "./_components/InfoHeader";


export default function Page() {
    return (
        <>
            <InfoHeader />
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