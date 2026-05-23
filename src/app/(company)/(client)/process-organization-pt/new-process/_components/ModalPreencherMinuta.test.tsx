// __tests__/components/ModalPreencherMinuta.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { toast } from 'react-toastify'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@/services/api'
import { ModalPreencherMinuta } from './ModalPreencherMinuta'

// Mock do URL
global.URL.createObjectURL = vi.fn()
global.URL.revokeObjectURL = vi.fn()

describe('ModalPreencherMinuta', () => {
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
      <ModalPreencherMinuta
        open={true}
        onOpenChange={vi.fn()}
      />
    )

    expect(screen.getByText('Preencher Minuta')).toBeInTheDocument()
    expect(screen.getByText('Dados do Requerente')).toBeInTheDocument()
    expect(screen.getByText('Dados da Formação')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome Completo *')).toBeInTheDocument()
    expect(screen.getByLabelText('Naturalidade *')).toBeInTheDocument()
  })

  // Teste 2: Não renderiza quando open=false
  it('não renderiza o modal quando fechado', () => {
    render(
      <ModalPreencherMinuta
        open={false}
        onOpenChange={vi.fn()}
      />
    )

    expect(screen.queryByText('Preencher Minuta')).not.toBeInTheDocument()
  })

  // Teste 3: Preenche campos iniciais quando fornecidos
  it('preenche os campos com initialValues quando fornecidos', () => {
    const initialValues = {
      nome_completo: 'João Silva',
      naturalidade: 'São Paulo',
      nacionalidade: 'Brasileira',
    }

    render(
      <ModalPreencherMinuta
        open={true}
        onOpenChange={vi.fn()}
        initialValues={initialValues}
      />
    )

    expect(screen.getByLabelText('Nome Completo *')).toHaveValue('João Silva')
    expect(screen.getByLabelText('Naturalidade *')).toHaveValue('São Paulo')
    expect(screen.getByLabelText('Nacionalidade *')).toHaveValue('Brasileira')
  })

  // Teste 4: Valida campos obrigatórios antes de enviar
  it('exibe aviso quando campos obrigatórios estão vazios', async () => {
    render(
      <ModalPreencherMinuta
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
  it('envia requisição com dados válidos e baixa o PDF', async () => {
    const mockBlob = new Blob(['PDF content'], { type: 'application/pdf' })
    const mockUrl = 'blob:http://localhost:3000/123'

    const apiPostMock = vi.spyOn(api, 'post').mockResolvedValue({
      headers: { 'content-type': 'application/pdf' },
      data: mockBlob,
    } as any)

    // Mock do URL.createObjectURL
    global.URL.createObjectURL = vi.fn().mockReturnValue(mockUrl)
    global.URL.revokeObjectURL = vi.fn()

    // Mock do link download
    const mockLink = document.createElement('a') as HTMLAnchorElement
    mockLink.click = vi.fn()

    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = vi.spyOn(document, 'createElement')
    createElementSpy.mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        return mockLink as any
      }
      return originalCreateElement(tagName)
    })

    render(
      <ModalPreencherMinuta
        open={true}
        onOpenChange={vi.fn()}
      />
    )

    // Preenche campos obrigatórios
    fireEvent.change(screen.getByLabelText('Nome Completo *'), { target: { value: 'João Silva Santos' } })
    fireEvent.change(screen.getByLabelText('Naturalidade *'), { target: { value: 'São Paulo/SP' } })
    fireEvent.change(screen.getByLabelText('Nacionalidade *'), { target: { value: 'Brasileira' } })
    fireEvent.change(screen.getByLabelText('Número do Passaporte *'), { target: { value: 'AB123456' } })
    fireEvent.change(screen.getByLabelText('Escola Profissional *'), { target: { value: 'Senac SP' } })
    fireEvent.change(screen.getByLabelText('Curso *'), { target: { value: 'Desenvolvimento Web' } })
    fireEvent.change(screen.getByLabelText('Duração do Curso *'), { target: { value: '6 meses' } })
    fireEvent.change(screen.getByLabelText('Duração do Estágio *'), { target: { value: '3 meses' } })
    fireEvent.change(screen.getByLabelText('Local de Hospedagem *'), { target: { value: 'Hotel Central' } })

    // Preenche campos de data
    fireEvent.change(screen.getByLabelText('Data de Emissão *'), { target: { value: '2024-01-01' } })
    fireEvent.change(screen.getByLabelText('Data de Validade *'), { target: { value: '2029-01-01' } })
    fireEvent.change(screen.getByLabelText('Data Prevista de Estadia *'), { target: { value: '2024-06-01' } })
    fireEvent.change(screen.getByLabelText('Início da Formação Profissional *'), { target: { value: '2024-06-15' } })
    fireEvent.change(screen.getByLabelText('Término da Formação Profissional *'), { target: { value: '2024-12-15' } })

    // Envia formulário
    const gerarButton = screen.getByRole('button', { name: /gerar minuta/i })
    fireEvent.click(gerarButton)

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        'minuta1/gerar-pdf',
        expect.objectContaining({
          nome_completo: 'João Silva Santos',
          naturalidade: 'São Paulo/SP',
          nacionalidade: 'Brasileira',
          num_passaporte: 'AB123456',
          escola_profissional: 'Senac SP',
          curso: 'Desenvolvimento Web',
          duracao_curso: '6 meses',
          duracao_estagio: '3 meses',
          local_hospedagem: 'Hotel Central',
        }),
        { responseType: 'blob' }
      )

      expect(toast.success).toHaveBeenCalledWith('Minuta gerada com sucesso!')
    })
  })

  // Teste 6: Trata erro na requisição
  it('exibe erro quando a requisição falha', async () => {
    vi.spyOn(api, 'post').mockResolvedValue({
      headers: { 'content-type': 'application/json' },
      data: new Blob(['{"message":"Erro interno"}'], { type: 'application/json' }),
    } as any)

    render(
      <ModalPreencherMinuta
        open={true}
        onOpenChange={vi.fn()}
      />
    )

    // Preenche campos obrigatórios para chegar na requisição
    fireEvent.change(screen.getByLabelText('Nome Completo *'), { target: { value: 'João Silva Santos' } })
    fireEvent.change(screen.getByLabelText('Naturalidade *'), { target: { value: 'São Paulo/SP' } })
    fireEvent.change(screen.getByLabelText('Nacionalidade *'), { target: { value: 'Brasileira' } })
    fireEvent.change(screen.getByLabelText('Número do Passaporte *'), { target: { value: 'AB123456' } })
    fireEvent.change(screen.getByLabelText('Escola Profissional *'), { target: { value: 'Senac SP' } })
    fireEvent.change(screen.getByLabelText('Curso *'), { target: { value: 'Desenvolvimento Web' } })
    fireEvent.change(screen.getByLabelText('Duração do Curso *'), { target: { value: '6 meses' } })
    fireEvent.change(screen.getByLabelText('Duração do Estágio *'), { target: { value: '3 meses' } })
    fireEvent.change(screen.getByLabelText('Local de Hospedagem *'), { target: { value: 'Hotel Central' } })
    fireEvent.change(screen.getByLabelText('Data de Emissão *'), { target: { value: '2024-01-01' } })
    fireEvent.change(screen.getByLabelText('Data de Validade *'), { target: { value: '2029-01-01' } })
    fireEvent.change(screen.getByLabelText('Data Prevista de Estadia *'), { target: { value: '2024-06-01' } })
    fireEvent.change(screen.getByLabelText('Início da Formação Profissional *'), { target: { value: '2024-06-15' } })
    fireEvent.change(screen.getByLabelText('Término da Formação Profissional *'), { target: { value: '2024-12-15' } })

    const gerarButton = screen.getByRole('button', { name: /gerar minuta/i })
    fireEvent.click(gerarButton)

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled()
      expect(toast.error).toHaveBeenCalledWith('Erro ao gerar minuta. Tente novamente.')
    })
  })

  // Teste 7: Botão de cancelar fecha o modal
  it('chama onOpenChange com false ao clicar em cancelar', () => {
    const onOpenChangeMock = vi.fn()

    render(
      <ModalPreencherMinuta
        open={true}
        onOpenChange={onOpenChangeMock}
      />
    )

    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    fireEvent.click(cancelButton)

    expect(onOpenChangeMock).toHaveBeenCalledWith(false)
  })
})