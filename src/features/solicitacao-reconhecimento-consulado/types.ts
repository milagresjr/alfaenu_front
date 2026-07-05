export type ReconhecimentoConsuladoStatus = "nao_enviado" | "pendente" | "aprovado" | "rejeitado" | "enviado"

export type ReconhecimentoConsuladoType = {
  id: number
  cliente_id: number
  data_documento: string
  comprovativo_path?: string
  comprovativo_nome?: string
  comprovativo_url?: string
  status: ReconhecimentoConsuladoStatus
  motivo_rejeicao?: string
  created_at?: string
  updated_at?: string
  cliente?: {
    id: number
    nome: string
    email: string
    passaporte?: string
    telefone?: string
  }
}

export interface PaginatedReconhecimentoConsulado {
  data: ReconhecimentoConsuladoType[]
  current_page: number
  per_page: number
  total: number
  last_page: number
  total_pendentes: number
  total_aprovados: number
  total_rejeitados: number
}
