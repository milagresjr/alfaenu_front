import type { Metadata } from "next";
import SoliReconhecimentoRegistoCriminalTable from "./_components/SoliReconhecimentoRegistoCriminalTable"

export const metadata: Metadata = {
  title: "Reconhecimento de Registo Criminal",
  description: "Gestão de solicitações de reconhecimento de registo criminal",
};

export default function ReconhecimentoRegistoCriminalPage() {
  return <SoliReconhecimentoRegistoCriminalTable />
}
