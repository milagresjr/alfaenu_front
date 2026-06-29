// types/processo.ts
import { MyClienteType } from "@/features/myClient/types"

export interface Cliente {
  id: number
  nome: string
  email: string
  telefone?: string
  documento?: string
}

export type TipoVisto = "nacional" | "schengen"
export type SubtipoNacional = "formacao" | "trabalho" | "estudante"
export type SubtipoSchengen = "turismo" | "negocios" | "familiar"
export type Subtipo = SubtipoNacional | SubtipoSchengen
export type Financiamento = "financiado" | "auto"
export type OrigemFinanciamento = "nacional" | "estrangeiro"
export type TipoMinuta = 
  | "minuta1" 
  | "minuta2" 
  | "formulario" 
  | "termo_responsabilidade" 
  | "solicitar_agendamento" 
  | "solicitar_matricula"
  | "print_voo"
  | "reserva_hotel"

export interface ProcessoData {
  cliente: MyClienteType | null
  tipoVisto: TipoVisto | null
  subtipo: Subtipo | null
  financiamento: Financiamento | null
  financiamentoOrigem?: OrigemFinanciamento | null
  financiador_id?: number | null
  financiador_nome?: string | null
  minutaSelecionada?: TipoMinuta | null
  createdAt?: Date
  status?: "rascunho" | "em_andamento" | "concluido"
  solicitacaoMatricula?: {
    curso_id: number,
    cliente_id: number,
    curso: any,
    curso_nome: string,
    cliente_nome: string,
    documentos: any[]
    dataEnvio?: Date
  },
  minutaPdfUrl?: string
}

export interface StepProps {
  data: ProcessoData
  setData: React.Dispatch<React.SetStateAction<ProcessoData>>
  next: () => void
  back: () => void
  isFirstStep?: boolean
  isLastStep?: boolean
}