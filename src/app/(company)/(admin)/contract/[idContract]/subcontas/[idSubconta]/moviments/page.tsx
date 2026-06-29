import type { Metadata } from "next";
import MovimentsTable from "./_components/MovimentsTable";

export const metadata: Metadata = {
  title: "Movimentos",
  description: "Movimentos financeiros associados a uma subconta no Alfaenu",
};

export default function Page() {

    return (
        <div>
            <MovimentsTable />
        </div>
    );
}