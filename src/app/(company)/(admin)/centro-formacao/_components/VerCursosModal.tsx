'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { Resolver } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCourses, useCreateCourse } from "@/features/course/hooks/useCourseQuery"
import { formatarMoeda } from "@/lib/helpers"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { cn } from "@/lib/utils"
import {
  X,
  GraduationCap,
  Plus,
  ArrowLeft,
  Loader2,
  Upload,
} from "lucide-react"

const schema = z.object({
  nome: z.string().min(1, "Campo obrigatório"),
  local: z.string().min(1, "Campo obrigatório"),
  preco: z.string(),
  duracao: z.string().min(1, "Campo obrigatório"),
  descricao: z.string(),
})

type FormValues = z.infer<typeof schema>

interface VerCursosModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  centroId: number
  centroNome: string
}

export function VerCursosModal({ open, onOpenChange, centroId, centroNome }: VerCursosModalProps) {
  const [view, setView] = useState<"list" | "form">("list")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const queryClient = useQueryClient()
  const create = useCreateCourse()
  const { data: coursesData, isLoading } = useCourses(1, 999, "", "", centroId)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      nome: "",
      local: "",
      preco: "0",
      duracao: "",
      descricao: "",
    },
  })

  const cursos = coursesData?.data || []

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = (data: FormValues) => {
    const formData = new FormData()
    formData.append("nome", data.nome)
    formData.append("local", data.local)
    formData.append("preco", data.preco.toString())
    formData.append("duracao", data.duracao)
    formData.append("descricao", data.descricao || "")
    formData.append("centro_id", String(centroId))

    if (imageFile) {
      formData.append("imagem", imageFile)
    }

    create.mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["courses"], exact: false })
        toast.success("Curso criado com sucesso!")
        setImagePreview(null)
        setImageFile(null)
        reset()
        setView("list")
      },
      onError: (error: any) => {
        if (error.response?.data?.errors) {
          const firstError = Object.values(error.response.data.errors)[0]
          toast.error(String(firstError))
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message)
        } else {
          toast.error("Erro ao criar curso")
        }
      },
    })
  }

  const handleBack = () => {
    setView("list")
    reset()
    setImagePreview(null)
    setImageFile(null)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          setView("list")
          setImagePreview(null)
          setImageFile(null)
          reset()
        }
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col p-0 rounded-xl border border-gray-200 dark:border-white/[0.05]">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-white/[0.05]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg text-gray-700 dark:text-gray-300">
                  {view === "list" ? "Cursos do Centro" : "Novo Curso"}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-0.5">{centroNome}</p>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full p-1 hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {view === "list" ? (
            <>
              <div className="flex justify-end mb-4">
                <Button
                  onClick={() => setView("form")}
                  className="gap-2"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  Novo Curso
                </Button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : cursos.length === 0 ? (
                <div className="text-center py-12">
                  <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">
                    Nenhum curso encontrado neste centro
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cursos.map((curso) => (
                    <div
                      key={curso.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-white/[0.05] hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      {curso.imagem ? (
                        <img
                          src={typeof curso.imagem === "string" ? curso.imagem : ""}
                          alt={curso.nome}
                          className="w-14 h-14 object-cover rounded-lg shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                          <GraduationCap className="h-6 w-6" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                          {curso.nome}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span>{curso.local}</span>
                          <span>•</span>
                          <span>{formatarMoeda(Number(curso.preco))}</span>
                          <span>•</span>
                          <span>{curso.duracao}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nome <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nome do curso"
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
                    Local <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Local"
                    {...register("local")}
                    className={cn(
                      "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                      "bg-transparent text-gray-800 dark:text-white/90",
                      errors.local
                        ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                        : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                    )}
                  />
                  {errors.local && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.local.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Preço
                  </label>
                  <input
                    type="text"
                    placeholder="Preço"
                    {...register("preco")}
                    className={cn(
                      "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                      "bg-transparent text-gray-800 dark:text-white/90",
                      "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                    )}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Duração <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Duração"
                    {...register("duracao")}
                    className={cn(
                      "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
                      "bg-transparent text-gray-800 dark:text-white/90",
                      errors.duracao
                        ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                        : "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                    )}
                  />
                  {errors.duracao && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.duracao.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Descrição
                  </label>
                  <textarea
                    placeholder="Descrição do curso"
                    rows={3}
                    {...register("descricao")}
                    className={cn(
                      "w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden resize-none",
                      "bg-transparent text-gray-800 dark:text-white/90",
                      "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Imagem
                  </label>
                  <label className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors">
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
                            e.preventDefault()
                            setImagePreview(null)
                            setImageFile(null)
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Clique</span> para fazer upload
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
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
                <Button
                  type="button"
                  onClick={() => handleSubmit(onSubmit)()}
                  disabled={create.isPending}
                  className="gap-2"
                >
                  {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {create.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
