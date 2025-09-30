

export type SubcontaType = {
    id?: number;
    contract_id: number;
    nome: string;
    especificacao?: string;
    saldo?: number;
    status?: string;
    created_at?: string;
    updated_at?: string;
}

export type CreateSubcontaType = {
    contract_id: number;
    nome: string;
    especificacao?: string;
}

export type UpdateSubcontaType = {
    nome?: string;
    especificacao?: string;
    status?: string;
}