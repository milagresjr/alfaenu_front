export type ItemServicContratoType = {
    id?: number;
    contract_id?: number
    subconta_id?: number
    service_id?: number
    servico_nome?: string
    servico_tipo?: string
    qtd?: number
    servico_valor_externo?: number | string
    servico_valor?: number | string
    total?: number | string
    servico_imagem?: string
}