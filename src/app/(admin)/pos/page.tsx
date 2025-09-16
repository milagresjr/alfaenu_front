import { ClientSection } from "./_components/ClientSection";
import FloatingButton from "./_components/FloatingButton";
import { OrderSummary } from "./_components/OrderSummary";
import { ServicesCard } from "./_components/ServicesCard";


export default function Page() {
    return (
        <>
            <div className="flex flex-col-reverse md:flex-row gap-5 md:gap-3">
                <OrderSummary />
                <div className="flex-1 flex flex-col">
                    <ClientSection />
                    <ServicesCard />
                </div>
            </div>
            <FloatingButton />
        </>
    )
}