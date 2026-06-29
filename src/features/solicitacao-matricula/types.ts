
export type SolicitacaoStatus = 'pendente' | 'aprovado' | 'rejeitado';

export type SolicitacaoMatriculaType = {
    id: string;
    cliente_id: string;
    curso_id: string;
    cliente_nome: string;
    curso_nome: string;
    observacoes: string;
    status: SolicitacaoStatus;
    data_inicio?: string;
    data_prevista_chegada?: string;
    data_prevista_saida?: string;
    declaracao_url?: string;
    declaracao_nome?: string;
    motivo_rejeicao?: string;
    created_at?: string;
    updated_at?: string;
};

export interface PaginatedSolicitacao {
    data: SolicitacaoMatriculaType[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    total_pendentes: number;
    total_aprovados: number;
    total_rejeitados: number;
}

export interface MotivoRejeicaoResponse {
    motivo_rejeicao: string;
}