import { MyClienteType } from "../myClient/types";

export type ProcessoProgressType = {
  id?: number;
  cliente_id: number;
  cliente?: MyClienteType;
  utilizador_id: number | string;
  current_step: number;
  tipo_visto: string | null;
  subtipo: string | null;
  financiamento: string | null;
  financiamento_origem: string | null;
  financiador_id: number | string;
  financiador_nome?: string;
  documentos_profundo: string | null;
  status: string;
}
