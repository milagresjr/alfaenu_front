import type { Metadata } from "next";
import { OpcoesOperacoes } from "./_components/OpcoesOperacoes";

export const metadata: Metadata = {
  title: "Operações",
  description: "Gestão de operações financeiras no sistema Alfaenu",
};

export default function Page() {
    return (
        <>
         <OpcoesOperacoes />
        </>
    )
}