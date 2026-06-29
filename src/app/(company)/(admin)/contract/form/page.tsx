import type { Metadata } from "next";
import { FormContrato } from "@/features/contract/components/FormContrato";

export const metadata: Metadata = {
  title: "Novo Contrato",
  description: "Registo de novo contrato no sistema Alfaenu",
};

export default function Page() {
    return(
        <>
            <FormContrato/>
        </>
    )
}