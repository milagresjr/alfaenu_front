export type TipoEntrega = 'domicilio' | 'presencial'

export type StatusRegistoCriminal = 'pendente' | 'aprovado'

export type SolicitacaoReconhecimentoRegistoCriminalType = {
  id: number
  cliente_id: number
  tipo_entrega: TipoEntrega
  endereco_entrega?: string
  comprovativo_path?: string
  comprovativo_nome?: string
  comprovativo_url?: string
  status: StatusRegistoCriminal
  observacoes_admin?: string
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

export interface PaginatedReconhecimentoRegistoCriminal {
  data: SolicitacaoReconhecimentoRegistoCriminalType[]
  current_page: number
  per_page: number
  total: number
  last_page: number
  total_pendentes: number
  total_aprovados: number
}

export type ConfigReconhecimentoCriminalType = {
  id: number
  preco_base: number
  taxa_domicilio: number
  endereco_agencia: string
  created_at?: string
  updated_at?: string
}
