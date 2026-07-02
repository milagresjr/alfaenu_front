import type { Metadata } from "next";
import DescricaoList from "./_components/DescricaoList"

export const metadata: Metadata = {
  title: "Descrições de Reserva de Hotel",
  description: "Gestão de descrições para solicitações de reserva de hotel no Alfaenu",
};

export default function DescricaoPage() {
  return <DescricaoList />
}
