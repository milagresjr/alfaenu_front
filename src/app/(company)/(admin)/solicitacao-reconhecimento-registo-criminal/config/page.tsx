import type { Metadata } from "next";
import ConfigReconhecimentoRegistoCriminalForm from "./_components/ConfigReconhecimentoRegistoCriminalForm"

export const metadata: Metadata = {
  title: "Configuração - Reconhecimento de Registo Criminal",
  description: "Configurar preços e endereço para reconhecimento de registo criminal",
};

export default function ConfigReconhecimentoRegistoCriminalPage() {
  return <ConfigReconhecimentoRegistoCriminalForm />
}
