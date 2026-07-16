// components/cliente/ClientDialogCreate.tsx
'use client'

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { StepProgress } from "@/components/ui/StepProgress"
import { Loader2, ArrowLeft, ArrowRight, Upload, FileText, X } from "lucide-react"
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
  nome_pai: z.string(),
  nome_mae: z.string(),
  email: z.string().min(1, "Campo obrigatório").email("Email inválido"),
  telefone: z
    .string()
    .min(1, "Campo obrigatório")
    .refine((val) => /^\d{9}$/.test(val), {
      message: "O telefone deve ter exatamente 9 dígitos numéricos",
    }),
  sexo: z.string().min(1, "Campo obrigatório"),
  estado_civil: z.string().min(1, "Campo obrigatório"),
  nacionalidade: z.string().min(1, "Campo obrigatório"),
  naturalidade: z.string().min(1, "Campo obrigatório"),
  data_nascimento: z.string().min(1, "Campo obrigatório"),
  endereco: z.string(),
  n_bi: z.string().min(1, "Campo obrigatório"),
  n_passaporte: z.string().min(1, "Campo obrigatório"),
  emitido_em: z.string().min(1, "Campo obrigatório"),
  data_emissao: z.string().min(1, "Campo obrigatório"),
  valido_ate: z.string().min(1, "Campo obrigatório"),
  pais_nascimento: z.string().min(1, "Campo obrigatório"),
  tipo_documento_viagem: z.string().min(1, "Campo obrigatório"),
  outro_tipo_documento: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.tipo_documento_viagem === "outro" && !data.outro_tipo_documento) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Especifique o tipo de documento",
      path: ["outro_tipo_documento"],
    });
  }
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
    formState: { errors },
    reset,
    setValue,
    watch,
    trigger,
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
      pais_nascimento: "",
      tipo_documento_viagem: "",
      outro_tipo_documento: "",
    },
    mode: "onChange",
  });

  const tipoDocumentoViagem = watch("tipo_documento_viagem");

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const stepLabels = ["Dados Pessoais", "Contato", "Documentação"];

  const [biFile, setBiFile] = useState<File | null>(null);
  const [passaporteFile, setPassaporteFile] = useState<File | null>(null);
  const [fileErrors, setFileErrors] = useState<{ bi: boolean; passaporte: boolean }>({ bi: false, passaporte: false });

  const stepFields: Record<number, string[]> = {
    1: ["nome", "nome_pai", "nome_mae", "sexo", "estado_civil", "data_nascimento", "pais_nascimento"],
    2: ["email", "telefone", "nacionalidade", "naturalidade"],
    3: ["n_bi", "n_passaporte", "tipo_documento_viagem", "outro_tipo_documento", "emitido_em", "data_emissao", "valido_ate"],
  };

  const handleNext = async () => {
    const fields = stepFields[currentStep];
    if (fields.length > 0) {
      const valid = await trigger(fields as any);
      if (!valid) return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const { setSelectedMyCliente, selectedMyCliente } = useMyClienteStore();

  const createdClient = useCreateMyCliente();
  const updatedClient = useUpdateMyCliente();

  const { user } = useAuthStore();

  // Reset form quando o modal fechar
  useEffect(() => {
    if (!open) {
      setCurrentStep(1);
      setBiFile(null);
      setPassaporteFile(null);
      setFileErrors({ bi: false, passaporte: false });
      reset()
    }
  }, [open, reset]);

  const queryClient = useQueryClient();

  const onSubmit = async (data: FormValues) => {

    // Validar arquivos obrigatórios na criação
    if (!selectedMyCliente?.id) {
      const errors = {
        bi: !biFile,
        passaporte: !passaporteFile,
      };
      setFileErrors(errors);
      if (errors.bi || errors.passaporte) {
        toast.error("É obrigatório anexar o BI e o Passaporte em PDF.");
        return;
      }
    }

    const tipo_documento_viagem = data.tipo_documento_viagem === "outro"
      ? data.outro_tipo_documento
      : data.tipo_documento_viagem;

    const formData = new FormData();
    formData.append('nome', data.nome);
    formData.append('nome_pai', data.nome_pai || '');
    formData.append('nome_mae', data.nome_mae || '');
    formData.append('sexo', data.sexo);
    formData.append('estado_civil', data.estado_civil);
    formData.append('email', data.email);
    formData.append('telefone', data.telefone);
    formData.append('data_nascimento', data.data_nascimento);
    formData.append('nacionalidade', data.nacionalidade);
    formData.append('naturalidade', data.naturalidade);
    formData.append('endereco', data.endereco || '');
    formData.append('n_bi', data.n_bi);
    formData.append('n_passaporte', data.n_passaporte);
    formData.append('emitido_em', data.emitido_em);
    formData.append('data_emissao', data.data_emissao);
    formData.append('valido_ate', data.valido_ate);
    formData.append('pais_nascimento', data.pais_nascimento);
    formData.append('tipo_documento_viagem', tipo_documento_viagem!!);
    formData.append('outro_tipo_documento', data.outro_tipo_documento || '');
    formData.append('utilizador_id', String(user?.id) || '');

    if (biFile) formData.append('bi', biFile);
    if (passaporteFile) formData.append('passaporte', passaporteFile);

    const clienteId = selectedMyCliente?.id;

    if (clienteId) {
      formData.append('id', String(clienteId));
      updatedClient.mutate(formData, {
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
      createdClient.mutate(formData, {
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

      setValue("emitido_em", selectedMyCliente.emitido_em || '');
      setValue("sexo", selectedMyCliente.sexo);
      setValue("pais_nascimento", selectedMyCliente.pais_nascimento || '');

      const tipoDoc = selectedMyCliente.tipo_documento_viagem;
      const opcoesPassaporte = ["passaporte_comum", "passaporte_diplomatico", "passaporte_servico", "passaporte_oficial", "passaporte_especial"];
      if (tipoDoc && !opcoesPassaporte.includes(tipoDoc) && tipoDoc !== "outro") {
        setValue("tipo_documento_viagem", "outro");
        setValue("outro_tipo_documento", tipoDoc);
      } else {
        setValue("tipo_documento_viagem", tipoDoc || '');
        setValue("outro_tipo_documento", '');
      }
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

          <form onSubmit={(e) => e.preventDefault()} className="p-6">
            <StepProgress
              currentStep={currentStep}
              totalSteps={totalSteps}
              steps={stepLabels}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:grid-cols-6">
                  {currentStep === 1 && (
                    <>
                      {/* Nome */}
                      <div className="col-span-1 md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Nome Completo <span className="text-error-500">*</span>
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
                          <p className="mt-1.5 text-xs text-error-500">
                            {errors.sexo.message}
                          </p>
                        )}
                      </div>

                      {/* Estado civil */}
                      <div className="col-span-1 md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Estado civil <span className="text-error-500">*</span>
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

                      {/* Data de Nascimento */}
                      <div className="col-span-1 md:col-span-2">
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
                          <p className="mt-1.5 text-xs text-error-500">
                            {errors.data_nascimento.message}
                          </p>
                        )}
                      </div>

                      {/* País de Nascimento */}
                      <div className="col-span-1 md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          País de Nascimento <span className="text-error-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="País de nascimento"
                          {...register("pais_nascimento")}
                          className={cn(
                            "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                            "bg-transparent text-gray-800 dark:text-white/90",
                            errors.pais_nascimento
                              ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                              : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                          )}
                        />
                        {errors.pais_nascimento && (
                          <p className="mt-1.5 text-xs text-error-500">
                            {errors.pais_nascimento.message}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      {/* Email */}
                      <div className="col-span-1 md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email <span className="text-error-500">*</span>
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
                          Telefone <span className="text-error-500">*</span>
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
                          <p className="mt-1.5 text-xs text-error-500">
                            {errors.nacionalidade.message}
                          </p>
                        )}
                      </div>

                      {/* Naturalidade */}
                      <div className="col-span-1 md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Naturalidade <span className="text-error-500">*</span>
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
                    </>
                  )}

                  {currentStep === 3 && (
                    <>
                      {/* Nº BI */}
                      <div className="col-span-1 md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Nº BI <span className="text-error-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Informe o BI"
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

                      {/* Nº Passaporte */}
                      <div className="col-span-1 md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Nº Passaporte <span className="text-error-500">*</span>
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

                      {/* Tipo de Documento de Viagem */}
                      <div className="col-span-1 md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Tipo de Documento de Viagem <span className="text-error-500">*</span>
                        </label>
                        <select
                          {...register("tipo_documento_viagem")}
                          className={cn(
                            "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                            "bg-gray-900 text-gray-800 dark:text-white/90",
                            "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                          )}
                        >
                          <option value="">Selecione</option>
                          <option value="passaporte_comum">Passaporte Comum</option>
                          <option value="passaporte_diplomatico">Passaporte Diplomático</option>
                          <option value="passaporte_servico">Passaporte de Serviço</option>
                          <option value="passaporte_oficial">Passaporte Oficial</option>
                          <option value="passaporte_especial">Passaporte Especial</option>
                          <option value="outro">Outro (especificar)</option>
                        </select>
                      </div>

                      {/* Outro Tipo de Documento (condicional) */}
                      {tipoDocumentoViagem === "outro" && (
                        <div className="col-span-1 md:col-span-2">
                          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Especifique o Documento <span className="text-error-500">*</span>
                        </label>
                          <input
                            type="text"
                            placeholder="Digite o tipo de documento"
                            {...register("outro_tipo_documento")}
                            className={cn(
                              "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                              "bg-transparent text-gray-800 dark:text-white/90",
                              errors.outro_tipo_documento
                                ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                                : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                            )}
                          />
                          {errors.outro_tipo_documento && (
                            <p className="mt-1.5 text-xs text-error-500">
                              {errors.outro_tipo_documento.message}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Data de Emissão */}
                      <div className="col-span-1 md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Data de Emissão <span className="text-error-500">*</span>
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
                          Válido até <span className="text-error-500">*</span>
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
                          Emitido em <span className="text-error-500">*</span>
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

                      {/* Upload BI */}
                      <div className="col-span-1 md:col-span-3">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          BI (PDF) {!selectedMyCliente?.id && <span className="text-error-500">*</span>}
                        </label>
                        <div
                          className={cn(
                            "flex flex-col items-center justify-center h-28 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
                            "bg-transparent hover:bg-gray-50 dark:hover:bg-white/5",
                            biFile
                              ? "border-brand-300 dark:border-brand-500"
                              : fileErrors.bi
                                ? "border-error-500"
                                : "border-gray-300 dark:border-white/10"
                          )}
                          onClick={() => document.getElementById('bi-upload')?.click()}
                        >
                          {biFile ? (
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <FileText className="h-5 w-5 shrink-0" />
                              <span className="truncate max-w-[200px]">{biFile.name}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setBiFile(null)
                                }}
                                className="text-error-500 hover:text-error-600 shrink-0"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1 text-sm text-gray-400">
                              <Upload className="h-6 w-6" />
                              <span>Clique para selecionar o PDF do BI</span>
                            </div>
                          )}
                        </div>
                        <input
                          id="bi-upload"
                          type="file"
                          accept=".pdf,application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            setBiFile(e.target.files?.[0] || null)
                            setFileErrors((prev) => ({ ...prev, bi: false }))
                          }}
                        />
                        {fileErrors.bi && (
                          <p className="mt-1.5 text-xs text-error-500">O BI em PDF é obrigatório</p>
                        )}
                      </div>

                      {/* Upload Passaporte */}
                      <div className="col-span-1 md:col-span-3">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Passaporte (PDF) {!selectedMyCliente?.id && <span className="text-error-500">*</span>}
                        </label>
                        <div
                          className={cn(
                            "flex flex-col items-center justify-center h-28 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
                            "bg-transparent hover:bg-gray-50 dark:hover:bg-white/5",
                            passaporteFile
                              ? "border-brand-300 dark:border-brand-500"
                              : fileErrors.passaporte
                                ? "border-error-500"
                                : "border-gray-300 dark:border-white/10"
                          )}
                          onClick={() => document.getElementById('passaporte-upload')?.click()}
                        >
                          {passaporteFile ? (
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <FileText className="h-5 w-5 shrink-0" />
                              <span className="truncate max-w-[200px]">{passaporteFile.name}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setPassaporteFile(null)
                                }}
                                className="text-error-500 hover:text-error-600 shrink-0"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1 text-sm text-gray-400">
                              <Upload className="h-6 w-6" />
                              <span>Clique para selecionar o PDF do Passaporte</span>
                            </div>
                          )}
                        </div>
                        <input
                          id="passaporte-upload"
                          type="file"
                          accept=".pdf,application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            setPassaporteFile(e.target.files?.[0] || null)
                            setFileErrors((prev) => ({ ...prev, passaporte: false }))
                          }}
                        />
                        {fileErrors.passaporte && (
                          <p className="mt-1.5 text-xs text-error-500">O Passaporte em PDF é obrigatório</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <DialogFooter className="mt-6 pt-4 flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-11 px-6"
              >
                Cancelar
              </Button>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="gap-2 h-11 px-6"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              )}
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="gap-2 h-11 px-6"
                >
                  Continuar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => handleSubmit(onSubmit)()}
                  disabled={createdClient.isPending || updatedClient.isPending}
                  className="gap-2 h-11 px-6"
                >
                  {(createdClient.isPending || updatedClient.isPending) && <Loader2 className="h-4 w-4 animate-spin" />}
                  {(createdClient.isPending || updatedClient.isPending) ? "Salvando..." : "Salvar"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}