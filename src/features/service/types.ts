import { ServiceTypeType } from "../service-type/types";

export type ServiceType = {
    id?: number | string;
    nome: string;
    tipo: string;
    valor: number | string;
    valor_externo?: number | string;
    categoria_id?: number | string;
    categoria?: ServiceTypeType;
    estado?: string;
}