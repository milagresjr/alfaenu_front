// __tests__/components/ModalPreencherMinuta2.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { toast } from 'react-toastify'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@/services/api'
import { ModalPreencherMinuta2 } from './ModalPreencherMinuta2'

// Mock do URL
global.URL.createObjectURL = vi.fn()
global.URL.revokeObjectURL = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()

  // Mock do toast
  toast.success = vi.fn()
  toast.error = vi.fn()
  toast.warning = vi.fn()

  // Mock do console.error para evitar poluição
  console.error = vi.fn()
})

describe('ModalPreencherMinuta 2', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.spyOn(api, 'post').mockResolvedValue({
      headers: { 'content-type': 'application/pdf' },
      data: new Blob(['PDF content'], { type: 'application/pdf' }),
    } as any)
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url')
    global.URL.revokeObjectURL = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })


  // Teste 1: Renderiza o modal quando open=true
  it('renderiza o modal corretamente quando aberto', () => {
    render(
      <ModalPreencherMinuta2
        open={true}
        onOpenChange={vi.fn()}
      />
    )

    expect(screen.getByText('Preencher Minuta 2')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome *')).toBeInTheDocument()
    expect(screen.getByLabelText('Curso *')).toBeInTheDocument()
    expect(screen.getByLabelText('Data de Validade *')).toBeInTheDocument()
  })

  // Teste 2: Não renderiza quando open=false
  it('não renderiza o modal quando fechado', () => {
    render(
      <ModalPreencherMinuta2
        open={false}
        onOpenChange={vi.fn()}
      />
    )

    expect(screen.queryByText('Preencher Minuta 2')).not.toBeInTheDocument()
  })

  // Teste 3: Preenche campos iniciais quando fornecidos
  it('preenche os campos com initialValues quando fornecidos', () => {
    const initialValues = {
      nome: 'João Silva',
      curso: 'Desenvolvimento Web',
      num_passaporte: 'AB123456',
    }

    render(
      <ModalPreencherMinuta2
        open={true}
        onOpenChange={vi.fn()}
        initialValues={initialValues}
      />
    )

    expect(screen.getByLabelText('Nome *')).toHaveValue('João Silva')
    expect(screen.getByLabelText('Curso *')).toHaveValue('Desenvolvimento Web')
    expect(screen.getByLabelText('Número do Passaporte *')).toHaveValue('AB123456')
  })

  // Teste 4: Valida campos obrigatórios antes de enviar
  it('exibe aviso quando campos obrigatórios estão vazios', async () => {
    render(
      <ModalPreencherMinuta2
        open={true}
        onOpenChange={vi.fn()}
      />
    )

    const gerarButton = screen.getByRole('button', { name: /gerar minuta/i })
    fireEvent.click(gerarButton)

    expect(toast.warning).toHaveBeenCalledWith('Por favor, corrija os erros no formulário.')
    expect(api.post).not.toHaveBeenCalled()
  })

  // Teste 5: Envia requisição com sucesso
  // it('envia requisição com dados válidos e baixa o PDF', async () => {
  //   const mockBlob = new Blob(['PDF content'], { type: 'application/pdf' })
  //   const mockUrl = 'blob:http://localhost:3000/123'

  //   const apiPostMock = vi.spyOn(api, 'post').mockResolvedValue({
  //     headers: { 'content-type': 'application/pdf' },
  //     data: mockBlob,
  //   } as any)

  //   global.URL.createObjectURL = vi.fn().mockReturnValue(mockUrl)
  //   global.URL.revokeObjectURL = vi.fn()

  //   const mockLink = document.createElement('a') as HTMLAnchorElement
  //   mockLink.click = vi.fn()

  //   const originalCreateElement = document.createElement.bind(document)
  //   const createElementSpy = vi.spyOn(document, 'createElement')
  //   createElementSpy.mockImplementation((tagName: string) => {
  //     if (tagName === 'a') {
  //       return mockLink as any
  //     }
  //     return originalCreateElement(tagName)
  //   })

  //   render(
  //     <ModalPreencherMinuta2
  //       open={true}
  //       onOpenChange={vi.fn()}
  //     />
  //   )

  //   // Preenche TODOS os campos obrigatórios
  //   fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'João Silva Santos' } })
  //   fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: '2000-01-11' } })
  //   fireEvent.change(screen.getByLabelText(/local de nascimento/i), { target: { value: 'Luanda' } })
  //   fireEvent.change(screen.getByLabelText(/residência atual/i), { target: { value: 'Luanda' } })
  //   fireEvent.change(screen.getByLabelText(/número do passaporte/i), { target: { value: 'AB123456' } })
  //   fireEvent.change(screen.getByLabelText(/local de emissão/i), { target: { value: 'SME - Luanda' } })
  //   fireEvent.change(screen.getByLabelText(/data de emissão/i), { target: { value: '2024-01-01' } })
  //   fireEvent.change(screen.getByLabelText(/data de validade/i), { target: { value: '2029-01-01' } })
  //   fireEvent.change(screen.getByLabelText(/curso/i), { target: { value: 'Desenvolvimento Web' } })
  //   fireEvent.change(screen.getByLabelText(/nome da escola/i), { target: { value: 'Escola Nova' } })
  //   fireEvent.change(screen.getByLabelText(/local da escola/i), { target: { value: 'Lisboa' } })
  //   fireEvent.change(screen.getByLabelText(/data prevista de chegada/i), { target: { value: '2024-06-01' } })
  //   fireEvent.change(screen.getByLabelText(/local de hospedagem/i), { target: { value: 'Hotel Central' } })

  //   const gerarButton = screen.getByRole('button', { name: /gerar minuta/i })
  //   fireEvent.click(gerarButton)

  //   await waitFor(() => {
  //     expect(api.post).toHaveBeenCalledWith(
  //       'minuta2/gerar-pdf',
  //       expect.objectContaining({
  //         nome: 'João Silva Santos',
  //         data_nascimento: '2000-01-11',
  //         local_nascimento: 'Luanda',
  //         residencia_atual: 'Luanda',
  //         num_passaporte: 'AB123456',
  //         local_emissao: 'SME - Luanda',
  //         data_emissao: '2024-01-01',
  //         data_validade: '2029-01-01',
  //         curso: 'Desenvolvimento Web',
  //         nome_escola: 'Escola Nova',
  //         local_escola: 'Lisboa',
  //         data_prevista_chegada: '2024-06-01',
  //         local_hospedagem: 'Hotel Central',
  //       }),
  //       { responseType: 'blob' }
  //     )

  //     expect(toast.success).toHaveBeenCalledWith('Minuta gerada com sucesso!')
  //   })
  // })

  // Teste 6: Trata erro na requisição
  // it('exibe erro quando a requisição falha', async () => {
  //   vi.spyOn(api, 'post').mockResolvedValue({
  //     headers: { 'content-type': 'application/json' },
  //     data: new Blob(['{"message":"Erro interno"}'], { type: 'application/json' }),
  //   } as any)

  //   render(
  //     <ModalPreencherMinuta2
  //       open={true}
  //       onOpenChange={vi.fn()}
  //     />
  //   );

  //   // Preenche campos obrigatórios para chegar na requisição
  //   fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'João Silva Santos' } })
  //   fireEvent.change(screen.getByLabelText('Número do Passaporte'), { target: { value: 'AB123456' } })
  //   fireEvent.change(screen.getByLabelText('Curso'), { target: { value: 'Desenvolvimento Web' } })
  //   fireEvent.change(screen.getByLabelText('Data de Emissão'), { target: { value: '2024-01-01' } })
  //   fireEvent.change(screen.getByLabelText('Data de Validade'), { target: { value: '2029-01-01' } })
  //   fireEvent.change(screen.getByLabelText('Data Prevista de Chegada'), { target: { value: '2024-06-01' } })
  //   fireEvent.change(screen.getByLabelText('Local de Hospedagem *'), { target: { value: 'Hotel Central' } })

  //   const gerarButton = screen.getByRole('button', { name: /gerar minuta/i })
  //   fireEvent.click(gerarButton)

  //   await waitFor(() => {
  //     expect(api.post).toHaveBeenCalled()
  //     expect(toast.error).toHaveBeenCalledWith('Erro ao gerar minuta. Tente novamente.')
  //   })
  // })

  // Teste 7: Botão de cancelar fecha o modal
  it('chama onOpenChange com false ao clicar em cancelar', () => {
    const onOpenChangeMock = vi.fn()

    render(
      <ModalPreencherMinuta2
        open={true}
        onOpenChange={onOpenChangeMock}
      />
    )

    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    fireEvent.click(cancelButton)

    expect(onOpenChangeMock).toHaveBeenCalledWith(false)
  })
})