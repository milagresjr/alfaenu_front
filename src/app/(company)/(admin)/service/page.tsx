import type { Metadata } from "next";
import ServiceTable from "./_components/ServiceTable";

export const metadata: Metadata = {
  title: "Serviços",
  description: "Gestão de serviços oferecidos no sistema Alfaenu",
};

export default function Page() {
    return(
        <>
            <ServiceTable/>
        </>
    )
}