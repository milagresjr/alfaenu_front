import { CentroFormacaoType } from "../centroFormacao/types";

export type CourseType = {
  id?: number;
  nome: string;
  local: string;
  preco: number | string;
  duracao: string;
  descricao: string;
  imagem?: File | string | null;
  centro_id?: number;
  centro?: CentroFormacaoType;
};
