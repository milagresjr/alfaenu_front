import { ClienteType } from "../client/types";
import { ServiceType } from "../service/types";


export type ServiceContractType = {
    id?: number;
    service_id?: number;
    servico_nome?: string;
    servico_tipo?: string;
    servico_valor_externo?: string;
    servico_valor?: string;
    servico_imagem?: string;
}

export type SubcontaType = {
    id: string
    nome: string
    contract_id?: number
    servicos: ServiceType[]
}

export type ContratoType = {
    id?: number;
    cliente?: ClienteType | null;
    cliente_id?: number;
    cliente_nome?: string;
    cliente_bi?: string;
    cliente_data_nascimento?: string;
    cliente_endereco?: string;
    subcontas?: SubcontaType[] | null;
    nota?: string;
    desconto?: number;
    valor_por_pagar?: number;
    valor_pago?: number;
    termo_conteudo?: string;
    termo_titulo?: string;
    tipo_pagamento?: string;
    data_inicio?: string;
    assinatura_cliente?: string;
    services?: ServiceContractType[];
    data?: ContratoType;
}