import type { Metadata } from "next";
import SoliReconhecimentoConsuladoTable from "./_components/SoliReconhecimentoConsuladoTable"

export const metadata: Metadata = {
  title: "Reconhecimento no Consulado",
  description: "Gestão de reconhecimentos de termo de responsabilidade no consulado",
};

export default function ReconhecimentoConsuladoPage() {
  return <SoliReconhecimentoConsuladoTable />
}
