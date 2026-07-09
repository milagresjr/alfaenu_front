export type SolicitacaoSeguroViagemStatus = 'pendente' | 'aprovado' | 'rejeitado'

export type SolicitacaoSeguroViagemType = {
  id: number
  cliente_id: number
  data_ida: string
  data_volta: string
  pais_origem?: string
  pais_destino?: string
  status: SolicitacaoSeguroViagemStatus
  comprovativo_path?: string
  comprovativo_nome?: string
  comprovativo_url?: string
  observacoes?: string
  motivo_rejeicao?: string
  documento_path?: string
  documento_nome?: string
  documento_url?: string
  data_documento?: string
  created_at?: string
  updated_at?: string
  cliente?: {
    id: number
    nome: string
    email: string
  }
}

export interface SolicitacaoSeguroViagemDescricaoType {
  id: string
  descricao: string
  status: boolean
  created_at?: string
  updated_at?: string
}

export interface PaginatedSolicitacaoSeguroViagem {
  data: SolicitacaoSeguroViagemType[]
  current_page: number
  per_page: number
  total: number
  last_page: number
  total_pendentes: number
  total_aprovados: number
  total_rejeitados: number
}
