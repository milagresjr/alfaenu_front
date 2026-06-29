import type { Metadata } from "next";
import { DocumentGenerateTable } from "./_components/DocumentGenerateTable";

export const metadata: Metadata = {
  title: "Documentos Gerados",
  description: "Lista de documentos gerados no sistema Alfaenu",
};

export default function Page() {
    return (
        <div>
            <DocumentGenerateTable />
        </div>
    )
}