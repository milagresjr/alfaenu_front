import type { Metadata } from "next";
import MovFinanceiraTable from "./_components/MovFinanceiraTable";

export const metadata: Metadata = {
  title: "Movimentos Financeiros",
  description: "Gestão de movimentos financeiros no sistema Alfaenu",
};

export default function Page() {
    return (
        <MovFinanceiraTable />
    );
}