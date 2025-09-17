import { api } from "@/services/api";
import { clsx, type ClassValue } from "clsx"
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function gerarPdfContrato(documentoId: number | undefined) {
  try {
    const response = await api.get(`contract/${documentoId}/gerar-pdf`, {
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
