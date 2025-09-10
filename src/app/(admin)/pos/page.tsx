import { ClientSection } from "./_components/ClientSection";
import { OrderSummary } from "./_components/OrderSummary";
import { ServicesCard } from "./_components/ServicesCard";


export default function Page() {
    return (
        <div className="flex gap-3">
            <OrderSummary />
            <div className="flex-1 flex flex-col">
                <ClientSection />
                <ServicesCard />
            </div>
        </div>
    )
}