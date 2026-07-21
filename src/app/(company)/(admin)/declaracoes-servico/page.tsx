import type { Metadata } from "next";
import DeclaracoesServicoTable from "./_components/DeclaracoesServicoTable";

export const metadata: Metadata = {
  title: "Declarações de Serviço",
  description: "Gestão de declarações de serviço enviadas pelos clientes",
};

export default function DeclaracoesServicoPage() {
  return <DeclaracoesServicoTable />;
}
