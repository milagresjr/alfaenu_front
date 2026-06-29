import type { Metadata } from "next";
import SoliAgendamentoTable from "./_components/SoliAgendamentoTable"

export const metadata: Metadata = {
  title: "Solicitações de Agendamento",
  description: "Gestão de solicitações de agendamento no sistema Alfaenu",
};

export default function SolicitacaoAgendamentoPage() {
  return <SoliAgendamentoTable />
}
