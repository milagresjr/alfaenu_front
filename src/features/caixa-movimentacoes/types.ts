

export type CaixaMovimentacoesType = {
    id: number;
    caixa_id: number;
    tipo: "entrada" | "saida";
    valor: number;
    origem: string;
    descricao: string;
    data: string; // ISO 8601 date string
    created_at: string; // ISO 8601 date string
    updated_at: string; // ISO 8601 date string
};

export type PaginatedCaixaMovimentacoes = {
    data: CaixaMovimentacoesType[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
};