import type { Metadata } from "next";
import { MeuCaixa } from "./_components/MeuCaixa";

export const metadata: Metadata = {
  title: "Meu Caixa",
  description: "Gestão do caixa e movimentos financeiros no Alfaenu",
};

export default function Page() {
    return (
        <>
            <MeuCaixa />
        </>
    )
}