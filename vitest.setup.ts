import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest'

// Mock do toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}))