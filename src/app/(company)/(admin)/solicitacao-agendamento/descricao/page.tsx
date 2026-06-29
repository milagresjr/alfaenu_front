import type { Metadata } from "next";
import DescricaoList from "./_components/DescricaoList"

export const metadata: Metadata = {
  title: "Descrições de Agendamento",
  description: "Gestão de descrições para solicitações de agendamento no Alfaenu",
};

export default function DescricaoPage() {
  return <DescricaoList />
}
