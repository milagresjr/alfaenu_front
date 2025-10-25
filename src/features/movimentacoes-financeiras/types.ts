

export type MovimentacoesFinanceirasType = {
    id?: number;
    utilizador_id?: string | number;
    conta_financeira_id?: string | number;
    caixa_movimentacao_id?: string | number;
    tipo: string;
    valor: string | number;
    origem: string;
    descricao?: string;
    referencia_id?: string | number;
    referencia_tipo?: string;
}