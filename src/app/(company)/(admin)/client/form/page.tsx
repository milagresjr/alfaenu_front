import type { Metadata } from "next";
import { FormClient } from "@/features/client/components/FormClient";

export const metadata: Metadata = {
  title: "Novo Cliente",
  description: "Registo de novo cliente no sistema Alfaenu",
};

export default function Page() {
    return (
        <div>
            <FormClient />
        </div>
    )
}