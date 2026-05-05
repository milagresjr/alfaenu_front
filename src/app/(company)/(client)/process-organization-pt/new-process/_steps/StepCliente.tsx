// components/processo/steps/StepCliente.tsx
'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, UserPlus, User, Mail, Phone, FileText } from "lucide-react"
import { StepProps, Cliente } from "@/types/processo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useMyClientes } from "@/features/myClient/hooks/useMyClientsQuery"
import { useMyClienteStore } from "@/features/myClient/store/useMyClienteStore"
import { useDebounce } from "@uidotdev/usehooks"
import { MyClienteType } from "@/features/myClient/types"

export default function StepCliente({ setData, next }: Omit<StepProps, "back">) {

  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  const debouncedSearch = useDebounce(search, 500);

  const { setSelectedMyCliente } = useMyClienteStore();

  const [selected, setSelected] = useState<"ativo" | "inativo" | "todos">(
    "todos"
  );

  const { data: dataCliente, isLoading, isError } = useMyClientes(page, perPage, debouncedSearch, selected !== 'todos' ? selected : '');

  const [clientes, setClientes] = useState<Cliente[]>([
    { id: 1, nome: "João Silva", email: "joao@email.com", telefone: "(11) 99999-9999", documento: "123.456.789-00" },
    { id: 2, nome: "Maria Costa", email: "maria@email.com", telefone: "(11) 98888-8888", documento: "987.654.321-00" },
    { id: 3, nome: "Pedro Santos", email: "pedro@email.com", telefone: "(11) 97777-7777", documento: "456.789.123-00" },
  ])
  const [novoCliente, setNovoCliente] = useState<Partial<Cliente>>({})

  const filtered = clientes.filter((c) =>
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.documento?.includes(search)
  )

  const handleSelect = (cliente: MyClienteType) => {
    setData((prev) => ({ ...prev, cliente }))
    next()
  }

  // const handleCreate = () => {
  //   if (!novoCliente.nome) return

  //   const newCliente: Cliente = {
  //     id: Date.now(),
  //     nome: novoCliente.nome,
  //     email: novoCliente.email || "",
  //     telefone: novoCliente.telefone,
  //     documento: novoCliente.documento,
  //   }

  //   setClientes((prev) => [...prev, newCliente])
  //   setData((prev) => ({ ...prev, cliente: newCliente }))
  //   setShowCreateDialog(false)
  //   next()
  // }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Selecionar Cliente</h2>
          <p className="text-muted-foreground mt-1">
            Escolha um cliente existente
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Pesquisar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {dataCliente?.data.map((cliente, index) => (
              <motion.div
                key={cliente.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
                  onClick={() => handleSelect(cliente)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">{cliente.nome}</div>
                          {cliente.email && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <Mail className="h-3 w-3" />
                              <span>{cliente.email}</span>
                            </div>
                          )}
                          {cliente.telefone && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{cliente.telefone}</span>
                            </div>
                          )}
                          {/* {cliente.documento && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <FileText className="h-3 w-3" />
                              <span>{cliente.documento}</span>
                            </div> */}
                          {/* )} */}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {dataCliente?.data.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum cliente encontrado
            </div>
          )}
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          {/* <DialogTrigger asChild>
            <Button variant="outline" className="w-full gap-2">
              <UserPlus className="h-4 w-4" />
              Criar novo cliente
            </Button>
          </DialogTrigger> */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Nome *</Label>
                <Input
                  value={novoCliente.nome || ""}
                  onChange={(e) => setNovoCliente(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <Label>E-mail</Label>
                <Input
                  type="email"
                  value={novoCliente.email || ""}
                  onChange={(e) => setNovoCliente(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input
                  value={novoCliente.telefone || ""}
                  onChange={(e) => setNovoCliente(prev => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <Label>Documento (CPF)</Label>
                <Input
                  value={novoCliente.documento || ""}
                  onChange={(e) => setNovoCliente(prev => ({ ...prev, documento: e.target.value }))}
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1">
                  Salvar e continuar
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  )
}