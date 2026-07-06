'use client'

import { useEffect } from "react"
import { useForm } from "react-hook-form"
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
import { useCreateFinanciador, useUpdateFinanciador } from "@/features/financiador/hooks/useFinanciadorQuery"
import { toast } from "react-toastify"
import { useFinanciadorStore } from "@/features/financiador/store/useFinanciadorStore"
import { useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/store/useAuthStore"

const financiadorSchema = z.object({
  nome_completo: z.string().min(1, "Campo obrigatório"),
  nacionalidade: z.string().min(1, "Campo obrigatório"),
  local_nascimento: z.string().min(1, "Campo obrigatório"),
  data_nascimento: z.string().min(1, "Campo obrigatório"),
  sexo: z.string().min(1, "Campo obrigatório"),
  municipio: z.string().min(1, "Campo obrigatório"),
  bairro: z.string().min(1, "Campo obrigatório"),
  rua: z.string().min(1, "Campo obrigatório"),
  num_apartamento: z.string(),
  andar: z.string(),
  localidade: z.string().min(1, "Campo obrigatório"),
  cod_postal: z.string(),
  telefone: z.string().min(1, "Campo obrigatório"),
  tipo_documento: z.string().min(1, "Campo obrigatório"),
  numero_documento: z.string().min(1, "Campo obrigatório"),
  data_emissao_documento: z.string().min(1, "Campo obrigatório"),
  local_emissao_documento: z.string().min(1, "Campo obrigatório"),
  data_validade_documento: z.string().min(1, "Campo obrigatório"),
  tipo_financiador: z.string().min(1, "Campo obrigatório"),
  tipo_trabalho: z.string().min(1, "Campo obrigatório"),
})

type FormValues = z.infer<typeof financiadorSchema>

interface FinanciadorDialogCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FinanciadorDialogCreate({
  open,
  onOpenChange,
}: FinanciadorDialogCreateProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(financiadorSchema),
    defaultValues: {
      nome_completo: "",
      nacionalidade: "",
      local_nascimento: "",
      data_nascimento: "",
      sexo: "",
      municipio: "",
      bairro: "",
      rua: "",
      num_apartamento: "",
      andar: "",
      localidade: "",
      cod_postal: "",
      telefone: "",
      tipo_documento: "",
      numero_documento: "",
      data_emissao_documento: "",
      local_emissao_documento: "",
      data_validade_documento: "",
      tipo_financiador: "",
      tipo_trabalho: "",
    },
    mode: "onChange",
  });

  const { setSelectedFinanciador, selectedFinanciador } = useFinanciadorStore();
  const created = useCreateFinanciador();
  const updated = useUpdateFinanciador();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: FormValues) => {
    const payload = {
      ...data,
      utilizador_id: String(user?.id) || '',
    };

    // console.log(payload);
    // return;

    if (selectedFinanciador) {
      const financiadorId = selectedFinanciador.id;
      updated.mutate({ id: financiadorId, ...payload }, {
        onSuccess: () => {
          toast.success("Financiador atualizado com sucesso!");
          queryClient.invalidateQueries({
            queryKey: ['financiadores'],
            exact: false,
          });
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Erro ao atualizar financiador!");
        },
      });
    } else {
      created.mutate(payload, {
        onSuccess: () => {
          toast.success("Financiador criado com sucesso!");
          queryClient.invalidateQueries({
            queryKey: ['financiadores'],
            exact: false,
          });
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Erro ao criar financiador!");
        },
      });
    }
  };

  const formatDate = (date: string) => {
    if (!date) return '';
    return date.split('T')[0];
  };

  useEffect(() => {
    if (selectedFinanciador) {
      setValue("nome_completo", selectedFinanciador.nome_completo);
      setValue("nacionalidade", selectedFinanciador.nacionalidade || '');
      setValue("local_nascimento", selectedFinanciador.local_nascimento || '');
      setValue("data_nascimento", formatDate(String(selectedFinanciador.data_nascimento)));
      setValue("sexo", selectedFinanciador.sexo || '');
      setValue("municipio", selectedFinanciador.municipio || '');
      setValue("bairro", selectedFinanciador.bairro || '');
      setValue("rua", selectedFinanciador.rua || '');
      setValue("num_apartamento", selectedFinanciador.num_apartamento || '');
      setValue("andar", selectedFinanciador.andar || '');
      setValue("localidade", selectedFinanciador.localidade || '');
      setValue("cod_postal", selectedFinanciador.cod_postal || '');
      setValue("telefone", selectedFinanciador.telefone || '');
      setValue("tipo_documento", selectedFinanciador.tipo_documento || '');
      setValue("numero_documento", selectedFinanciador.numero_documento || '');
      setValue("data_emissao_documento", formatDate(String(selectedFinanciador.data_emissao_documento)));
      setValue("local_emissao_documento", selectedFinanciador.local_emissao_documento || '');
      setValue("data_validade_documento", formatDate(String(selectedFinanciador.data_validade_documento)));
      setValue("tipo_financiador", selectedFinanciador.tipo_financiador || '');
      setValue("tipo_trabalho", selectedFinanciador.tipo_trabalho || '');
    } else {
      reset();
    }
  }, [selectedFinanciador, setValue, reset]);

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        setSelectedFinanciador(null);
        reset();
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
              {selectedFinanciador ? 'Editar Financiador' : 'Novo Financiador'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={(e) => e.preventDefault()} className="p-6 space-y-8">
            {/* Dados Pessoais */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Dados Pessoais
              </h3>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:grid-cols-3">
                <div className="col-span-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nome Completo <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nome completo"
                    {...register("nome_completo")}
                    className={cn(
                      "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                      "bg-transparent text-gray-800 dark:text-white/90",
                      errors.nome_completo
                        ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                        : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                    )}
                  />
                  {errors.nome_completo && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.nome_completo.message}</p>
                  )}
                </div>

                <div className="col-span-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nacionalidade <span className="text-error-500">*</span>
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
                    <p className="mt-1.5 text-xs text-error-500">{errors.nacionalidade.message}</p>
                  )}
                </div>

                <div className="col-span-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Local de Nascimento <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Local de nascimento"
                    {...register("local_nascimento")}
                    className={cn(
                      "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                      "bg-transparent text-gray-800 dark:text-white/90",
                      errors.local_nascimento
                        ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                        : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                    )}
                  />
                  {errors.local_nascimento && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.local_nascimento.message}</p>
                  )}
                </div>

                <div className="col-span-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Data de Nascimento <span className="text-error-500">*</span>
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
                    <p className="mt-1.5 text-xs text-error-500">{errors.data_nascimento.message}</p>
                  )}
                </div>

                <div className="col-span-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sexo <span className="text-error-500">*</span>
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
                    <p className="mt-1.5 text-xs text-error-500">{errors.sexo.message}</p>
                  )}
                </div>

                <div className="col-span-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Telefone <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
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
                    <p className="mt-1.5 text-xs text-error-500">{errors.telefone.message}</p>
                  )}
                </div>

                <div className="col-span-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tipo de Financiador <span className="text-error-500">*</span>
                  </label>
                  <select
                    {...register("tipo_financiador")}
                    className={cn(
                      "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                      "bg-gray-900 text-gray-800 dark:text-white/90",
                      errors.tipo_financiador
                        ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                        : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                    )}
                  >
                    <option value="">Selecione</option>
                    <option value="nacional">Nacional</option>
                    <option value="estrangeiro">Estrangeiro</option>
                  </select>
                  {errors.tipo_financiador && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.tipo_financiador.message}</p>
                  )}
                </div>

                <div className="col-span-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tipo de Trabalho <span className="text-error-500">*</span>
                  </label>
                  <select
                    {...register("tipo_trabalho")}
                    className={cn(
                      "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                      "bg-gray-900 text-gray-800 dark:text-white/90",
                      errors.tipo_trabalho
                        ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                        : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                    )}
                  >
                    <option value="">Selecione</option>
                    <option value="por_conta_propria">Por conta própria</option>
                    <option value="empregado">Empregado</option>
                  </select>
                  {errors.tipo_trabalho && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.tipo_trabalho.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Endereço
              </h3>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:grid-cols-3">
                <div className="col-span-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Município <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Município"
                    {...register("municipio")}
                    className={cn(
                      "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                      "bg-transparent text-gray-800 dark:text-white/90",
                      errors.municipio
                        ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                        : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                    )}
                  />
                  {errors.municipio && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.municipio.message}</p>
                  )}
                </div>

                <div className="col-span-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bairro <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Bairro"
                    {...register("bairro")}
                    className={cn(
                      "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                      "bg-transparent text-gray-800 dark:text-white/90",
                      errors.bairro
                        ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                        : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                    )}
                  />
                  {errors.bairro && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.bairro.message}</p>
                  )}
                </div>

                <div className="col-span-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rua <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Rua"
                    {...register("rua")}
                    className={cn(
                      "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                      "bg-transparent text-gray-800 dark:text-white/90",
                      errors.rua
                        ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                        : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                    )}
                  />
                  {errors.rua && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.rua.message}</p>
                  )}
                </div>

                <div className="col-span-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nº Apartamento
                  </label>
                  <input
                    type="text"
                    placeholder="Nº"
                    {...register("num_apartamento")}
                    className={cn(
                      "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                      "bg-transparent text-gray-800 dark:text-white/90",
                      "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                    )}
                  />
                </div>

                <div className="col-span-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Andar
                  </label>
                  <input
                    type="text"
                    placeholder="Andar"
                    {...register("andar")}
                    className={cn(
                      "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                      "bg-transparent text-gray-800 dark:text-white/90",
                      "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                    )}
                  />
                </div>

                <div className="col-span-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Localidade <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Localidade"
                    {...register("localidade")}
                    className={cn(
                      "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                      "bg-transparent text-gray-800 dark:text-white/90",
                      errors.localidade
                        ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                        : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                    )}
                  />
                  {errors.localidade && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.localidade.message}</p>
                  )}
                </div>

                <div className="col-span-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    placeholder="Código postal"
                    {...register("cod_postal")}
                    className={cn(
                      "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                      "bg-transparent text-gray-800 dark:text-white/90",
                      "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Documentos */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Documentos
              </h3>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:grid-cols-3">
                <div className="col-span-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tipo de Documento <span className="text-error-500">*</span>
                  </label>
                  <select
                    {...register("tipo_documento")}
                    className={cn(
                      "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                      "bg-gray-900 text-gray-800 dark:text-white/90",
                      errors.tipo_documento
                        ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                        : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                    )}
                  >
                    <option value="">Selecione</option>
                    <option value="bi">BI</option>
                    <option value="passaporte">Passaporte</option>
                  </select>
                  {errors.tipo_documento && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.tipo_documento.message}</p>
                  )}
                </div>

                <div className="col-span-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nº do Documento <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Número do documento"
                    {...register("numero_documento")}
                    className={cn(
                      "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                      "bg-transparent text-gray-800 dark:text-white/90",
                      errors.numero_documento
                        ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                        : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                    )}
                  />
                  {errors.numero_documento && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.numero_documento.message}</p>
                  )}
                </div>

                <div className="col-span-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Data de Emissão <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("data_emissao_documento")}
                    className={cn(
                      "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                      "bg-transparent text-gray-800 dark:text-white/90",
                      errors.data_emissao_documento
                        ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                        : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                    )}
                  />
                  {errors.data_emissao_documento && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.data_emissao_documento.message}</p>
                  )}
                </div>

                <div className="col-span-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Local de Emissão <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Local de emissão"
                    {...register("local_emissao_documento")}
                    className={cn(
                      "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                      "bg-transparent text-gray-800 dark:text-white/90",
                      errors.local_emissao_documento
                        ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                        : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                    )}
                  />
                  {errors.local_emissao_documento && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.local_emissao_documento.message}</p>
                  )}
                </div>

                <div className="col-span-1">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Data de Validade <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("data_validade_documento")}
                    className={cn(
                      "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                      "bg-transparent text-gray-800 dark:text-white/90",
                      errors.data_validade_documento
                        ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                        : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                    )}
                  />
                  {errors.data_validade_documento && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.data_validade_documento.message}</p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-11 px-6"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={() => handleSubmit(onSubmit)()}
                disabled={created.isPending || updated.isPending}
                className="gap-2 h-11 px-6"
              >
                {(created.isPending || updated.isPending) && <Loader2 className="h-4 w-4 animate-spin" />}
                {(created.isPending || updated.isPending) ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
