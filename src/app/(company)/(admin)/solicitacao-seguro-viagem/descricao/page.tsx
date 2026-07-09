import type { Metadata } from "next";
import DescricaoList from "./_components/DescricaoList"

export const metadata: Metadata = {
  title: "Descrições de Seguro de Viagem",
  description: "Gestão de descrições para solicitações de seguro de viagem no Alfaenu",
};

export default function DescricaoPage() {
  return <DescricaoList />
}
