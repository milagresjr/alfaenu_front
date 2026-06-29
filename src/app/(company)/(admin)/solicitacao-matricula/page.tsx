import type { Metadata } from "next";
import SoliMatriculaTable from "./_components/SoliMatriculaTable";

export const metadata: Metadata = {
  title: "Solicitações de Matrícula",
  description: "Gestão de solicitações de matrícula no sistema Alfaenu",
};

export default function SolicitacaoMatriculaPage() {
  return <SoliMatriculaTable />;
}
