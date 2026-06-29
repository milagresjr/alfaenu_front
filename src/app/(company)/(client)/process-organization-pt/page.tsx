import type { Metadata } from "next";
import RecentClients from "./_components/RecentClients";

export const metadata: Metadata = {
  title: "Processos de Visto",
  description: "Gestão de processos de organização de visto no Alfaenu",
};

export default function Page() {
  return (
    <>
      <RecentClients />
    </>
  )
}