import type { Metadata } from "next";
import { FormService } from "@/features/service/components/FormService";

export const metadata: Metadata = {
  title: "Novo Serviço",
  description: "Registo de novo serviço no sistema Alfaenu",
};

export default function Page() {
    return (
        <>
            <FormService />
        </>
    )
}