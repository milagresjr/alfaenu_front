import type { Metadata } from "next";
import SubcontaTable from "./_components/SubcontaTable";

export const metadata: Metadata = {
  title: "Subcontas do Contrato",
  description: "Subcontas associadas a um contrato no sistema Alfaenu",
};

export default function Page() {
    return (
        <div>
            <SubcontaTable />
        </div>
    );
}