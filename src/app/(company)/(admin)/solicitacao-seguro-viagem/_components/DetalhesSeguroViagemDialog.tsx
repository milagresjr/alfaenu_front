'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { formatarDataLong } from "@/lib/helpers"
import { SolicitacaoSeguroViagemType, SolicitacaoSeguroViagemStatus } from "@/features/solicitacao-seguro-viagem/types"
import { Clock, CheckCircle, XCircle, FileText, Eye, User, File, Mail, Phone, IdCard, CreditCard, MapPin, Calendar, MessageSquare } from "lucide-react"
import { toast } from "react-toastify"

interface DetalhesSeguroViagemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  solicitacao: SolicitacaoSeguroViagemType | null
}

const statusConfig: Record<SolicitacaoSeguroViagemStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pendente: {
    label: 'Pendente',
    color: 'text-yellow-600 bg-yellow-100 border-yellow-500',
    icon: <Clock className="h-3 w-3" />,
  },
  aprovado: {
    label: 'Aprovado',
    color: 'text-green-600 bg-green-100 border-green-500',
    icon: <CheckCircle className="h-3 w-3" />,
  },
  rejeitado: {
    label: 'Rejeitado',
    color: 'text-red-600 bg-red-100 border-red-500',
    icon: <XCircle className="h-3 w-3" />,
  },
}

function handleDownload(url: string | undefined, nome: string | undefined) {
  if (!url) {
    toast.error('Documento não disponível.')
    return
  }
  const a = document.createElement('a')
  a.href = url
  a.download = nome || 'documento'
  a.target = '_blank'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export function DetalhesSeguroViagemDialog({
  open,
  onOpenChange,
  solicitacao,
}: DetalhesSeguroViagemDialogProps) {
  if (!solicitacao) return null

  const cliente = solicitacao.cliente
  const cfg = statusConfig[solicitacao.status]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-primary" />
            Detalhes da Solicitação
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Section title="Dados do Cliente" icon={<User className="h-4 w-4" />}>
            <InfoRow icon={<Mail className="h-4 w-4 text-muted-foreground" />} label="Email" value={cliente?.email || '-'} />
            <InfoRow icon={<Phone className="h-4 w-4 text-muted-foreground" />} label="Telefone" value={cliente?.telefone || '-'} />
            <InfoRow icon={<IdCard className="h-4 w-4 text-muted-foreground" />} label="Nº Passaporte" value={cliente?.n_passaporte || '-'} />
            <InfoRow icon={<CreditCard className="h-4 w-4 text-muted-foreground" />} label="Nº BI" value={cliente?.n_bi || '-'} />
          </Section>

          <Section title="Documentos do Cliente" icon={<File className="h-4 w-4" />}>
            <div className="flex flex-wrap gap-3">
              {cliente?.passaporte_url ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(cliente.passaporte_url, `passaporte_${cliente.nome}.pdf`)}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Ver Passaporte
                </Button>
              ) : (
                <span className="text-sm text-muted-foreground italic">Nenhum passaporte anexado</span>
              )}
              {cliente?.bi_url ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(cliente.bi_url, `bi_${cliente.nome}.pdf`)}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Ver Bilhete de Identidade
                </Button>
              ) : null}
            </div>
          </Section>

          <Section title="Dados da Solicitação" icon={<FileText className="h-4 w-4" />}>
            <InfoRow icon={<Calendar className="h-4 w-4 text-muted-foreground" />} label="Data de Ida" value={solicitacao.data_ida ? formatarDataLong(solicitacao.data_ida) : '-'} />
            <InfoRow icon={<Calendar className="h-4 w-4 text-muted-foreground" />} label="Data de Volta" value={solicitacao.data_volta ? formatarDataLong(solicitacao.data_volta) : '-'} />
            <InfoRow icon={<MapPin className="h-4 w-4 text-muted-foreground" />} label="País de Origem" value={solicitacao.pais_origem || '-'} />
            <InfoRow icon={<MapPin className="h-4 w-4 text-muted-foreground" />} label="País de Destino" value={solicitacao.pais_destino || '-'} />
            {solicitacao.observacoes && (
              <InfoRow icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />} label="Observações" value={solicitacao.observacoes} />
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground min-w-[140px]">Status</span>
              <Badge variant="outline" className={`gap-1 ${cfg.color}`}>
                {cfg.icon}
                {cfg.label}
              </Badge>
            </div>
            {solicitacao.motivo_rejeicao && solicitacao.status === 'rejeitado' && (
              <InfoRow icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />} label="Motivo de Rejeição" value={solicitacao.motivo_rejeicao} />
            )}
          </Section>

          {solicitacao.comprovativo_url && (
            <Section title="Comprovativo" icon={<FileText className="h-4 w-4" />}>
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{solicitacao.comprovativo_nome || 'Comprovativo'}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(solicitacao.comprovativo_url, solicitacao.comprovativo_nome)}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Ver Comprovativo
                </Button>
              </div>
            </Section>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 border-b pb-2">
        {icon}
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
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
