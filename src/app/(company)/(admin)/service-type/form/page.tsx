import type { Metadata } from "next";
import { FormServiceType } from "@/features/service-type/components/FormServiceType";

export const metadata: Metadata = {
  title: "Novo Tipo de Serviço",
  description: "Registo de novo tipo de serviço no sistema Alfaenu",
};

export default function Page() {
    return (
        <>
            <FormServiceType />
        </>
    )
}