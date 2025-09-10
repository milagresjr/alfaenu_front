"use client";

import { ClienteType } from "@/features/client/types";
import { SelectClientPOS } from "@/features/pos/components/SelectClientPOS";
import { SelectContaPOS } from "@/features/pos/components/SelectContaPOS";
import { useState } from "react";


export function ClientSection() {

    const [cliente, setCliente] = useState<ClienteType | null>(null);
    const [subConta, setSubConta] = useState<ClienteType | null>(null);

    return (
        <div className="flex flex-col gap-2 px-4 pt-2 bg-white rounded-t-md border border-gray-300 border-b-0">
           <div className="flex gap-2">
             <SelectClientPOS
                selectedCliente={cliente}
                onSelectCliente={(clienteSelected) => setCliente(clienteSelected)}
                error={!cliente}
            />
            <SelectContaPOS
                selectedCliente={subConta}
                onSelectCliente={(subContaSelected) => setSubConta(subContaSelected)}
                error={!subConta}
            />
           </div>
            <hr />
        </div>
    )
}