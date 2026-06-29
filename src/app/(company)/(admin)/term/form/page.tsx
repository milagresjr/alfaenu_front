import type { Metadata } from "next";
import { FormTermo } from "@/features/term/components/FormTermo";

export const metadata: Metadata = {
  title: "Novo Termo",
  description: "Registo de novo termo no sistema Alfaenu",
};

export default function Page() {
    return (
        <>
            <FormTermo />
        </>
    )
}