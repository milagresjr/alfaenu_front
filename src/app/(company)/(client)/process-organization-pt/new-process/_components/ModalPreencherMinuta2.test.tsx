import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { toast } from 'react-toastify'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@/services/api'
import { ModalPreencherMinuta2 } from './ModalPreencherMinuta2'

global.URL.createObjectURL = vi.fn()
global.URL.revokeObjectURL = vi.fn()

const mockHtmlContent = '<!DOCTYPE html><html><body><p>Minuta 2 gerada por IA</p></body></html>'

function preencherFormulario() {
  fireEvent.change(screen.getByLabelText('Local de Hospedagem *'), { target: { value: 'Hotel Central, Av. da Liberdade, Lisboa' } })
  fireEvent.change(screen.getByLabelText('Data Prevista de Chegada *'), { target: { value: '2024-06-01' } })
}

describe('ModalPreencherMinuta2', () => {
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
      <ModalPreencherMinuta2
        open={true}
        onOpenChange={vi.fn()}
      />
    )

    expect(screen.getByText('Preencher Minuta 2')).toBeInTheDocument()
    expect(screen.getByLabelText('Data Prevista de Chegada *')).toBeInTheDocument()
    expect(screen.getByLabelText('Local de Hospedagem *')).toBeInTheDocument()
  })

  it('não renderiza quando fechado', () => {
    render(
      <ModalPreencherMinuta2
        open={false}
        onOpenChange={vi.fn()}
      />
    )

    expect(screen.queryByText('Preencher Minuta 2')).not.toBeInTheDocument()
  })

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

  it('chama gerar-pdf e mostra iframe no preview', async () => {
    render(
      <ModalPreencherMinuta2
        open={true}
        onOpenChange={vi.fn()}
      />
    )

    preencherFormulario()

    const gerarButton = screen.getByRole('button', { name: /gerar minuta/i })
    fireEvent.click(gerarButton)

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        'minuta2/gerar-pdf',
        expect.objectContaining({
          local_hospedagem: 'Hotel Central, Av. da Liberdade, Lisboa',
          data_prevista_chegada: '2024-06-01',
        }),
      )

      expect(screen.getByText('Pré-visualizar Minuta 2')).toBeInTheDocument()
    })

    await waitFor(() => {
      const iframe = document.querySelector('iframe')
      expect(iframe).toBeInTheDocument()
      expect(iframe).toHaveAttribute('srcdoc', mockHtmlContent)
    })
  })

  it('mostra botoes Cancelar, Regenerar e Aprovar no preview, e Baixar apos aprovar', async () => {
    render(
      <ModalPreencherMinuta2
        open={true}
        onOpenChange={vi.fn()}
      />
    )

    preencherFormulario()

    const gerarButton = screen.getByRole('button', { name: /gerar minuta/i })
    fireEvent.click(gerarButton)

    await waitFor(() => {
      expect(screen.getByText('Pré-visualizar Minuta 2')).toBeInTheDocument()
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
      expect(screen.getByText('Minuta 2 Aprovada')).toBeInTheDocument()
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
      <ModalPreencherMinuta2
        open={true}
        onOpenChange={vi.fn()}
      />
    )

    preencherFormulario()

    const gerarButton = screen.getByRole('button', { name: /gerar minuta/i })
    fireEvent.click(gerarButton)

    await waitFor(() => {
      expect(screen.getByText('Pré-visualizar Minuta 2')).toBeInTheDocument()
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
      <ModalPreencherMinuta2
        open={true}
        onOpenChange={vi.fn()}
      />
    )

    preencherFormulario()

    const gerarButton = screen.getByRole('button', { name: /gerar minuta/i })
    fireEvent.click(gerarButton)

    await waitFor(() => {
      expect(screen.getByText('Pré-visualizar Minuta 2')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(document.querySelector('iframe')).toBeInTheDocument()
    })

    const aprovarButton = screen.getByRole('button', { name: /aprovar/i })
    fireEvent.click(aprovarButton)

    await waitFor(() => {
      expect(screen.getByText('Minuta 2 Aprovada')).toBeInTheDocument()
    })

    const baixarButton = screen.getByRole('button', { name: /baixar/i })
    fireEvent.click(baixarButton)

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        'minuta2/baixar-pdf',
        { cliente_id: undefined, conteudo_html: mockHtmlContent },
        { responseType: 'blob' }
      )
      expect(toast.success).toHaveBeenCalledWith('Minuta gerada com sucesso!')
    })
  })

  it('exibe erro quando gerar-pdf falha', async () => {
    vi.spyOn(api, 'post').mockRejectedValue({
      response: { data: { message: 'Erro ao gerar minuta 2.' } },
    })

    render(
      <ModalPreencherMinuta2
        open={true}
        onOpenChange={vi.fn()}
      />
    )

    preencherFormulario()

    const gerarButton = screen.getByRole('button', { name: /gerar minuta/i })
    fireEvent.click(gerarButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao gerar minuta 2.')
    })
  })

  it('chama onOpenChange com false ao clicar em cancelar no form', () => {
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
