import type { Metadata } from "next";
import ServiceTypeTable from "./_components/ServiceTypeTable";

export const metadata: Metadata = {
  title: "Tipos de Serviço",
  description: "Gestão de tipos de serviço no sistema Alfaenu",
};

export default function Page() {
    return(
        <>
            <ServiceTypeTable/>
        </>
    )
}