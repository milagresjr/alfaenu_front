

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

/**
 * Formata uma data no formato "dd/mm/yyyy HH:mm"
 * @param data - string ou Date
 * @returns string formatada
 */
export function formatarDataHora(data: string | Date | null | undefined): string {
  if (!data) return "—";

  try {
    const dataObj = new Date(data);
    if (isNaN(dataObj.getTime())) return "—"; // caso data inválida

    return dataObj
      .toLocaleString("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", ""); // remove a vírgula entre data e hora
  } catch {
    return "—";
  }
}
