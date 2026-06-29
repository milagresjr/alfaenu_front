import type { Metadata } from "next";
import MyClientsTable from "./_components/MyClientsTable";

export const metadata: Metadata = {
  title: "Meus Clientes",
  description: "Lista dos meus clientes na plataforma Alfaenu",
};

export default function Page() {
  return(
    <>
      <MyClientsTable />
    </>
  )
}