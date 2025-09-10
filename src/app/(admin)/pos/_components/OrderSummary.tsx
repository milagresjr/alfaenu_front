import { ServiceItemCart } from "@/features/pos/components/ServiceItemCart";

export function OrderSummary() {
    return (
        <div className="bg-gray-200 flex flex-col gap-2 justify-between h-[calc(100vh-142px)] w-[300px] rounded-md">
            <div className="flex-1 flex flex-col gap-2 overflow-auto custom-scrollbar p-4">
                <ServiceItemCart />
                <ServiceItemCart />
                <ServiceItemCart />
                <ServiceItemCart />
                <ServiceItemCart />
            </div>
            <div className="h-[100px] flex flex-col">
                <div className="flex flex-col px-4 py-2 ">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Total do serviço(s)</span>
                        <span className="text-gray-700 font-medium text-sm">250.999,00 kz</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Pago</span>
                        <span className="text-gray-700 font-medium text-sm">250.999,00 kz</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Saída</span>
                        <span className="font-medium text-sm">158.999,00 kz</span>
                    </div>
                </div>
                <div className="flex justify-between items-center bg-blue-800 py-3 px-4 text-center rounded-b-lg">
                    <span className="font-medium text-white text-lg">Saldo atual</span>
                    <span className="font-medium text-white text-lg">250.999,00 kz</span>
                </div>
            </div>
        </div>
    )
}