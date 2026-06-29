import type { Metadata } from "next";
import { FormCount } from "@/features/count/components/FormCount";

export const metadata: Metadata = {
  title: "Nova Contagem",
  description: "Registo de nova contagem financeira no Alfaenu",
};

export default function Page() {
    return (
        <div>
            <FormCount />
        </div>
    )
}