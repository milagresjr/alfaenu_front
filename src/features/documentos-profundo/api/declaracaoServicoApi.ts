import { api } from "@/services/api"

export const uploadDeclaracaoServico = async (clienteId: string, file: File): Promise<{ declaracao_servico_url: string; declaracao_servico_nome: string; declaracao_servico_path: string }> => {
  const formData = new FormData()
  formData.append('declaracao_servico', file)
  const response = await api.post(`/documento-profundo-status/${clienteId}/upload-declaracao-servico`, formData)
  return response.data
}

export const getDeclaracoesServico = async (page = 1, per_page = 15): Promise<{
  data: import("@/features/documentos-profundo/types").DocumentoProfundoStatus[]
  current_page: number
  last_page: number
  total: number
  per_page: number
}> => {
  const response = await api.get('/documento-profundo-status/declaracoes-servico', { params: { page, per_page } })
  return response.data
}
