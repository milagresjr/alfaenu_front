import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { toast } from 'react-toastify'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@/services/api'
import { ModalPreencherMinuta } from './ModalPreencherMinuta'

global.URL.createObjectURL = vi.fn()
global.URL.revokeObjectURL = vi.fn()

const mockHtmlContent = '<!DOCTYPE html><html><body><p>Minuta gerada por IA</p></body></html>'

function preencherFormulario() {
  fireEvent.change(screen.getByLabelText('Duração do Estágio *'), { target: { value: '3 meses' } })
  fireEvent.change(screen.getByLabelText('Local de Hospedagem *'), { target: { value: 'Rua das Flores, nº 45, Lisboa' } })
  fireEvent.change(screen.getByLabelText('Data Prevista de Estadia *'), { target: { value: '2024-06-01' } })
  fireEvent.change(screen.getByLabelText('Início da Formação Profissional *'), { target: { value: '2024-06-15' } })
  fireEvent.change(screen.getByLabelText('Término da Formação Profissional *'), { target: { value: '2024-12-15' } })
}

describe('ModalPreencherMinuta', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.spyOn(api, 'post').mockResolvedValue({
      data: { conteudo_html: mockHtmlContent },
    } as any)
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url')
    global.URL.revokeObjectURL = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renderiza o formulário corretamente quando aberto', () => {
    render(
      <ModalPreencherMinuta
        open={true}
        onOpenChange={vi.fn()}
      />
    )

    expect(screen.getByText('Preencher Minuta')).toBeInTheDocument()
    expect(screen.getByLabelText('Data Prevista de Estadia *')).toBeInTheDocument()
    expect(screen.getByLabelText('Início da Formação Profissional *')).toBeInTheDocument()
    expect(screen.getByLabelText('Término da Formação Profissional *')).toBeInTheDocument()
    expect(screen.getByLabelText('Duração do Estágio *')).toBeInTheDocument()
    expect(screen.getByLabelText('Local de Hospedagem *')).toBeInTheDocument()
  })

  it('não renderiza quando fechado', () => {
    render(
      <ModalPreencherMinuta
        open={false}
        onOpenChange={vi.fn()}
      />
    )

    expect(screen.queryByText('Preencher Minuta')).not.toBeInTheDocument()
  })

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

  it('chama gerar-pdf e mostra iframe no preview', async () => {
    render(
      <ModalPreencherMinuta
        open={true}
        onOpenChange={vi.fn()}
      />
    )

    preencherFormulario()

    const gerarButton = screen.getByRole('button', { name: /gerar minuta/i })
    fireEvent.click(gerarButton)

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        'minuta1/gerar-pdf',
        expect.objectContaining({
          duracao_estagio: '3 meses',
          local_hospedagem: 'Rua das Flores, nº 45, Lisboa',
          data_prevista_estadia: '2024-06-01',
          inicio_formacao_profissional: '2024-06-15',
          termino_formacao_profissional: '2024-12-15',
        }),
      )

      expect(screen.getByText('Pré-visualizar Minuta')).toBeInTheDocument()
    })

    await waitFor(() => {
      const iframe = document.querySelector('iframe')
      expect(iframe).toBeInTheDocument()
      expect(iframe).toHaveAttribute('srcdoc', mockHtmlContent)
    })
  })

  it('mostra botoes Cancelar, Regenerar e Aprovar no preview, e Baixar apos aprovar', async () => {
    render(
      <ModalPreencherMinuta
        open={true}
        onOpenChange={vi.fn()}
      />
    )

    preencherFormulario()

    const gerarButton = screen.getByRole('button', { name: /gerar minuta/i })
    fireEvent.click(gerarButton)

    await waitFor(() => {
      expect(screen.getByText('Pré-visualizar Minuta')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(document.querySelector('iframe')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /regenerar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /aprovar/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /baixar/i })).not.toBeInTheDocument()

    const aprovarButton = screen.getByRole('button', { name: /aprovar/i })
    fireEvent.click(aprovarButton)

    await waitFor(() => {
      expect(screen.getByText('Minuta Aprovada')).toBeInTheDocument()
    })

    expect(screen.queryByRole('button', { name: /regenerar/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /aprovar/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /baixar/i })).toBeInTheDocument()
  })

  it('regenerar chama gerar-pdf novamente e atualiza o iframe', async () => {
    const apiPostMock = vi.spyOn(api, 'post')
    apiPostMock.mockResolvedValue({
      data: { conteudo_html: '<html><body><p>Segunda versao</p></body></html>' },
    } as any)

    render(
      <ModalPreencherMinuta
        open={true}
        onOpenChange={vi.fn()}
      />
    )

    preencherFormulario()

    const gerarButton = screen.getByRole('button', { name: /gerar minuta/i })
    fireEvent.click(gerarButton)

    await waitFor(() => {
      expect(screen.getByText('Pré-visualizar Minuta')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(document.querySelector('iframe')).toBeInTheDocument()
    })

    const regenerarButton = screen.getByRole('button', { name: /regenerar/i })
    fireEvent.click(regenerarButton)

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(2)
    })

    await waitFor(() => {
      const iframe = document.querySelector('iframe')
      expect(iframe).toBeInTheDocument()
      expect(iframe).toHaveAttribute('srcdoc', '<html><body><p>Segunda versao</p></body></html>')
    })
  })

  it('chama baixar-pdf ao clicar em Baixar apos aprovacao', async () => {
    const mockBlob = new Blob(['PDF content'], { type: 'application/pdf' })

    const apiPostMock = vi.spyOn(api, 'post')
    apiPostMock.mockResolvedValueOnce({
      data: { conteudo_html: mockHtmlContent },
    } as any)
    apiPostMock.mockResolvedValueOnce({
      data: mockBlob,
    } as any)

    render(
      <ModalPreencherMinuta
        open={true}
        onOpenChange={vi.fn()}
      />
    )

    preencherFormulario()

    const gerarButton = screen.getByRole('button', { name: /gerar minuta/i })
    fireEvent.click(gerarButton)

    await waitFor(() => {
      expect(screen.getByText('Pré-visualizar Minuta')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(document.querySelector('iframe')).toBeInTheDocument()
    })

    const aprovarButton = screen.getByRole('button', { name: /aprovar/i })
    fireEvent.click(aprovarButton)

    await waitFor(() => {
      expect(screen.getByText('Minuta Aprovada')).toBeInTheDocument()
    })

    const baixarButton = screen.getByRole('button', { name: /baixar/i })
    fireEvent.click(baixarButton)

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        'minuta1/baixar-pdf',
        { cliente_id: undefined, conteudo_html: mockHtmlContent },
        { responseType: 'blob' }
      )
      expect(toast.success).toHaveBeenCalledWith('Minuta gerada com sucesso!')
    })
  })

  it('exibe erro quando gerar-pdf falha', async () => {
    vi.spyOn(api, 'post').mockRejectedValue({
      response: { data: { message: 'Cliente não possui solicitação de matrícula aprovada.' } },
    })

    render(
      <ModalPreencherMinuta
        open={true}
        onOpenChange={vi.fn()}
      />
    )

    preencherFormulario()

    const gerarButton = screen.getByRole('button', { name: /gerar minuta/i })
    fireEvent.click(gerarButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Cliente não possui solicitação de matrícula aprovada.')
    })
  })

  it('chama onOpenChange com false ao clicar em cancelar no form', () => {
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
