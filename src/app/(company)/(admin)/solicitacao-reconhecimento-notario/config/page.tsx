import type { Metadata } from "next";
import ConfigReconhecimentoNotarioForm from "./_components/ConfigReconhecimentoNotarioForm"

export const metadata: Metadata = {
  title: "Configuração - Reconhecimento Notário",
  description: "Configurar preços e endereço para reconhecimento notário",
};

export default function ConfigReconhecimentoNotarioPage() {
  return <ConfigReconhecimentoNotarioForm />
}
