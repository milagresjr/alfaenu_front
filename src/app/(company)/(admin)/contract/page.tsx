import type { Metadata } from "next";
import ContractTable from "./_components/ContractTable";

export const metadata: Metadata = {
  title: "Contratos",
  description: "Gestão de contratos no sistema Alfaenu",
};

export default function Page() {
    return(
        <>
            <ContractTable/>
        </>
    )
}