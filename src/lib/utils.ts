import { api } from "@/services/api";
import { clsx, type ClassValue } from "clsx"
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function gerarPdfMovimentoSubconta(documentoId: number | undefined) {
  try {
    const response = await api.get(`movimento-subconta/${documentoId}/gerar-pdf-movimento-subconta`, {
      responseType: 'blob', // ⚠️ Muito importante para PDFs
    });

    if (response.status !== 200) {
      console.error("Erro ao gerar PDF:", response);
      throw new Error("Erro ao gerar PDF");
    }

    // Cria uma URL temporária do PDF
    const file = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);

    // Abre o PDF numa nova aba
    window.open(fileURL, "_blank");

  } catch (error) {
    toast.error("Erro ao gerar PDF.");
    console.error(error);
  }
}

export async function gerarPdfMovimentoSubcontaByPOS(idDocument: string | number) {
  try {
    const response = await api.get(
      `document-pos-generated/${idDocument}/gerar-pdf`,
      {
        responseType: "blob", // ⚠️ muito importante para PDFs
      }
    );

    if (response.status !== 200) {
      console.error("Erro ao gerar PDF:", response);
      throw new Error("Erro ao gerar PDF");
    }

    // Cria uma URL temporária do PDF
    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);

    // Abre o PDF numa nova aba
    window.open(fileURL, "_blank");
  } catch (error) {
    toast.error("Erro ao gerar PDF.");
    console.error(error);
  }
}

export async function gerarPdfMovimentoSubcontaAllMov(search = '', idContrato: number | string, filters = {}) {
  try {
    const response = await api.get(`movimento-subconta/gerar-pdf-movimento-subconta/${idContrato}`, {
      responseType: 'blob', // ⚠️ Muito importante para PDFs
      params: { search, ...filters }
    });

    if (response.status !== 200) {
      console.error("Erro ao gerar PDF:", response);
      throw new Error("Erro ao gerar PDF");
    }

    // Cria uma URL temporária do PDF
    const file = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);

    // Abre o PDF numa nova aba
    window.open(fileURL, "_blank");

  } catch (error) {
    toast.error("Erro ao gerar PDF.");
    console.error(error);
  }
}

export async function gerarPdfMovimentoContratoAllMov(search = '', idContrato: number | string, filters = {}) {
  try {
    const response = await api.get(`movimento-subconta/gerar-pdf-movimento-contrato/${idContrato}`, {
      responseType: 'blob', // ⚠️ Muito importante para PDFs
      params: { search, ...filters }
    });

    if (response.status !== 200) {
      console.error("Erro ao gerar PDF:", response);
      throw new Error("Erro ao gerar PDF");
    }

    // Cria uma URL temporária do PDF
    const file = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);

    // Abre o PDF numa nova aba
    window.open(fileURL, "_blank");

  } catch (error) {
    toast.error("Erro ao gerar PDF.");
    console.error(error);
  }
}

export async function gerarPdfContrato(documentoId: number | undefined) {
  try {
    const response = await api.get(`contract/${documentoId}/gerar-pdf`, {
      responseType: 'blob', 
    });

    if (response.status !== 200) {
      console.error("Erro ao gerar PDF:", response);
      throw new Error("Erro ao gerar PDF");
    }

    // Cria uma URL temporária do PDF
    const file = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);

    // Abre o PDF numa nova aba
    window.open(fileURL, "_blank");

  } catch (error) {
    toast.error("Erro ao gerar PDF.");
    console.error(error);
  }
}

export async function gerarPdfServicosContrato(documentoId: number | undefined) {
  try {
    const response = await api.get(`contract/${documentoId}/gerar-pdf-servicos-contrato`, {
      responseType: 'blob', // ⚠️ Muito importante para PDFs
    });

    if (response.status !== 200) {
      console.error("Erro ao gerar PDF:", response);
      throw new Error("Erro ao gerar PDF");
    }

    // Cria uma URL temporária do PDF
    const file = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);

    // Abre o PDF numa nova aba
    window.open(fileURL, "_blank");

  } catch (error: any) {
    toast.error("Erro ao gerar PDF.");
    console.error(error);
  }
}


export async function gerarPdfContratoFinalizado(documentoId: number | undefined) {
  try {
    const response = await api.get(`contract/${documentoId}/gerar-pdf-finalizado`, {
      responseType: 'blob', // ⚠️ Muito importante para PDFs
    });

    if (response.status !== 200) {
      console.error("Erro ao gerar PDF:", response);
      throw new Error("Erro ao gerar PDF");
    }

    // Cria uma URL temporária do PDF
    const file = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);

    // Abre o PDF numa nova aba
    window.open(fileURL, "_blank");

  } catch (error) {
    toast.error("Erro ao gerar PDF.");
    console.error(error);
  }
}

export async function downloadPdfContratoFinalizado(documentoId: number | undefined) {
  try {
    const response = await api.get(`contract/${documentoId}/gerar-pdf-finalizado`, {
      responseType: 'blob', // ⚠️ Muito importante para PDFs
    });

    if (response.status !== 200) {
      console.error("Erro ao gerar PDF:", response);
      throw new Error("Erro ao gerar PDF");
    }

    // Cria um Blob com o PDF
    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);

    // Cria um link invisível para download
    const link = document.createElement("a");
    link.href = fileURL;
    link.download = `Contrato-${documentoId}.pdf`; // Nome do arquivo
    document.body.appendChild(link);
    link.click();

    // Remove o link depois do download
    document.body.removeChild(link);
    URL.revokeObjectURL(fileURL);

  } catch (error) {
    toast.error("Erro ao gerar PDF.");
    console.error(error);
  }
}


export async function gerarPdfAberturaCaixa(caixaId: number | undefined) {
  try {
    const response = await api.get(`caixa/${caixaId}/gerar-pdf-abertura`, {
      responseType: 'blob', // ⚠️ Muito importante para PDFs
    });

    if (response.status !== 200) {
      console.error("Erro ao gerar PDF:", response);
      throw new Error("Erro ao gerar PDF");
    }

    // Cria uma URL temporária do PDF
    const file = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);

    // Abre o PDF numa nova aba
    window.open(fileURL, "_blank");

  } catch (error) {
    toast.error("Erro ao gerar PDF.");
    console.error(error);
  }
}

export async function gerarPdfFechoCaixa(caixaId: number | undefined) {
  try {
    const response = await api.get(`caixa/${caixaId}/gerar-pdf-fecho`, {
      responseType: 'blob', // ⚠️ Muito importante para PDFs
    });

    if (response.status !== 200) {
      console.error("Erro ao gerar PDF:", response);
      throw new Error("Erro ao gerar PDF");
    }

    // Cria uma URL temporária do PDF
    const file = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);

    // Abre o PDF numa nova aba
    window.open(fileURL, "_blank");

  } catch (error) {
    toast.error("Erro ao gerar PDF.");
    console.error(error);
  }
}

export async function gerarRelatorioContaFinanceira(contaId: number | undefined, data_inicial: string, data_final: string) {
  try {
    const response = await api.get(`conta-financeira/relatorio/${contaId}`, {
      responseType: 'blob', // ⚠️ Muito importante para PDFs
      params: { data_inicial, data_final }
    });

    if (response.status !== 200) {
      console.error("Erro ao gerar PDF:", response);
      throw new Error("Erro ao gerar PDF");
    }

    // Cria uma URL temporária do PDF
    const file = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);

    // Abre o PDF numa nova aba
    window.open(fileURL, "_blank");

  } catch (error) {
    toast.error("Erro ao gerar PDF.");
    console.error(error);
  }
}
