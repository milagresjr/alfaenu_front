import { SubcontaType } from "../contract/types";


export type MovimentoSubcontaType = {
    id?: number;
    subconta_id: number;
    valor: number;
    tipo: 'entrada' | 'saida';
    descricao?: string;
    subconta?: SubcontaType;
    created_at?: string;
    updated_at?: string;
}

export type CreateMovimentoSubcontaType = {
    subconta_id: number;
    valor: number;
    tipo: 'entrada' | 'saida';
    descricao?: string;
}

export type UpdateMovimentoSubcontaType = {
    valor?: number;
    tipo?: 'entrada' | 'saida';
    descricao?: string;
}