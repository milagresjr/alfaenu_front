// components/processo/steps/StepSolicitarMatricula.tsx
'use client'

import { motion } from "framer-motion"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  ChevronLeft,
  BookOpen,
  GraduationCap,
  Upload,
  FileText,
  CheckCircle,
  Eye,
  Trash2,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MyClienteType } from "@/features/myClient/types"
import { useCreateSolicitacaoMatricula } from "@/features/solicitacao-matricula/hooks/useSoliMatriculaQuery"
import { toast } from "react-toastify"
import { useCourses } from "@/features/course/hooks/useCourseQuery"
import { CourseType } from "@/features/course/types"
import { formatarMoeda } from "@/lib/helpers"

// Schema de validação
const matriculaSchema = z.object({
  curso_id: z.string(),
  curso_nome: z.string(),
  cliente_id: z.string(),
  cliente_nome: z.string(),
  observacoes: z.string().optional(),
})

type MatriculaFormData = z.infer<typeof matriculaSchema>

interface DocumentoAnexo {
  id: string
  nome: string
  tipo: string
  tamanho: string
  arquivo: File
}

interface StepSolicitarMatriculaProps {
  onBack: () => void
  onSuccess: (data: any) => void
  cliente?: MyClienteType | null
  cursoSelected: CourseType | null
}

// Dados simulados dos cursos (vindo da API)
const cursosSimulados = [
  {
    id: "1",
    nome: "Desenvolvimento Full Stack",
    local: "Luanda",
  },
  {
    id: "2",
    nome: "Gestão de Empresas",
    local: "Luanda",
  },
  {
    id: "3",
    nome: "Enfermagem",
    local: "Benguela",
  },
  {
    id: "4",
    nome: "Informática de Gestão",
    local: "Huíla",
  },
  {
    id: "5",
    nome: "Contabilidade e Finanças",
    local: "Luanda",
  },
  {
    id: "6",
    nome: "Marketing Digital",
    local: "Online",
  },
]

