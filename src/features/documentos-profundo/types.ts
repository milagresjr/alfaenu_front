
export type DocumentoProfundoStatus = {
  id?: number;
  created_at?: string;
  updated_at?: string;
  cliente_id: number;
  status_solicitacao_matricula: "nao_enviado" | "pendente" | "aprovado" | "rejeitado";
  status_solicitacao_agendamento: "nao_enviado" | "pendente" | "aprovado" | "rejeitado";
  status_solicitacao_print_voo: "nao_enviado" | "pendente" | "aprovado" | "rejeitado";
  status_solicitacao_reserva_hotel: "nao_enviado" | "pendente" | "aprovado" | "rejeitado";
  status_formulario: boolean;
  status_formulario_schengen: boolean;
  status_termo_responsabilidade: boolean;
  status_minuta1: boolean;
  status_minuta1_schengen: boolean;
  status_minuta2: boolean;
  status_minuta2_schengen: boolean;
  status_reconhecimento_termo_consulado: "nao_enviado" | "pendente" | "aprovado" | "rejeitado" | "enviado";
  status_solicitacao_seguro_viagem: "nao_enviado" | "pendente" | "aprovado" | "rejeitado";
  status_solicitacao_reconhecimento_registo_criminal: "nao_enviado" | "pendente" | "aprovado";
  status_outros_documentos_importantes: "nao_enviado" | "pendente" | "aprovado";
  checklist_extrato_bancario: boolean;
  checklist_declaracao: boolean;
  checklist_recibo_salarial: boolean;
  declaracao_servico_path?: string;
  declaracao_servico_nome?: string;
  declaracao_servico_url?: string;
  status_plano_turistico: boolean;
  status_geral: "em_andamento" | "concluido";
  cliente?: {
    id: number;
    nome: string;
    email: string;
  };
}