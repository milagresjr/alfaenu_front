'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { SolicitacaoReconhecimentoNotarioType } from "@/features/reconhecimento-notario/types"
import { Clock, CheckCircle, FileText, Eye, User, File, Mail, Phone, Home, MapPin, MessageSquare, FolderOpen } from "lucide-react"
import { toast } from "react-toastify"

interface DetalhesReconhecimentoNotarioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  solicitacao: SolicitacaoReconhecimentoNotarioType | null
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pendente: { label: 'Pendente', color: 'text-yellow-600 bg-yellow-100 border-yellow-500', icon: <Clock className="h-3 w-3" /> },
  aprovado: { label: 'Aprovado', color: 'text-green-600 bg-green-100 border-green-500', icon: <CheckCircle className="h-3 w-3" /> },
}

function handleDownload(url: string | undefined, nome: string | undefined) {
  if (!url) { toast.error('Documento não disponível.'); return }
  const a = document.createElement('a')
  a.href = url; a.download = nome || 'documento'; a.target = '_blank'
  document.body.appendChild(a); a.click(); a.remove()
}

export function DetalhesReconhecimentoNotarioDialog({ open, onOpenChange, solicitacao }: DetalhesReconhecimentoNotarioDialogProps) {
  if (!solicitacao) return null
  const cliente = solicitacao.cliente
  const cfg = statusConfig[solicitacao.status]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FolderOpen className="h-5 w-5 text-primary" /> Detalhes da Solicitação
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <Section title="Dados do Cliente" icon={<User className="h-4 w-4" />}>
            <InfoRow icon={<Mail className="h-4 w-4 text-muted-foreground" />} label="Email" value={cliente?.email || '-'} />
            <InfoRow icon={<Phone className="h-4 w-4 text-muted-foreground" />} label="Telefone" value={cliente?.telefone || '-'} />
          </Section>
          <Section title="Documentos do Cliente" icon={<File className="h-4 w-4" />}>
            <div className="flex flex-wrap gap-3">
              {cliente?.passaporte_url ? (
                <Button type="button" variant="outline" size="sm" onClick={() => handleDownload(cliente.passaporte_url, `passaporte_${cliente.nome}.pdf`)} className="gap-2">
                  <Eye className="h-4 w-4" /> Ver Passaporte
                </Button>
              ) : (
                <span className="text-sm text-muted-foreground italic">Nenhum passaporte anexado</span>
              )}
              {cliente?.bi_url ? (
                <Button type="button" variant="outline" size="sm" onClick={() => handleDownload(cliente.bi_url, `bi_${cliente.nome}.pdf`)} className="gap-2">
                  <Eye className="h-4 w-4" /> Ver Bilhete de Identidade
                </Button>
              ) : null}
            </div>
          </Section>
          <Section title="Dados da Solicitação" icon={<FolderOpen className="h-4 w-4" />}>
            <div className="flex items-center gap-2">
              <div className="mt-0.5 shrink-0">{solicitacao.tipo_entrega === 'domicilio' ? <Home className="h-4 w-4 text-muted-foreground" /> : <MapPin className="h-4 w-4 text-muted-foreground" />}</div>
              <span className="text-sm font-medium text-muted-foreground min-w-[140px]">Tipo de Entrega</span>
              <span className="text-sm capitalize">{solicitacao.tipo_entrega === 'domicilio' ? 'Ao domicílio' : 'Presencial'}</span>
            </div>
            {solicitacao.endereco_entrega && (
              <InfoRow icon={<MapPin className="h-4 w-4 text-muted-foreground" />} label="Endereço" value={solicitacao.endereco_entrega} />
            )}
            <div className="flex items-center gap-2">
              <div className="mt-0.5 shrink-0"><FileText className="h-4 w-4 text-muted-foreground" /></div>
              <span className="text-sm font-medium text-muted-foreground min-w-[140px]">Declaração Autónoma</span>
              <Badge variant="outline" className={solicitacao.declaracao_autonoma_generated ? 'text-green-600 border-green-500' : 'text-muted-foreground'}>
                {solicitacao.declaracao_autonoma_generated ? 'Gerada' : 'Não gerada'}
              </Badge>
            </div>
            {solicitacao.observacoes_admin && (
              <InfoRow icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />} label="Observações" value={solicitacao.observacoes_admin} />
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground min-w-[140px]">Status</span>
              <Badge variant="outline" className={`gap-1 ${cfg.color}`}>{cfg.icon}{cfg.label}</Badge>
            </div>
          </Section>
          {solicitacao.comprovativo_url && (
            <Section title="Comprovativo" icon={<FileText className="h-4 w-4" />}>
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1"><p className="text-sm font-medium">{solicitacao.comprovativo_nome || 'Comprovativo'}</p></div>
                <Button type="button" variant="outline" size="sm" onClick={() => handleDownload(solicitacao.comprovativo_url, solicitacao.comprovativo_nome)} className="gap-2">
                  <Eye className="h-4 w-4" /> Ver Comprovativo
                </Button>
              </div>
            </Section>
          )}
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 border-b pb-2">{icon}<h3 className="text-base font-semibold">{title}</h3></div>
      <div className="space-y-2 pl-1">{children}</div>
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <span className="text-sm font-medium text-muted-foreground min-w-[140px]">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  )
}
