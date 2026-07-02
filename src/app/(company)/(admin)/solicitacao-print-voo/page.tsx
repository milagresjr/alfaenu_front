import type { Metadata } from "next";
import SoliPrintVooTable from "./_components/SoliPrintVooTable"

export const metadata: Metadata = {
  title: "Solicitações de Print de Voo",
  description: "Gestão de solicitações de print de voo no sistema Alfaenu",
};

export default function SolicitacaoPrintVooPage() {
  return <SoliPrintVooTable />
}
