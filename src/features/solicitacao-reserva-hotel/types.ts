export type SolicitacaoReservaHotelStatus = 'pendente' | 'aprovado' | 'rejeitado'

export type SolicitacaoReservaHotelType = {
  id: string
  cliente_id: string
  telefone: string
  telefone_alternativo?: string
  data_ida: string
  data_volta: string
  endereco_arredores: string
  status: SolicitacaoReservaHotelStatus
  comprovativo_path?: string
  comprovativo_nome?: string
  comprovativo_url?: string
  documento_path?: string
  documento_nome?: string
  documento_url?: string
  observacoes?: string
  motivo_rejeicao?: string
  created_at?: string
  updated_at?: string
  cliente?: {
    id: number
    nome: string
    email: string
    passaporte?: string
    telefone?: string
    passaporte_path?: string
    bi_path?: string
    passaporte_url?: string
    bi_url?: string
    n_passaporte?: string
    n_bi?: string
  }
}

export interface PaginatedSolicitacaoReservaHotel {
  data: SolicitacaoReservaHotelType[]
  current_page: number
  per_page: number
  total: number
  last_page: number
  total_pendentes: number
  total_aprovados: number
  total_rejeitados: number
}

export interface SolicitacaoReservaHotelDescricaoType {
  id: string
  descricao: string
  status: boolean
  created_at?: string
  updated_at?: string
}
