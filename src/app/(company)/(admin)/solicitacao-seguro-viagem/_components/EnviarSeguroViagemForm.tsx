'use client'

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Upload, FileText, AlertCircle, Trash2, Eye, ShieldCheck } from "lucide-react"

interface EnviarSeguroViagemFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (formData: FormData) => void
  isLoading?: boolean
  clienteNome: string
}

export function EnviarSeguroViagemForm({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  clienteNome,
}: EnviarSeguroViagemFormProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [erro, setErro] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setErro('Apenas arquivos PDF são permitidos.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setErro('O arquivo deve ter no máximo 10MB.')
      return
    }

    setErro('')
    setPdfFile(file)
  }

  const handleConfirm = () => {
    if (!pdfFile) {
      setErro('Selecione um arquivo PDF.')
      return
    }

    const formData = new FormData()
    formData.append('documento', pdfFile)
    onConfirm(formData)
  }

  const handleClose = () => {
    setPdfFile(null)
    setErro('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Enviar Documento
          </DialogTitle>
          <DialogDescription>
            Enviar documento de seguro de viagem para <strong>{clienteNome}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Documento (PDF) <span className="text-red-500">*</span>
            </label>
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              {pdfFile ? (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{pdfFile.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(URL.createObjectURL(pdfFile), '_blank')
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPdfFile(null)
                        setErro('')
                      }}
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Clique para selecionar o PDF
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Máximo 10MB
                  </span>
                </div>
              )}
            </div>
          </div>

          {erro && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {erro}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading || !pdfFile}>
            {isLoading ? 'Enviando...' : 'Enviar Documento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
