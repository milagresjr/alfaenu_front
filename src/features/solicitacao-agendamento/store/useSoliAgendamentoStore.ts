import { create } from 'zustand'
import { SolicitacaoAgendamentoType } from '../types'

type SoliAgendamentoState = {
  selectedSolicitacao: SolicitacaoAgendamentoType | null
  setSelectedSolicitacao: (solicitacao: SolicitacaoAgendamentoType | null) => void
}

export const useSoliAgendamentoStore = create<SoliAgendamentoState>((set) => ({
  selectedSolicitacao: null,
  setSelectedSolicitacao: (solicitacao) => set({ selectedSolicitacao: solicitacao }),
}))
