// components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, vi, it } from 'vitest';
import { Button } from '../ui/button';

it('renderiza o texto do botão corretamente', () => {
  render(<Button onClick={() => {}}>Clique aqui</Button>);
  expect(screen.getByText('Clique aqui')).toBeInTheDocument();
});

it('chama a função onClick quando clicado', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Clique</Button>);
  
  fireEvent.click(screen.getByText('Clique'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});