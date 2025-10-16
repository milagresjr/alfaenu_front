import { CaixaMovimentacoesType } from "../caixa-movimentacoes/types";


export type CaixaType = {
    id: number;
    utilizador_id: number;
    descricao?: string;
    saldo_inicial: number;
    saldo_final: number;
    data_abertura: string; // ISO 8601 format date string
    data_fecho: string | null; // ISO 8601 format date string or null if not closed
    status: 'aberto' | 'fechado';
    movimentacoes?: CaixaMovimentacoesType[];
    created_at: string; // ISO 8601 date string
    updated_at: string; // ISO 8601 date string
};
export type PaginatedCaixa = {
    data: CaixaType[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
};

