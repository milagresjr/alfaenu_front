import type { Metadata } from "next";
import SoliReconhecimentoNotarioTable from "./_components/SoliReconhecimentoNotarioTable"

export const metadata: Metadata = {
  title: "Reconhecimento Notário",
  description: "Gestão de solicitações de reconhecimento notário",
};

export default function ReconhecimentoNotarioPage() {
  return <SoliReconhecimentoNotarioTable />
}
