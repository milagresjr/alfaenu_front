import type { Metadata } from "next";
import DescricaoList from "./_components/DescricaoList"

export const metadata: Metadata = {
  title: "Descrições de Print de Voo",
  description: "Gestão de descrições para solicitações de print de voo no Alfaenu",
};

export default function DescricaoPage() {
  return <DescricaoList />
}
