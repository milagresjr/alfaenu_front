

export function formatarDataLong(isoString: string): string {
  const data = new Date(isoString);

  // pega dia, mês e ano
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0"); // mês começa do 0
  const ano = data.getFullYear();

  return `${dia}-${mes}-${ano}`;
}

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 2,
  })
    .format(valor)
    // troca o símbolo "Kz" de lugar caso venha antes
    .replace("AOA", "Kz");
}
