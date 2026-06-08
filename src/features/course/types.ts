export type CourseType = {
  id?: number;
  nome: string;
  local: string;
  preco: number | string;
  duracao: string;
  descricao: string;
  imagem?: File | string | null;
};
