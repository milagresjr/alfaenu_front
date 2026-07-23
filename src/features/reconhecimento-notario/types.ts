export type TipoEntrega = 'domicilio' | 'presencial'

export type StatusReconhecimentoNotario = 'pendente' | 'aprovado'

export type SolicitacaoReconhecimentoNotarioType = {
  id: number
  cliente_id: number
  tipo_entrega: TipoEntrega
  endereco_entrega?: string
  comprovativo_path?: string
  comprovativo_nome?: string
  comprovativo_url?: string
  declaracao_autonoma_path?: string
  declaracao_autonoma_generated?: boolean
  declaracao_autonoma_url?: string
  status: StatusReconhecimentoNotario
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

export interface PaginatedReconhecimentoNotario {
  data: SolicitacaoReconhecimentoNotarioType[]
  current_page: number
  per_page: number
  total: number
  last_page: number
  total_pendentes: number
  total_aprovados: number
}

export type ConfigReconhecimentoNotarioType = {
  id: number
  preco_base: number
  taxa_domicilio: number
  endereco_agencia: string
  created_at?: string
  updated_at?: string
}
