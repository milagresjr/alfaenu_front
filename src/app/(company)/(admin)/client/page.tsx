import type { Metadata } from "next";
import ClientTable from "./_components/ClientTable";

export const metadata: Metadata = {
  title: "Clientes",
  description: "Lista de clientes registados no sistema Alfaenu",
};

export default function Page() {
    return(
        <ClientTable />
    );
}