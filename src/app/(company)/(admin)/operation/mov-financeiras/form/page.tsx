import type { Metadata } from "next";
import { FormMovFinanceira } from "../_components/FormMovFinanceira";

export const metadata: Metadata = {
  title: "Novo Movimento Financeiro",
  description: "Registo de novo movimento financeiro no Alfaenu",
};

export default function Page() {
    return (
        <div>
            <FormMovFinanceira />
        </div>
    )
}