export function StepSolicitarMatricula({
  onBack,
  onSuccess,
  cliente,
  cursoSelected
}: StepSolicitarMatriculaProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [documentos, setDocumentos] = useState<DocumentoAnexo[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [cursoSelecionado, setCursoSelecionado] = useState<string>("")
  const [erroDocumentos, setErroDocumentos] = useState<string>("")

  const createSolicitacaoMatricula = useCreateSolicitacaoMatricula();

  const { data: dataCourses } = useCourses();

  const allCourses = dataCourses?.data;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<MatriculaFormData>({
    resolver: zodResolver(matriculaSchema),
    defaultValues: {
      curso_id: cursoSelected?.id?.toString() || "",
      curso_nome: cursoSelected?.nome || "",
      cliente_id: cliente?.id?.toString() || "",
      cliente_nome: cliente?.nome || "",
      observacoes: "",
    },
    mode: "onChange",
  })

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    processFiles(files)
  }

  const validarArquivo = (file: File): boolean => {
    const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png']
    const tamanhoMaximo = 1 * 1024 * 1024 // 1MB

    if (!tiposPermitidos.includes(file.type)) {
      setErroDocumentos("Apenas arquivos PDF, JPG ou PNG são permitidos")
      return false
    }

    if (file.size > tamanhoMaximo) {
      setErroDocumentos(`Arquivo ${file.name} excede 1MB`)
      return false
    }

    setErroDocumentos("")
    return true
  }

  const processFiles = (files: File[]) => {
    // Verificar se já existem documentos e se vai ultrapassar 3
    if (documentos.length + files.length > 3) {
      setErroDocumentos("Máximo de 3 documentos permitidos")
      return
    }

    const novosDocumentos: DocumentoAnexo[] = []

    for (const file of files) {
      if (validarArquivo(file)) {
        novosDocumentos.push({
          id: Math.random().toString(36).substring(7),
          nome: file.name,
          tipo: file.type,
          tamanho: formatarTamanho(file.size),
          arquivo: file,
        })
      }
    }

    if (novosDocumentos.length > 0) {
      setDocumentos((prev) => [...prev, ...novosDocumentos])
    }
  }

  const formatarTamanho = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const removerDocumento = (id: string) => {
    setDocumentos((prev) => prev.filter((doc) => doc.id !== id))
    setErroDocumentos("")
  }

  const onSubmit = async (data: MatriculaFormData) => {
    // Validar quantidade de documentos
    if (documentos.length !== 3) {
      setErroDocumentos("É obrigatório anexar exatamente 3 documentos")
      return
    }

    setIsSubmitting(true)
    try {
      // Preparar FormData para enviar arquivos
      const formData = new FormData()

      // Adicionar dados do formulário
      formData.append('cliente_id', data.cliente_id)
      formData.append('curso_id', String(cursoSelected?.id))
      formData.append('cliente_nome', data.cliente_nome)
      formData.append('curso_nome', data.curso_nome)
      if (data.observacoes) {
        formData.append('observacoes', data.observacoes)
      }

      // Adicionar documentos individualmente
      documentos.forEach((doc, index) => {
        // Enviar como 'documentos[]' para o Laravel receber como array
        formData.append(`documentos[${index}]`, doc.arquivo)
      })

      createSolicitacaoMatricula.mutate(formData, {
        onSuccess: (response) => {
          toast.success("Solicitação de matrícula criada com sucesso!")
          console.log("Solicitação de matrícula criada com sucesso:", response)
          // Passar os dados para o step de review
          onSuccess({
            solicitacaoMatricula: {
              curso: data.curso_nome,
              documentos: documentos,
              dataEnvio: new Date().toISOString(),
              response: response
            }
          })
        },
        onError: (error) => {
          toast.error("Erro ao criar solicitação de matrícula. Tente novamente.");
          console.error("Erro ao criar solicitação de matrícula:", error)
          setErroDocumentos("Erro ao enviar solicitação. Tente novamente.")
        },
        onSettled: () => {
          setIsSubmitting(false)
        }
      });
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error)
      toast.error("Erro ao enviar solicitação. Tente novamente.")
      setErroDocumentos("Erro ao enviar solicitação. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function onError(error: any) {
    console.error("Erro de validação do formulário:", error)
    toast.error("Erro de validação do formulário. Verifique os campos.")
  }

  // Verificar se o formulário é válido (3 documentos anexados)
  const isFormValid = isValid && documentos.length === 3

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-3">
            <BookOpen className="h-3 w-3" />
            <span className="font-medium">Solicitação de Matrícula</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Solicitar Matrícula
          </h2>
          <p className="text-muted-foreground mt-1">
            Preencha os dados para solicitar sua matrícula no curso desejado
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
          {/* Dados do Curso */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Dados do Curso</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>
                    Curso
                  </Label>
                   <Input
                    value={cursoSelected?.nome || ""}
                    disabled
                    className="bg-muted/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Local do Curso
                  </Label>
                  <Input
                    value={cursoSelected?.local || ""}
                    disabled
                    className="bg-muted/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Preco
                  </Label>
                  <Input
                    value={cursoSelected?.preco ? formatarMoeda(Number(cursoSelected.preco)) : ""}
                    disabled
                    className="bg-muted/50"
                  />
                </div>

                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <Label>
                    Observações (opcional)
                  </Label>
                  <textarea
                    {...register("observacoes")}
                    rows={3}
                    className={cn(
                      "w-full rounded-lg border border-gray-300 dark:border-white/10 px-4 py-2.5 text-sm",
                      "focus:outline-none focus:border-brand-300 focus:ring-brand-500/20",
                      "bg-transparent text-gray-800 dark:text-white/90"
                    )}
                    placeholder="Informações adicionais sobre sua solicitação..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documentos Anexados */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Documentos Anexados</h3>
                </div>
                <div className={`text-sm font-medium ${documentos.length === 3 ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {documentos.length}/3 arquivos
                </div>
              </div>

              {/* Área de Upload */}
              {documentos.length < 3 && (
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-gray-300 dark:border-white/10 hover:border-primary/50"
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <div>
                      <span className="text-primary font-medium">Clique para anexar</span>
                      <span className="text-muted-foreground"> ou arraste e solte</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      PDF, JPG ou PNG (máx. 1MB cada) • Faltam {3 - documentos.length} arquivo(s)
                    </p>
                  </label>
                </div>
              )}

              {/* Lista de Documentos */}
              {documentos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Documentos anexados:</p>
                  <div className="space-y-2">
                    {documentos.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{doc.nome}</p>
                            <p className="text-xs text-muted-foreground">{doc.tamanho}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(URL.createObjectURL(doc.arquivo), '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removerDocumento(doc.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mensagens de erro/aviso */}
              {erroDocumentos && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {erroDocumentos}
                  </p>
                </div>
              )}

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  ⚠️ Documentos obrigatórios: Passaporte, Certificado de Habilitações e Comprovante de Pagamento
                </p>
                <p className="text-xs text-amber-500 dark:text-amber-500 mt-1">
                  Formatos aceitos: PDF, JPG, PNG • Tamanho máximo: 1MB por arquivo • Exatamente 3 documentos
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Enviando solicitação...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Enviar Solicitação ({documentos.length}/3)
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}