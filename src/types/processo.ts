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
export type NumeroEntradas = "uma" | "duas" | "multiplas"
export type SubtipoNacional = "formacao" | "trabalho" | "estudante"
export type SubtipoSchengen = "turismo" | "negocios" | "familiar" | "estudos" | "cultural" | "desporto" | "visita_oficial" | "razoes_medicas" | "escala_aeronautica" | "outro"
export type Subtipo = SubtipoNacional | SubtipoSchengen
export type Financiamento = "financiado" | "auto"
export type OrigemFinanciamento = "nacional" | "estrangeiro"
export type TipoMinuta = 
  | "minuta1" 
  | "minuta1_schengen"
  | "minuta2" 
  | "minuta2_schengen"
  | "formulario" 
  | "formulario_schengen"
  | "termo_responsabilidade" 
  | "solicitar_agendamento" 
  | "solicitar_matricula"
  | "print_voo"
  | "reserva_hotel"
  | "plano_turistico"
  | "seguro_viagem"
  | "reconhecimento_registo_criminal"
  | "outros_documentos_importantes"

export interface ProcessoData {
  cliente: MyClienteType | null
  tipoVisto: TipoVisto | null
  objectivoViagem?: string
  numeroEntradas?: NumeroEntradas
  subtipo: Subtipo | null
  subtipoOutroDescricao?: string
  dataPrevisaoChegada?: string
  quantidadeDias?: number
  dataPrevisaoSaida?: string
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