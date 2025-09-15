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