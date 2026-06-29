'use client'

import { useEffect, useState } from "react"
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
import { Loader2, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCreateCentroFormacao, useUpdateCentroFormacao } from "@/features/centroFormacao/hooks/useCentroFormacaoQuery"
import { toast } from "react-toastify"
import { useCentroFormacaoStore } from "@/features/centroFormacao/store/useCentroFormacaoStore"
import { useQueryClient } from "@tanstack/react-query"

const schema = z.object({
  nome: z.string().min(1, "Campo obrigatório"),
  descricao: z.string().min(1, "Campo obrigatório"),
})

type FormValues = z.infer<typeof schema>

interface CentroFormacaoDialogCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CentroFormacaoDialogCreate({
  open,
  onOpenChange,
}: CentroFormacaoDialogCreateProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      descricao: "",
    },
    mode: "onChange",
  });

  const { setSelectedCentroFormacao, selectedCentroFormacao } = useCentroFormacaoStore();
  const created = useCreateCentroFormacao();
  const updated = useUpdateCentroFormacao();
  const queryClient = useQueryClient();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!open) {
      reset();
      setImagePreview(null);
      setImageFile(null);
    }
  }, [open, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append('nome', data.nome);
    formData.append('descricao', data.descricao);

    if (imageFile) {
      formData.append('imagem', imageFile);
    }

    if (selectedCentroFormacao) {
      formData.append('id', String(selectedCentroFormacao.id));
      updated.mutate(formData, {
        onSuccess: () => {
          toast.success("Centro de formação atualizado com sucesso!");
          queryClient.invalidateQueries({ queryKey: ['centros-formacao'], exact: false });
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Erro ao atualizar centro de formação!");
        },
      });
    } else {
      created.mutate(formData, {
        onSuccess: () => {
          toast.success("Centro de formação criado com sucesso!");
          queryClient.invalidateQueries({ queryKey: ['centros-formacao'], exact: false });
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Erro ao criar centro de formação!");
        },
      });
    }
  };

  useEffect(() => {
    if (selectedCentroFormacao) {
      setValue("nome", selectedCentroFormacao.nome);
      setValue("descricao", selectedCentroFormacao.descricao);
      if (selectedCentroFormacao.imagem) {
        if (typeof selectedCentroFormacao.imagem === 'string') {
          setImagePreview(selectedCentroFormacao.imagem);
        } else {
          setImagePreview(URL.createObjectURL(selectedCentroFormacao.imagem));
          setImageFile(selectedCentroFormacao.imagem);
        }
      }
    } else {
      reset();
      setImagePreview(null);
      setImageFile(null);
    }
  }, [selectedCentroFormacao, setValue, reset]);

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        setSelectedCentroFormacao(null);
        reset();
        setImagePreview(null);
        setImageFile(null);
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0 rounded-xl border border-gray-200 dark:border-white/[0.05]">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-white/[0.05]">
            <DialogTitle className="text-lg text-gray-700 dark:text-gray-300">
              {selectedCentroFormacao ? 'Editar Centro de Formação' : 'Novo Centro de Formação'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={(e) => e.preventDefault()} className="p-6 space-y-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nome do centro de formação"
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
                <p className="mt-1.5 text-xs text-error-500">{errors.nome.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Descrição <span className="text-error-500">*</span>
              </label>
              <textarea
                placeholder="Descrição do centro de formação"
                rows={4}
                {...register("descricao")}
                className={cn(
                  "w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden resize-none",
                  "bg-transparent text-gray-800 dark:text-white/90",
                  errors.descricao
                    ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                    : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                )}
              />
              {errors.descricao && (
                <p className="mt-1.5 text-xs text-error-500">{errors.descricao.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Imagem
              </label>
              <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors">
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, JPEG (MAX. 5MB)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <DialogFooter className="flex gap-3 justify-end pt-4">
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
