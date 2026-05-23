

export type SolicitacaoMatriculaType = {
    id: string;
    cliente_id: string;
    curso_id: string;
    cliente_nome: string;
    curso_nome: string;
    observacoes: string;
    status: 'pendente' | 'aprovada' | 'rejeitada';
    created_at?: string;
    updated_at?: string;
};