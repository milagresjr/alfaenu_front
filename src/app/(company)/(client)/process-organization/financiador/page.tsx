import type { Metadata } from "next";
import FinanciadorTable from "./_components/FinanciadorTable";

export const metadata: Metadata = {
  title: "Financiadores",
  description: "Gestão de financiadores e instituições financiadoras no Alfaenu",
};

export default function Page() {
  return <FinanciadorTable />;
}
