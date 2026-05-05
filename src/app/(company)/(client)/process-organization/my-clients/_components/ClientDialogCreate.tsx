// components/cliente/ClientDialogCreate.tsx
'use client'

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { createMyCliente } from "@/features/myClient/api/myClientApi"
import { useCreateMyCliente, useUpdateMyCliente } from "@/features/myClient/hooks/useMyClientsQuery"
import { toast } from "react-toastify"
import { useMyClienteStore } from "@/features/myClient/store/useMyClienteStore"
import { useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/store/useAuthStore"

// Schema de validação
const clientSchema = z.object({
  nome: z.string().min(1, "Campo obrigatório"),
  nome_pai: z.string().min(1, "Campo obrigatório"),
  nome_mae: z.string().min(1, "Campo obrigatório"),
  email: z.string().email("Email inválido").or(z.literal("")),
  telefone: z
    .string()
    .refine((val) => val === "" || /^\d{9}$/.test(val), {
      message: "O telefone deve ter exatamente 9 dígitos numéricos",
    }),
  sexo: z.string(),
  estado_civil: z.string(),
  nacionalidade: z.string(),
  naturalidade: z.string(),
  data_nascimento: z.string(),
  endereco: z.string(),
  n_bi: z.string(),
  n_passaporte: z.string(),
  emitido_em: z.string().optional(),
  data_emissao: z.string().optional(),
  valido_ate: z.string().optional(),
})

type FormValues = z.infer<typeof clientSchema>

interface ClientDialogCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (data: FormValues) => void
}

