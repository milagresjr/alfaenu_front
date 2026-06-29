import type { Metadata } from "next";
import TermTable from "./_components/TermTable";

export const metadata: Metadata = {
  title: "Termos",
  description: "Gestão de termos e condições no sistema Alfaenu",
};

export default function Page() {
    return(
        <TermTable />
    )
}