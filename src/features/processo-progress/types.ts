import { MyClienteType } from "../myClient/types";

export type ProcessoProgressType = {
  id?: number;
  cliente_id: number;
  cliente?: MyClienteType;
  current_step: number;
  tipo_visto: string | null;
  subtipo: string | null;
  financiamento: string | null;
  financiamento_origem: string | null;
  documentos_profundo: string | null;
  status: string;
}
