import type { Metadata } from "next";
import CountTable from "./_components/CountTable";

export const metadata: Metadata = {
  title: "Contagens",
  description: "Registo de contagens financeiras no sistema Alfaenu",
};

export default function Page() {
    return (
        <CountTable />
    );
}