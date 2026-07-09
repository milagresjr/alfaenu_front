
export type DocumentoProfundoStatus = {
  cliente_id: number;
  status_solicitacao_matricula: "nao_enviado" | "pendente" | "aprovado" | "rejeitado";
  status_solicitacao_agendamento: "nao_enviado" | "pendente" | "aprovado" | "rejeitado";
  status_solicitacao_print_voo: "nao_enviado" | "pendente" | "aprovado" | "rejeitado";
  status_solicitacao_reserva_hotel: "nao_enviado" | "pendente" | "aprovado" | "rejeitado";
  status_formulario: boolean;
  status_termo_responsabilidade: boolean;
  status_minuta1: boolean;
  status_minuta2: boolean;
  status_reconhecimento_termo_consulado: "nao_enviado" | "pendente" | "aprovado" | "rejeitado" | "enviado";
  status_solicitacao_seguro_viagem: "nao_enviado" | "pendente" | "aprovado" | "rejeitado";
  status_solicitacao_reconhecimento_registo_criminal: "nao_enviado" | "pendente" | "aprovado";
  status_outros_documentos_importantes: "nao_enviado" | "pendente" | "aprovado";
  status_plano_turistico: boolean;
  status_geral: "em_andamento" | "concluido";
}