import type { Metadata } from "next";
import { SubContaTable } from "./_components/SubContaTable";

export const metadata: Metadata = {
  title: "Subcontas",
  description: "Gestão de subcontas no sistema Alfaenu",
};

export default function Page() {
    return (
        <div>
            <SubContaTable />
        </div>
    );
}