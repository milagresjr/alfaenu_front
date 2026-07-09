import type { Metadata } from "next";
import SoliSeguroViagemTable from "./_components/SoliSeguroViagemTable"

export const metadata: Metadata = {
  title: "Solicitações de Seguro de Viagem",
  description: "Gestão de solicitações de seguro de viagem no sistema Alfaenu",
};

export default function SolicitacaoSeguroViagemPage() {
  return <SoliSeguroViagemTable />
}