export function ClientDialogCreate({
  open,
  onOpenChange,
  onSuccess
}: ClientDialogCreateProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    setValue,
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nome: "",
      nome_pai: "",
      nome_mae: "",
      sexo: "",
      email: "",
      telefone: "",
      data_nascimento: "",
      nacionalidade: "",
      naturalidade: "",
      endereco: "",
      n_bi: "",
      n_passaporte: "",
      emitido_em: "",
      data_emissao: "",
      valido_ate: "",
    },
    mode: "onChange",
  });

  const { setSelectedMyCliente, selectedMyCliente } = useMyClienteStore();

  const createdClient = useCreateMyCliente();
  const updatedClient = useUpdateMyCliente();

  const { user } = useAuthStore();

  // Reset form quando o modal fechar
  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset]);

  const queryClient = useQueryClient();

  const onSubmit = async (data: FormValues) => {

    const payload = {
      ...data,
      utilizador_id: user?.id || '',
    }

    console.log(payload);
    // return;

    if (selectedMyCliente) {
      updatedClient.mutate({ id: selectedMyCliente.id, ...payload }, {
        onSuccess: () => {
          toast.success("Cliente atualizado com sucesso!");
          queryClient.invalidateQueries({
            queryKey: ['myclientes'],
            exact: false
          });
          onOpenChange(false);
        },
        onError: (error: any) => {
          console.log(error);
          toast.error("Erro ao atualizar cliente!");
        }
      });
    } else {
      createdClient.mutate(payload, {
        onSuccess: () => {
          toast.success("Cliente criado com sucesso!");
          queryClient.invalidateQueries({
            queryKey: ['myclientes'],
            exact: false
          });
          onOpenChange(false);
        },
        onError: (error: any) => {
          console.log(error);
          toast.error("Erro ao criar cliente!");
        }
      });
    }
  }

  const formatDate = (date: string) => {
    if (!date) return '';
    return date.split('T')[0];
  };

  useEffect(() => {
    if (selectedMyCliente) {
      setValue("nome", selectedMyCliente.nome);
      setValue("nome_pai", selectedMyCliente.nome_pai);
      setValue("nome_mae", selectedMyCliente.nome_mae);
      setValue("email", selectedMyCliente.email);
      setValue("telefone", selectedMyCliente.telefone || '');
      setValue("estado_civil", selectedMyCliente.estado_civil || '');
      setValue("nacionalidade", selectedMyCliente.nacionalidade || '');
      setValue("naturalidade", selectedMyCliente.naturalidade || '');
      setValue("n_bi", selectedMyCliente.n_bi || '');
      setValue("n_passaporte", selectedMyCliente.n_passaporte || '');

      setValue("data_nascimento", formatDate(String(selectedMyCliente.data_nascimento)));
      setValue("data_emissao", formatDate(String(selectedMyCliente.data_emissao)));
      setValue("valido_ate", formatDate(String(selectedMyCliente.valido_ate)));

      setValue("emitido_em", selectedMyCliente.emitido_em);
      setValue("sexo", selectedMyCliente.sexo);
    } else {
      reset();
    }
  }, [selectedMyCliente, setValue, reset]);



  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        setSelectedMyCliente(null); // Limpa o cliente selecionado ao fechar
        reset(); // Reset do formulário
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="min-w-[90%] md:min-w-[80%] max-h-[90vh] overflow-y-auto p-0 rounded-xl border border-gray-200 dark:border-white/[0.05]">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-white/[0.05]">
            <DialogTitle className="text-lg text-gray-700 dark:text-gray-300">
              {selectedMyCliente ? 'Editar Cliente' : 'Novo Cliente'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit, (error) => console.log(error))} className="p-6">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:grid-cols-6">
              {/* Nome */}
              <div className="col-span-1 md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nome Completo
                </label>
                <input
                  type="text"
                  placeholder="Nome"
                  {...register("nome")}
                  className={cn(
                    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                    "bg-transparent text-gray-800 dark:text-white/90",
                    errors.nome
                      ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                      : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                  )}
                />
                {errors.nome && (
                  <p className="mt-1.5 text-xs text-error-500">
                    {errors.nome.message}
                  </p>
                )}
              </div>

              {/* Nome do pai */}
              <div className="col-span-1 md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nome do Pai
                </label>
                <input
                  type="text"
                  placeholder="Nome do pai"
                  {...register("nome_pai")}
                  className={cn(
                    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                    "bg-transparent text-gray-800 dark:text-white/90",
                    errors.nome_pai
                      ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                      : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                  )}
                />
                {errors.nome_pai && (
                  <p className="mt-1.5 text-xs text-error-500">
                    {errors.nome_pai.message}
                  </p>
                )}
              </div>

              {/* Nome da Mãe */}
              <div className="col-span-1 md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nome da Mãe
                </label>
                <input
                  type="text"
                  placeholder="Nome da mãe"
                  {...register("nome_mae")}
                  className={cn(
                    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                    "bg-transparent text-gray-800 dark:text-white/90",
                    errors.nome_mae
                      ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                      : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                  )}
                />
                {errors.nome_mae && (
                  <p className="mt-1.5 text-xs text-error-500">
                    {errors.nome_mae.message}
                  </p>
                )}
              </div>

              {/* Sexo */}
              <div className="col-span-1 md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sexo
                </label>
                <select
                  {...register("sexo")}
                  className={cn(
                    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                    "bg-gray-900 text-gray-800 dark:text-white/90",
                    errors.sexo
                      ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                      : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                  )}
                >
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
                {errors.sexo && (
                  <p className="mt-1.5 text-xs text-error-500">
                    {errors.sexo.message}
                  </p>
                )}
              </div>

              {/* Estado civil */}
              <div className="col-span-1 md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Estado civil
                </label>
                <select
                  {...register("estado_civil")}
                  className={cn(
                    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                    "bg-gray-900 text-gray-800 dark:text-white/90",
                    errors.estado_civil
                      ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                      : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                  )}
                >
                  <option value="">Selecione</option>
                  <option value="Solteiro">Solteiro</option>
                  <option value="Casado">Casado</option>
                  <option value="Viuvo">Viuvo</option>
                  <option value="Divorciado">Divorciado</option>
                </select>
                {errors.estado_civil && (
                  <p className="mt-1.5 text-xs text-error-500">
                    {errors.estado_civil.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="col-span-1 md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  className={cn(
                    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                    "bg-transparent text-gray-800 dark:text-white/90",
                    errors.email
                      ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                      : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                  )}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-error-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Telefone */}
              <div className="col-span-1 md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Telefone
                </label>
                <input
                  type="number"
                  placeholder="Telefone"
                  {...register("telefone")}
                  className={cn(
                    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                    "bg-transparent text-gray-800 dark:text-white/90",
                    errors.telefone
                      ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                      : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                  )}
                />
                {errors.telefone && (
                  <p className="mt-1.5 text-xs text-error-500">
                    {errors.telefone.message}
                  </p>
                )}
              </div>

              {/* Nacionalidade */}
              <div className="col-span-1 md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nacionalidade
                </label>
                <input
                  type="text"
                  placeholder="Nacionalidade"
                  {...register("nacionalidade")}
                  className={cn(
                    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                    "bg-transparent text-gray-800 dark:text-white/90",
                    errors.nacionalidade
                      ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                      : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                  )}
                />
                {errors.nacionalidade && (
                  <p className="mt-1.5 text-xs text-error-500">
                    {errors.nacionalidade.message}
                  </p>
                )}
              </div>

              {/* Nº BI/Passaporte */}
              <div className="col-span-1 md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nº BI
                </label>
                <input
                  type="text"
                  placeholder="Informe o Passaporte"
                  {...register("n_bi")}
                  className={cn(
                    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                    "bg-transparent text-gray-800 dark:text-white/90",
                    errors.n_bi
                      ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                      : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                  )}
                />
                {errors.n_bi && (
                  <p className="mt-1.5 text-xs text-error-500">
                    {errors.n_bi.message}
                  </p>
                )}
              </div>

              {/* Naturalidade */}
              <div className="col-span-1 md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Naturalidade
                </label>
                <input
                  type="text"
                  placeholder="Natural de"
                  {...register("naturalidade")}
                  className={cn(
                    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                    "bg-transparent text-gray-800 dark:text-white/90",
                    errors.naturalidade
                      ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                      : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                  )}
                />
                {errors.naturalidade && (
                  <p className="mt-1.5 text-xs text-error-500">
                    {errors.naturalidade.message}
                  </p>
                )}
              </div>

              {/* Data de Nascimento */}
              <div className="col-span-1 md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  {...register("data_nascimento")}
                  className={cn(
                    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                    "bg-transparent text-gray-800 dark:text-white/90",
                    errors.data_nascimento
                      ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                      : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                  )}
                />
                {errors.data_nascimento && (
                  <p className="mt-1.5 text-xs text-error-500">
                    {errors.data_nascimento.message}
                  </p>
                )}
              </div>

              {/* Nº BI/Passaporte */}
              <div className="col-span-1 md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nº Passaporte
                </label>
                <input
                  type="text"
                  placeholder="Informe o Passaporte"
                  {...register("n_passaporte")}
                  className={cn(
                    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                    "bg-transparent text-gray-800 dark:text-white/90",
                    errors.n_passaporte
                      ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                      : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                  )}
                />
                {errors.n_passaporte && (
                  <p className="mt-1.5 text-xs text-error-500">
                    {errors.n_passaporte.message}
                  </p>
                )}
              </div>

              {/* Data de Emissão */}
              <div className="col-span-1 md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data de Emissão
                </label>
                <input
                  type="date"
                  {...register("data_emissao")}
                  className={cn(
                    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                    "bg-transparent text-gray-800 dark:text-white/90",
                    "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                  )}
                />
              </div>


              {/* Válido até */}
              <div className="col-span-1 md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Válido até
                </label>
                <input
                  type="date"
                  {...register("valido_ate")}
                  className={cn(
                    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                    "bg-transparent text-gray-800 dark:text-white/90",
                    "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                  )}
                />
              </div>

              {/* Emitido em */}
              <div className="col-span-1 md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Emitido em
                </label>
                <input
                  type="text"
                  placeholder="Local de emissão"
                  {...register("emitido_em")}
                  className={cn(
                    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                    "bg-transparent text-gray-800 dark:text-white/90",
                    errors.emitido_em
                      ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                      : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                  )}
                />
                {errors.emitido_em && (
                  <p className="mt-1.5 text-xs text-error-500">
                    {errors.emitido_em.message}
                  </p>
                )}
              </div>

              {/* Endereço */}
              {/* <div className="col-span-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Endereço
                </label>
                <input
                  type="text"
                  placeholder="Endereço"
                  {...register("endereco")}
                  className={cn(
                    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                    "bg-transparent text-gray-800 dark:text-white/90",
                    "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                  )}
                />
                {errors.endereco && (
                  <p className="mt-1.5 text-xs text-error-500">
                    {errors.endereco.message}
                  </p>
                )}
              </div> */}
            </div>

            <DialogFooter className="mt-6 pt-4 flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-11 px-6"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createdClient.isPending || updatedClient.isPending}
                className="gap-2 h-11 px-6"
              >
                {(createdClient.isPending || updatedClient.isPending) && <Loader2 className="h-4 w-4 animate-spin" />}
                {(createdClient.isPending || updatedClient.isPending) ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}