export type SolicitacaoAgendamentoStatus = 'pendente' | 'aprovado' | 'rejeitado'

export type SolicitacaoAgendamentoType = {
  id: string
  cliente_id: string
  telefone: string
  telefone_alternativo?: string
  status: SolicitacaoAgendamentoStatus
  comprovativo_path?: string
  comprovativo_nome?: string
  comprovativo_url?: string
  observacoes?: string
  motivo_rejeicao?: string
  data_agendamento?: string
  agendamento_path?: string
  agendamento_nome?: string
  agendamento_url?: string
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

export interface PaginatedSolicitacaoAgendamento {
  data: SolicitacaoAgendamentoType[]
  current_page: number
  per_page: number
  total: number
  last_page: number
  total_pendentes: number
  total_aprovados: number
  total_rejeitados: number
}

export interface SolicitacaoAgendamentoDescricaoType {
  id: string
  descricao: string
  tipo: string
  status: boolean
  created_at?: string
  updated_at?: string
}
