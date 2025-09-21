"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useClienteStore } from "@/features/client/store/useClienteStore"
import { formatarDataLong } from "@/lib/helpers"

interface ClienteDetailDialogProps {
    openDialog: boolean
    onClose: () => void
}

export function ClienteDetailDialog({openDialog, onClose}: ClienteDetailDialogProps) {

    const { selectedCliente } = useClienteStore();

    return (
        <Dialog open={openDialog} onOpenChange={onClose} >
            <DialogContent className="w-md md:w-lg rounded-2xl shadow-lg z-9999">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Detalhes do Cliente
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Nome</p>
                        <p className="text-base font-medium">{selectedCliente?.nome}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="text-base">{selectedCliente?.email}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Telefone</p>
                        <p className="text-base">{selectedCliente?.telefone}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">BI / Passaporte</p>
                        <p className="text-base">{selectedCliente?.n_bi}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Endereço</p>
                        <p className="text-base">{selectedCliente?.endereco}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                            <p className="text-base">{selectedCliente?.data_nascimento}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Data de Criação</p>
                            <p className="text-base">{formatarDataLong(String(selectedCliente?.created_at))}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">Estado</p>
                        <Badge
                            variant={selectedCliente?.estado === "ativo" ? "default" : "secondary"}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${selectedCliente?.estado === "ativo"
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-red-600 hover:bg-red-700 text-white"
                                }`}
                        >
                            {selectedCliente?.estado === "ativo" ? "Ativo" : "Inativo"}
                        </Badge>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )

}