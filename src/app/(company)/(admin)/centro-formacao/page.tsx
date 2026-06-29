export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import CentroFormacaoTable from "./_components/CentroFormacaoTable";

export const metadata: Metadata = {
  title: "Centros de Formação",
  description: "Gestão de centros de formação no Alfaenu",
};

export default function Page() {
  return <CentroFormacaoTable />;
}
